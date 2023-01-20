# Author:   coneypo
# Blog:     http://www.cnblogs.com/AdaminXie
# GitHub:   https://github.com/coneypo/Dlib_face_cut

import dlib
import numpy as np
import cv2
import os

# Dlib Library를 활용하여 얼굴 좌표를 가져와 detector에 저장
detector = dlib.get_frontal_face_detector()

# Dlib 얼굴 landmark 특징점 검출기
predictor = dlib.shape_predictor(
    'data/dlib/shape_predictor_68_face_landmarks.dat')

# 불러올 이미지 지정
path_read = "data/images/faces_for_test/"
img = cv2.imread(path_read + "test_faces_4.jpg")

# 저장할 경로 지정
path_save = "data/images/faces_separated/"


# 저장 폴더가 존재하지 않을 경우 생성
def mkdir_for_save_images():
    if not os.path.isdir(path_save):
        os.mkdir(path_save)


# path_save 경로에 이미지가 이미 있을 경우 모두 삭제
def clear_images():
    img_list = os.listdir(path_save)
    for img in img_list:
        os.remove(path_save + img)


def main():
    # 폴더 생성 함수 및 해당 경로에 저장된 이미지 삭제
    mkdir_for_save_images()
    clear_images()

    faces = detector(img, 1)

    print("찾은 얼굴 수:", len(faces), '\n')
    print(faces)

    c_faces = []

    # 왼쪽 얼굴부터 사진으로 만들도록 정렬
    for face in faces:
        c_faces.append([face.left(), face.top(), face.right(), face.bottom()])
    c_faces = sorted(c_faces, key=lambda x: x[0])

    for num, face in enumerate(c_faces):
        # 사각형 사이즈 계산
        height = face[3] - face[1]
        width = face[2] - face[0]

        # 얼굴 사이즈에 맞는 빈 이미지 생성
        img_blank = np.zeros((height, width, 3), np.uint8)

        for i in range(height):
            for j in range(width):
                img_blank[i][j] = img[face[1] + i][face[0] + j]

        # cv2.imshow("face_"+str(num+1), img_blank)

        # 이미지 저장
        print("Save into:", path_save + "img_face_" + str(num + 1) + ".jpg")
        cv2.imwrite(path_save + "img_face_" + str(num + 1) + ".jpg", img_blank)


if __name__ == '__main__':
    main()
