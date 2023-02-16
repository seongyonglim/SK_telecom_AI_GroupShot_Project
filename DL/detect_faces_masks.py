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

# 메인 경로지정
path_main = "images/main_img/"

# 눈 객체 탐지 모델
eye_cascade = cv2.CascadeClassifier('haar/haarcascade_eye.xml')

# 프론트에 보낼 face_seperated 사진 경로 지정
path_view = "images/faces_separated_view/"


def main():
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

    # selected 폴더로부터 파일 이름을 저장
    listdir = os.listdir(path_read)
    sum = 0

    # 합성 python 코드 때 필요한 리스트들

    cropped_face_names_group = []  # crop 된 이미지 이름 사진단위 그룹 저장 리스트
    cropped_face_coordinates_group = []  # crop 된 이미지의 시작점 좌표값 사진단위 그룹 저장 리스트
    cropped_face_full_coordinates_group = []
    real_face_infos_group = []
    face_imgs_group = []  # crop된 얼굴 이미지 사진단위 그룹 저장 리스트
    face_nums = []  # 얼굴 개수 저장 리스트

    for file in listdir:
        c_faces = []
        face_imgs = []  # 잘라진 얼굴파일 임시로 저장하는 리스트
        cropped_face_names = []  # crop 된 이미지 이름 저장 리스트
        cropped_face_coordinates = []  # crop 된 이미지의 시작점 좌표값 저장 리스트
        cropped_face_full_coordinates = []
        real_face_infos = []
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

        # print(f"{file}: Found {len(probs)} faces.")

        c_faces = sorted(c_faces, key=lambda x: x[0])

        for face in (c_faces):
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

            real_face_infos.append([17 * w_2, 20 * h_2, width, height])

            # 이미지 저장
            face_imgs.append(img_blank)
            # print("Save into:", path_save + cropped_face_name)
            cropped_face_coordinates.append(
                [face[0] - 17 * w_2, face[1] - 20 * h_2])
            cropped_face_full_coordinates.append(
                [face[0], face[1], face[2], face[3]])

        cropped_face_names_group.append(cropped_face_names)
        cropped_face_coordinates_group.append(cropped_face_coordinates)
        cropped_face_full_coordinates_group.append(
            cropped_face_full_coordinates)
        face_nums.append(len(c_faces))
        face_imgs_group.append(face_imgs)
        real_face_infos_group.append(real_face_infos)

    # 얼굴이 아닌 사진 제외 후 저장 파트

    main_idx = face_nums.index(max(face_nums, key=face_nums.count))

    path_face_num = "images/face_num/"  # 얼굴 개수 저장 경로
    fp = open(path_face_num+str(face_nums[main_idx])+'.txt', 'w')
    fp.close()
    face_idxs = [-1] * face_nums[main_idx]

    for i in range(len(face_nums)):
        if face_nums[i] != face_nums[main_idx]:
            for j in range(face_nums[main_idx]):
                xi, yi = cropped_face_coordinates_group[i][j]
                xm, ym = cropped_face_coordinates_group[main_idx][j]

                if 0.65*xm < xi < 1.35*xm and 0.65*ym < yi < 1.35*ym:
                    continue

                del cropped_face_coordinates_group[i][j]
                del face_imgs_group[i][j]
                j -= 1
        if len(cropped_face_coordinates_group[i]) != face_nums[main_idx]:
            cropped_face_coordinates_group[i] = cropped_face_coordinates_group[i][:face_nums[main_idx]]
            face_imgs_group[i] = face_imgs_group[i][:face_nums[main_idx]]
            cropped_face_full_coordinates_group[i] = cropped_face_full_coordinates_group[i][:face_nums[main_idx]]
            real_face_infos_group[i] = real_face_infos_group[i][:face_nums[main_idx]]

    cropped_face_coordinates = []
    cropped_face_full_coordinates = []
    for i in range(len(face_imgs_group)):
        for j in range(len(face_imgs_group[i])):
            cropped_face_name = listdir[i][:-4] + "_" + str(j+1)+".jpg"
            cv2.imwrite(path_save + cropped_face_name, face_imgs_group[i][j])
            cropped_face_names.append(cropped_face_name)
            cropped_face_coordinates.append(
                cropped_face_coordinates_group[i][j])
            cropped_face_full_coordinates.append(
                cropped_face_full_coordinates_group[i][j])

    sel_list = os.listdir(path_read)
    main_full_coordinates = cropped_face_full_coordinates_group[sel_list.index(
        os.listdir(path_main)[0])]
    print('\nFace crop completed')

    # 추천 얼굴 선별 알고리즘
    recommended_img = [0]*face_nums[main_idx]
    eyes_value = [[0]*len(face_imgs_group) for _ in range(face_nums[main_idx])]

    for i in range(len(face_imgs_group)):
        for j in range(face_nums[main_idx]):
            x, y, w, h = real_face_infos_group[i][j]

            gray = cv2.cvtColor(face_imgs_group[i][j], cv2.COLOR_BGR2GRAY)
            roi_gray = gray[y:y + h, x:x + w]

            eyes = eye_cascade.detectMultiScale(roi_gray)

            if (len(eyes) == 2):
                eyes_value[j][i] = eyes[0][-1] + eyes[1][-1]

    for i in range(face_nums[main_idx]):
        recommended_img[i] = eyes_value[i].index(max(eyes_value[i]))

    starimg = cv2.imread('star.png', cv2.IMREAD_COLOR)
    starmask = cv2.imread('star_mask.png', cv2.IMREAD_GRAYSCALE)

    # for i in range(len(face_imgs_group)):
    #     for j in range(face_nums[main_idx]):
    #         if i == recommended_img[j]:

    #             H, W = face_imgs_group[i][j].shape[:2]
    #             starimg = cv2.resize(starimg, (H//4, W//4))

    #             h, w = starimg.shape[:2]
    #             x, y = W-int(w*1.35), H-int(h*3.9)
    #             roi = face_imgs_group[i][j][y:y+h, x:x+w]
                
    #             # 문제의 그 부분

    #             fg = cv2.add(roi, starimg)

    #             face_imgs_group[i][j][y:y+h, x:x+w] = fg
    #         cv2.imwrite(
    #             path_view+cropped_face_names[i*face_nums[main_idx] + j], face_imgs_group[i][j])

    starimg = cv2.imread('star.png', cv2.IMREAD_COLOR)
    starmask = cv2.imread('star_mask.png', cv2.IMREAD_GRAYSCALE)

    for i in range(len(face_imgs_group)):
        for j in range(face_nums[main_idx]):
            if i == recommended_img[j]:
                H, W = face_imgs_group[i][j].shape[:2]
                starimg_resized = cv2.resize(starimg, (H//4, W//4))
                starmask_resized = cv2.resize(starmask, (H//4, W//4))

                # 마스크가 검은색인 부분은 0, 흰색인 부분은 255의 값을 갖습니다.
                # mask_inv는 starmask_resized의 반전된 이미지입니다.
                mask_inv = cv2.bitwise_not(starmask_resized)

                # 별 이미지와 마스크를 사용하여 합성할 영역을 지정합니다.
                h, w = starimg_resized.shape[:2]
                x, y = W-int(w*1.35), H-int(h*3.9)
                roi = face_imgs_group[i][j][y:y+h, x:x+w]

                # 별 이미지를 마스크로 합성하여 roi 영역에 덧붙입니다.
                bg = cv2.bitwise_and(roi, roi, mask=mask_inv)
                fg = cv2.bitwise_and(starimg_resized, starimg_resized, mask=starmask_resized)
                face_imgs_group[i][j][y:y+h, x:x+w] = cv2.add(bg, fg)
            
            cv2.imwrite(path_view + cropped_face_names[i*face_nums[main_idx] + j], face_imgs_group[i][j])

            
            




    print('\nBest Face Selection completed')
    return cropped_face_names, cropped_face_coordinates, main_full_coordinates, cropped_face_full_coordinates, face_idxs
