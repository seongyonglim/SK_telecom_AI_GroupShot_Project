from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
import glob
import os
import detect_faces_masks
import combine
import boto3
from cloudpathlib import CloudPath

app = Flask(__name__)  # 플라스크 api로 던질거 설정(?) 포스트 맨으로 파일 확인할 예정
# localurl + /user_img 에서 request설정을 통해 서버에서 flask로 사진전달

aws_path = "s3://bestshot/"

path_main = "images/main_img/"  # 대표 이미지 저장 경로
path_selected_img = "images/selected_img/"  # 선택 이미지 저장 경로
path_face = "images/faces_separated/"  # 얼굴 이미지 저장 경로
path_result = "images/result_img/"  # 결과물 이미지 저장 경로


# 로컬 폴더 정리 함수
def init_dirs():
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


# AWS로부터 대표사진 및 선택된 사진들 불러오는 함수
def download_from_aws():
    print('Collecting images')
    di = CloudPath(aws_path+"selected_imgs/")
    di.download_to(path_selected_img)
    print('\nSelected images download completed')

    main = CloudPath(aws_path+"main_img/")
    main.download_to(path_main)
    print('\nmain image download completed')


# AWS로 얼굴 사진들 업로드하는 함수
def upload_cropped_faces():
    ui = CloudPath(aws_path+"cropped_face_imgs/")
    ui.upload_from(path_face)
    print('\nCropped face images upload completed')


# AWS로 결과물 업로드하는 함수
def upload_result_to_aws():
    ui = CloudPath(aws_path+"result_img/")
    ui.upload_from(path_result)
    print('\nResult image upload completed')


# 얼굴사진 및 최종사진 삭제 함수
def remove_dirs():
    ri = CloudPath(aws_path+"cropped_face_imgs/")
    ri.rmtree()
    ri = CloudPath(aws_path+"result_img/")
    ri.rmtree()
    print('\nRemoval Completed')


# 업로드 사진 확인 용도로 만들어놓은 함수
def check_uploads():
    ci = CloudPath(aws_path+"cropped_face_imgs/")
    ci.download_to("images/check_downloads/cropped_face_imgs/")
    ci = CloudPath(aws_path+"result_img/")
    ci.download_to("images/check_downloads/result_img/")


# 얼굴 추출 후 AWS로 업로드하는 함수
def crop_faces_and_upload():
    # 불러온 사진으로부터 얼굴들만 추출하여 cf_names 에 이름들, cf_coordinates에 시작좌표들 저장
    cf_names, cf_coordinates = detect_faces_masks.main()
    upload_cropped_faces()

    return cf_names, cf_coordinates


# 대표이미지 합성 후 업로드
def combine_image(cf_names, cf_coordinates):
    # 대표이미지 이름 저장
    main_img = os.listdir(path_main)[0]
    # 대체할 얼굴 이름 저장
    selected_face = cf_names[3]

    # 합성할 대상인 main_img에 붙여넣을 얼굴 selected_face를 자연스럽게 합성시킨다
    combine.main(cf_names, cf_coordinates, main_img, selected_face)
    print('\nFace Combine Completed')

    # 합성한 사진 AWS로 업로드
    upload_result_to_aws()


if __name__ == "__main__":
    init_dirs()
    download_from_aws()
    cf_names, cf_coordinates = crop_faces_and_upload()
    combine_image(cf_names, cf_coordinates)
    # check_uploads()
    # remove_dirs()

    # app.run(host='0.0.0.0', port='5000', debug=True)
