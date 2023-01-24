import dlib
import numpy as np
import cv2
import os
# Dlib Library를 활용하여 얼굴 좌표를 가져와 detector에 저장
detector = dlib.get_frontal_face_detector()

# 불러올 이미지 지정
path_read = "images/similar_images/"

# 저장할 경로 지정
path_save = "images/faces_separated/"


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
    # similar images 폴더로부터 모든 사진 파일 이름들을 files에 저장
    files = os.listdir(path_read)

    # faces_separated 폴더가 존재하지 않으면 생성한다. 해당 폴더를 매번 실행할때마다 비움
    mkdir_for_save_images()
    clear_images()

    for num1, file in enumerate(files):
        image = cv2.imread(path_read+file)
        faces = detector(image, 1)

        print("찾은 얼굴 수:", len(faces), '\n')
        print(faces)

        c_faces = []

        # 왼쪽 얼굴부터 사진으로 만들도록 정렬
        for face in faces:
            c_faces.append(
                [face.left(), face.top(), face.right(), face.bottom()])
        c_faces = sorted(c_faces, key=lambda x: x[0])

        for num2, face in enumerate(c_faces):
            # 사각형 사이즈 계산
            height = face[3] - face[1]
            width = face[2] - face[0]

            # 크기 조정에 쓰일 변수.
            h_2 = int(height*0.1)
            w_2 = int(width*0.1)

            # 얼굴 사이즈에 맞는 빈 이미지 생성
            img_blank = np.zeros((height+7*h_2, width+4*w_2, 3), np.uint8)

            for i in range(height+7*h_2):
                for j in range(width+4*w_2):
                    img_blank[i][j] = image[face[1] - 5 *
                                            h_2 + i][face[0] - 2 * w_2 + j]

            # cv2.imshow("face_"+str(num+1), img_blank)

            # 이미지 저장
            print("Save into:", path_save + file[:-4] +
                  "_" + str(num2 + 1) + ".jpg")
            cv2.imwrite(path_save + file[:-4] + "_" +
                        str(num2 + 1) + ".jpg", img_blank)


if __name__ == '__main__':
    main()
