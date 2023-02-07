import numpy as np
import cv2
import sys
import os

path_faces = "images/faces_separated/"
path_target = "images/main_img/"
path_final = "images/BestShot/"


def main(cf_names, cf_coordinates, dst_name, src_name):
    dst_image = cv2.imread(path_target+dst_name)
    src_image = cv2.imread(path_faces+src_name)

    # 중앙 좌표 구할때 쓰는 정보들
    x, y = cf_coordinates[cf_names.index(src_name)]
    h, w, z = src_image.shape

    # 크롭된 얼굴을 크롭 좌표값을 기억해 다른 사진에다가 좌표값을 씌워서 크롭된 얼굴을 덮어씌워, 자연스래 합성합니다.
    img2_face_mask = np.zeros_like(src_image)
    img2_face_mask = cv2.bitwise_not(img2_face_mask)

    center_face = (x+w//2, y+h//2)

    seamlessclone = cv2.seamlessClone(
        src_image, dst_image, img2_face_mask, center_face, cv2.NORMAL_CLONE)
    # cv2.imshow('',seamlessclone)
    cv2.imwrite(path_final + "AI_BestShotMake.jpg", seamlessclone)
