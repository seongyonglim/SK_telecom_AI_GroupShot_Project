"""
This code is used to batch detect images in a folder.
"""
from vision.ssd.mb_tiny_RFB_fd import create_Mb_Tiny_RFB_fd, create_Mb_Tiny_RFB_fd_predictor
from vision.ssd.config.fd_config import define_img_size
import cv2
import sys
import os
import numpy as np

# 불러올 이미지 지정
path_read = "images/selected_img/"

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

    mkdir_for_save_images()
    clear_images()

    currentdir = os.path.dirname(os.path.realpath(__file__))
    parentdir = os.path.dirname(currentdir)
    sys.path.append(parentdir)

    # 기본값 지정
    test_device = "cpu"

    test_threshold = 0.3
    test_candidate_size = 1200
    test_input_size = 1280

    define_img_size(test_input_size)

    # 사용할 모델 지정
    model_path = "pretrained/RFB-640-masked_face-v2.pth"
    net = create_Mb_Tiny_RFB_fd(
        3, is_test=True, device=test_device)
    predictor = create_Mb_Tiny_RFB_fd_predictor(
        net, candidate_size=test_candidate_size, device=test_device)

    net.load(model_path)

    # similar 폴더로부터 파일 이름을 저장
    listdir = os.listdir(path_read)
    sum = 0

    # 합성 python 코드 때 필요한 리스트들

    cropped_face_names = []  # crop 된 이미지 이름 저장 리스트
    cropped_face_coordinates = []  # crop 된 이미지의 시작점 좌표값 저장 리스트

    for file in listdir:
        c_faces = []
        img_path = os.path.join(path_read, file)
        orig_image = cv2.imread(img_path)
        if orig_image is None:
            continue
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        boxes, labels, probs = predictor.predict(
            image, test_candidate_size / 2, test_threshold)
        sum += boxes.size(0)
        for i in range(boxes.size(0)):
            box = boxes[i, :]
            c_faces.append([int(box[0]), int(box[1]),
                           int(box[2]), int(box[3])])

        print(f"{file}: Found {len(probs)} faces.")

        c_faces = sorted(c_faces, key=lambda x: x[0])

        for num2, face in enumerate(c_faces):
            # 사각형 사이즈 계산
            height = face[3] - face[1]
            width = face[2] - face[0]

            # 크기 조정에 쓰일 변수.
            h_2 = int(height*0.05)
            w_2 = int(width*0.05)

            # 얼굴 사이즈에 맞는 빈 이미지 생성
            img_blank = np.zeros((height+34*h_2, width+34*w_2, 3), np.uint8)
            for i in range(height+34*h_2):
                for j in range(width+34*w_2):
                    k = face[1] - 20 * h_2 + i
                    l = face[0] - 17 * w_2 + j
                    if k < len(orig_image) and l < len(orig_image[k]):
                        img_blank[i][j] = orig_image[k][l]

            # 이미지 저장
            cropped_face_name = file[:-4] + "_" + str(num2 + 1) + ".jpg"
            print("Save into:", path_save + cropped_face_name)
            cv2.imwrite(path_save + cropped_face_name, img_blank)

            cropped_face_names.append(cropped_face_name)
            cropped_face_coordinates.append(
                [face[0] - 17 * w_2, face[1] - 20 * h_2])

    print(sum)
    return cropped_face_names, cropped_face_coordinates


if __name__ == '__main__':
    i, n, c = main()
