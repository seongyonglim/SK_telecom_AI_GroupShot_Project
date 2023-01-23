# GroupShot_AI

---

## 소개

단체사진 얼굴 보정 앱

## 조원 소개

- 주현우
- 최가인
- 이유진
- 김재현
- 임성용

---

## DeepLearning

### Multiple Face Detect and Crop

- Dlib_face_cut\crop_faces_save.py
  - 얼굴을 좌측에서 우측순으로 잘라서 넘버링 후 지정된 폴더에 저장합니다.

### Photo Similarity

- facecompare/imagecompare.py
  - 얼굴 기준이 아닌 사진 전체의 유사도를 비교하여 유사하다고 판단될 때 지정된 폴더에 저장합니다.
- facecompare/face_compare.py
  - 얼굴 기준으로 얼굴의 유사도를 판단하여 같은 사람이라고 판단될 시에 지정된 폴더에 저장합니다.(2023-01-22 갑자기 안됨???????)

### Face Swap

- faceswap/Best_Image_swap.py
  - 얼굴의 landmark, 각 노드값을 받아와서 지정된 위치에 따라 얼굴을 swap하는 python code입니다. 최종 결과사진은 지정된 폴더에 저장합니다.

###

---

## Front-end

Version required

- react-native
- react
- 이따 마저 쓸게요
