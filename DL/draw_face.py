import cv2
import os

# 불러올 이미지 지정
path_result = "images/result_img/"

# 저장할 경로 지정
path_boxed = "images/boxed_img/"

# 메인 이미지 경로
path_main = "images/main_img/"


def main(cur, main_full_coordinates, cropped_face_full_coordinates, face_idxs):
    # result 파일 불러오기
    file = os.listdir(path_result)[0]

    orig_image = cv2.imread(path_result + file)

    if face_idxs[cur] == -1:
        xmin = int(main_full_coordinates[cur][0])
        ymin = int(main_full_coordinates[cur][1])
        xmax = int(main_full_coordinates[cur][2])
        ymax = int(main_full_coordinates[cur][3])

        '''
        height = ymax - ymin
        width = xmax - xmin

        h_2 = int(height*0.05)
        w_2 = int(width*0.05)

        ymin -= 20 * h_2
        xmin -= 17 * w_2
        ymax += 14 * h_2
        xmax += 17 * w_2
        '''
    else:
        idx = face_idxs[cur]*len(face_idxs)+cur
        xmin = int(cropped_face_full_coordinates[idx][0])
        ymin = int(cropped_face_full_coordinates[idx][1])
        xmax = int(cropped_face_full_coordinates[idx][2])
        ymax = int(cropped_face_full_coordinates[idx][3])

    cv2.rectangle(orig_image, (xmin, ymin),
                  (xmax, ymax), (0, 0, 255), 20)

    cv2.imwrite(path_boxed + "boxed.jpg", orig_image)


if __name__ == '__main__':
    main()
