import cv2
import numpy as np

# PNG 이미지를 로드합니다.
img = cv2.imread("label.png")

# 이미지를 흑백으로 변환합니다.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 흑백 이미지를 마스크 이미지로 변환합니다.
mask = cv2.bitwise_not(gray)

mask_img = mask

# 255인 부분을 검정색으로, 나머지 부분을 흰색으로 바꾸기
mask = np.zeros_like(mask_img)
mask[mask_img == 255] = 0
mask[mask_img != 255] = 255

# 마스크 이미지를 저장합니다.
cv2.imwrite("label_mask.png", mask)
