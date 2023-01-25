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

## ML

### All-in-one

- Combine\run.py
  - 아래 딥러닝 기능을 한번에 실행하는 코드
  - 유저가 선택한 이미지와 날짜비교, 유사도 비교를 하고 얼굴부분을 crop하여 보여줍니다.

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

### ImageDate

- ImageDate/image_date.py
  - 이미지 파일에서 날짜 데이터를 추출하여 같은 날짜에 생성된 이미지를 추출합니다.

- ImageDate/date_and_compare.py
  - 갤러리 폴더에서 유저가 선택한 이미지와 1차로 같은 날짜에 촬영된 이미지를 먼저 분류하고, 2차로 이미지의 유사도를 판별하여 유사한 사진들을 폴더로 생성합니다,

---

## Front-end

Version required

- nodejs
- react-native
- react
  곧 추가예정임미다

상세 버전은 package.json확인
