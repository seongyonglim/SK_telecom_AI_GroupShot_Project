import glob
import os
import detect_faces_masks
import combine
from cloudpathlib import CloudPath
from flask import Flask
from flask_cors import CORS
import boto3

# 현우 수정
import draw_face

app = Flask(__name__)
CORS(app)

aws_path = "s3://bucketpresident/"

path_main = "images/main_img/"  # 대표 이미지 저장 경로
path_selected_img = "images/selected_img/"  # 선택 이미지 저장 경로
path_face = "images/faces_separated/"  # 얼굴 이미지 저장 경로
path_result = "images/result_img/"  # 결과물 이미지 저장 경로
path_boxed = "images/boxed_img/"  # 박스처리 이미지 저장 경로
path_face_num = "images/face_num/"  # 얼굴 이미지 저장 경로
path_pageIndex = "images/pageIndex/"  # 몇번째 얼굴 편집중인지 전달 받기위한 폴더 경로

# 현우 수정
selected_face_path = "images/want_to_modify/"  # 대체할 얼굴 이름 저장

cf_names, cf_coordinates, main_full_coordinates, cropped_face_full_coordinates, face_idxs, cur, sel_idx = [], [], [], [], [], 0, 0


# 로컬 폴더 정리 함수
def init_dirs():
    if not os.path.isdir("images/"):
        os.mkdir("images/")
    # 대표이미지 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_main):
        os.mkdir(path_main)
    img_list = os.listdir(path_main)
    for img in img_list:
        os.remove(path_main + img)

    # 선택 이미지 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_selected_img):
        os.mkdir(path_selected_img)
    img_list = os.listdir(path_selected_img)
    for img in img_list:
        os.remove(path_selected_img + img)

    # 결과 이미지 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_result):
        os.mkdir(path_result)
    img_list = os.listdir(path_result)
    for img in img_list:
        os.remove(path_result + img)

    # 박스처리 이미지 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_boxed):
        os.mkdir(path_boxed)
    img_list = os.listdir(path_boxed)
    for img in img_list:
        os.remove(path_boxed + img)

    # 얼굴 이미지 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_face):
        os.mkdir(path_face)
    img_list = os.listdir(path_face)
    for img in img_list:
        os.remove(path_face + img)

    # 사진에 탐지된 인원수 저장 폴더 신규 생성 / 폴더 비우기
    if not os.path.isdir(path_face_num):
        os.mkdir(path_face_num)
    file_list = os.listdir(path_face_num)
    for file in file_list:
        os.remove(path_face_num + file)

    if not os.path.isdir(path_pageIndex):
        os.mkdir(path_pageIndex)
    file_list = os.listdir(path_pageIndex)
    for file in file_list:
        os.remove(path_pageIndex + file)


# AWS로부터 대표사진 및 선택된 사진들 불러오는 함수
def download_from_aws():
    global cur
    cur = 0
    print('Collecting images')
    di = CloudPath(aws_path+"selected_imgs/")
    di.download_to(path_selected_img)
    print('\nSelected images download completed')

    main = CloudPath(aws_path+"main_img/")
    main.download_to(path_main)
    print('\nmain image download completed')

    main.download_to(path_result)
    os.rename(path_result+os.listdir(path_result)[0], path_result+'result.jpg')


# AWS로 얼굴 사진들 업로드하는 함수
def upload_cropped_faces():
    ui = CloudPath(aws_path+"cropped_face_imgs/")
    ui.upload_from(path_face)

    ui = CloudPath(aws_path+"face_num/")
    ui.upload_from(path_face_num)

    print('\nCropped face images upload completed')


# AWS로 얼굴에 박스처리한 사진 업로드하는 함수
def upload_boxed_result_to_aws():
    ui = CloudPath(aws_path+"boxed_img/")
    ui.upload_from(path_boxed)
    print('\nResult image upload completed')


# AWS로 결과물 업로드하는 함수
@ app.route('/upload_result', methods=['GET'])
def upload_result_to_aws():
    ui = CloudPath(aws_path+"result_img/")
    ui.upload_from(path_result)
    print('\nResult image upload completed')
    return "FLASK: Upload Result Done"


