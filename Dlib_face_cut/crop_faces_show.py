# Author:   coneypo
# Blog:     http://www.cnblogs.com/AdaminXie
# GitHub:   https://github.com/coneypo/Dlib_face_cut

import dlib
import numpy as np
import cv2


def main():
    # Dlib Library를 활용하여 얼굴 좌표를 가져와 detector에 저장
    detector = dlib.get_frontal_face_detector()

    # 불러올 이미지 지정
    path = "data/images/faces_for_test/"
    img = cv2.imread(path + "test_faces_1.jpg")

    # 얼굴 불러오기
    faces = detector(img, 1)

    print("찾은 얼굴 수:", len(faces), "\n")

    # 얼굴 행렬 크기 기록
    height_max = 0
    width_sum = 0

    # 생성할 이미지 img_blank 크기 계산
    for face in faces:

        # 사각형 크기 계산
        height = face.bottom() - face.top()
        width = face.right() - face.left()

        # 너비 처리
        width_sum += width

        # 높이 처리
        if height > height_max:
            height_max = height
        else:
            height_max = height_max

    # 얼굴을 보여줄 창 크기
    print("窗口大小 / Shape of window:", '\n', "高度 / height:",
          height_max, '\n', "宽度 / width: ", width_sum)

    # 얼굴을 보여줄 이미지 생성
    img_blank = np.zeros((height_max, width_sum, 3), np.uint8)

    # 각 얼굴을 입력할 때마다 너비 위치 기록
    blank_start = 0

    # 얼굴을 img_blank에 채우기
    for face in faces:

        height = face.bottom() - face.top()
        width = face.right() - face.left()

        # 채우기
        for i in range(height):
            for j in range(width):
                img_blank[i][blank_start + j] = img[face.top() +
                                                    i][face.left() + j]
        # 이미지 조정
        blank_start += width

    cv2.namedWindow("img_faces")  # , 2)
    cv2.imshow("img_faces", img_blank)
    cv2.waitKey(0)


if __name__ == '__main__':
    main()
