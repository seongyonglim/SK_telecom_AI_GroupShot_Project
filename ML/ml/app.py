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

path_main = "images/main_img/"  # 대표 이미지 저장 경로
path_selected_img = "images/selected_img/"  # 선택 이미지 저장 경로


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


# @app.route('/deep', methods=['GET', 'POST'])
def flask_to_react():
    main_img = os.listdir(path_main)[0]

    cf_names, cf_coordinates = detect_faces_masks.main()

    combine.main(cf_names, cf_coordinates, main_img, '1_2.jpg')

    path_read = "images/BestShot/"
    # img_list = os.listdir(path_read)


if __name__ == "__main__":
    init_dirs()

    print('Collecting images')
    
    cp = CloudPath("s3://sktcroppedimage/selected_imgs/")
    cp.download_to(path_selected_img)
    print('\nSelected images download completed\n')

    main = CloudPath("s3://sktcroppedimage/main_img/")
    main.download_to(path_main)
    print('\nmain images download completed\n')

    flask_to_react()

    # app.run(host='0.0.0.0', port='5000', debug=True)