# 얼굴사진 및 최종사진 삭제 함수
@ app.route('/cleanup_AWS', methods=['GET'])
def remove_dirs():
    ri = CloudPath(aws_path+"cropped_face_imgs/")
    ri.rmtree()
    ri = CloudPath(aws_path+"result_img/")
    ri.rmtree()
    ri = CloudPath(aws_path+"selected_imgs/")
    ri.rmtree()
    ri = CloudPath(aws_path+"main_img/")
    ri.rmtree()
    ri = CloudPath(aws_path+"face_num/")
    ri.rmtree()
    ri = CloudPath(aws_path+"boxed_img/")
    ri.rmtree()
    ri = CloudPath(aws_path+"pageIndex/")
    ri.rmtree()
    ri = CloudPath(aws_path+"want_to_modify/")
    ri.rmtree()
    print('\nRemoval Completed')
    return "FLASK: Cleanup_AWS Done"


# 업로드 사진 확인 용도로 만들어놓은 함수
def check_uploads():
    path_check = "images/check_downloads/"
    if not os.path.isdir(path_check):
        os.mkdir(path_check)
        os.mkdir(path_check+"cropped_face_imgs/")
        os.mkdir(path_check+"result_img/")

    ci = CloudPath(aws_path+"cropped_face_imgs/")
    ci.download_to(path_check+"cropped_face_imgs/")
    ci = CloudPath(aws_path+"result_img/")
    ci.download_to(path_check+"result_img/")


# 얼굴 crop 하고 AWS에 저장하는 함수
@ app.route('/crop_face', methods=['GET'])
def crop_face():
    global cf_names, cf_coordinates, main_full_coordinates, cropped_face_full_coordinates, face_idxs
    init_dirs()
    download_from_aws()
    # 불러온 사진으로부터 얼굴들만 추출하여 cf_names 에 이름들, cf_coordinates에 시작좌표들 저장
    cf_names, cf_coordinates, main_full_coordinates, cropped_face_full_coordinates, face_idxs = detect_faces_masks.main()

    draw_box()

    upload_cropped_faces()
    return "FLASK: Crop Face Done"


# 현재 편집중인 얼굴에 박스 그리는 함수
@app.route('/draw_box', methods=['GET'])
def draw_box():
    global cur
    # 매실행마다 pageIndex 다운 받고 비운다
    file_list = os.listdir(path_pageIndex)
    for file in file_list:
        os.remove(path_pageIndex + file)

    pi = CloudPath(aws_path+"pageIndex/")
    pi.download_to(path_pageIndex)

    pi = CloudPath(aws_path+"pageIndex/")
    pi.rmtree()

    txt_list = os.listdir(path_pageIndex)
    if len(txt_list) == 1:
        cur = int(txt_list[0][:-4])

    draw_face.main(cur, main_full_coordinates,
                   cropped_face_full_coordinates, face_idxs, sel_idx)

    # AWS에 Result 올라감
    upload_boxed_result_to_aws()

    return "FLASK: Draw Box Done"


# 대표이미지 합성 후 업로드
@app.route('/combine_face', methods=['GET'])
def combine_face():
    global sel_idx, face_idxs
    s3 = boto3.client('s3')

    # "want_to_modify" 폴더를 리스트로 만듦
    result = s3.list_objects_v2(
        Bucket='bucketpresident', Prefix='want_to_modify/')

    # want_to_modify 폴더 안에 당연히 파일이 들어가 있어야되는데 없을 때가 있길래... if, else 문 처리
    if 'Contents' in result:
        # 파일 네임 받는 방법
        # 1. 'want_to_modify/' 폴더를 리스트로 받아옴
        # 2. 폴더 안에 파일 한 개만 있겠지? 첫 번째 파일 가져옴
        # 3. Key 값 받아옴
        # 4. Key 값을 / 기준으로 나누고 마지막거만 가져옴
        selected_face = result['Contents'][0]['Key'].split('/')[-1]
        sel_idx = cf_names.index(selected_face)
        # 자연스럽게 수정해주어요
        combine.main(cf_names, cf_coordinates, selected_face)
        print('\nFace Combine Completed')

        face_idxs[sel_idx % len(face_idxs)] = sel_idx // len(face_idxs)

        # 합성한 사진위에 다시 박스그리기
        draw_box()

        # want_to_modify 지움 나이스
        ri = CloudPath(aws_path+"want_to_modify/")
        ri.rmtree()

        return "FLASK: Combine Face Done"
    else:
        return "No files found in the 'want_to_modify' directory"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)
