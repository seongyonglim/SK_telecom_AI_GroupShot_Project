import cv2
import os
import numpy as np

# 불러올 이미지 지정
path_result = "images/result_img/"

# 저장할 경로 지정
path_boxed = "images/boxed_img/"

# 메인 이미지 경로
path_main = "images/main_img/"


def drawline(img, pt1, pt2, color, thickness=1):
    dist = ((pt1[0]-pt2[0])**2+(pt1[1]-pt2[1])**2)**.5
    pts = []
    gap = dist/12
    for i in np.arange(0, dist, gap):
        r = i/dist
        x = int((pt1[0]*(1-r)+pt2[0]*r)+.5)
        y = int((pt1[1]*(1-r)+pt2[1]*r)+.5)
        p = (x, y)
        pts.append(p)

    s = pts[0]
    e = pts[0]
    i = 0
    for p in pts:
        s = e
        e = p
        if i % 2 == 1:
            cv2.line(img, s, e, color, thickness)
        i += 1


def drawpoly(img, pts, color, thickness=1):
    s = pts[0]
    e = pts[0]
    pts.append(pts.pop(0))
    for p in pts:
        s = e
        e = p
        drawline(img, s, e, color, thickness)


def drawrect(img, pt1, pt2, color, thickness=1):
    pts = [pt1, (pt2[0], pt1[1]), pt2, (pt1[0], pt2[1])]
    drawpoly(img, pts, color, thickness)


def main(cur, main_full_coordinates, cropped_face_full_coordinates, face_idxs):
    # result 파일 불러오기
    file = os.listdir(path_result)[0]

    orig_image = cv2.imread(path_result + file)
    for i in range(len(face_idxs)):
        if face_idxs[i] == -1:
            xmin = int(main_full_coordinates[i][0])
            ymin = int(main_full_coordinates[i][1])
            xmax = int(main_full_coordinates[i][2])
            ymax = int(main_full_coordinates[i][3])

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
            idx = face_idxs[i]*len(face_idxs)+i
            xmin = int(cropped_face_full_coordinates[i][0])
            ymin = int(cropped_face_full_coordinates[i][1])
            xmax = int(cropped_face_full_coordinates[i][2])
            ymax = int(cropped_face_full_coordinates[i][3])

        if i == cur:
            drawrect(orig_image, (xmin, ymin),
                     (xmax, ymax), (250, 100, 90), 20)
            # cv2.rectangle(orig_image, (xmin, ymin), (xmax, ymax), (250, 100, 90), 20)
        else:
            # cv2.rectangle(orig_image, (xmin, ymin), (xmax, ymax), (255, 255, 255), 20)
            drawrect(orig_image, (xmin, ymin),
                     (xmax, ymax), (255, 255, 255), 20)
    H, W = orig_image.shape[:2]
    orig_image = cv2.resize(orig_image, (W//3, H//3))
    cv2.imwrite(path_boxed + "boxed.jpg", orig_image)


if __name__ == '__main__':
    main()
