from flask import Flask, request
# from flask_cors import CORS
import cv2
import glob

import imagecompare
import detect_faces_masks
import combine

app = Flask(__name__) # 플라스크 api로 던질거 설정(?) 포스트 맨으로 파일 확인할 예정
# CORS(app) # 플라스크 function을 통해서 오류를 확인한다.

img_name = 'a (1).jpg'  # 대표이미지 이름 변수
imagecompare.main(img_name)
cf_names, cf_coordinates = detect_faces_masks.main()
combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')

path_final = "images/BestShot/"

gallery = glob.iglob(f'{path_final}/*')


# lst = []    
# for idx in range(len(list(gallery))):
#     final_img = cv2.imread((list(gallery))[idx])
#     # return final_img
#     print('idx')
#     lst.append(lst)

@app.route('/')
def run():
    x = (list(gallery))[0]
    return x


# app.run()