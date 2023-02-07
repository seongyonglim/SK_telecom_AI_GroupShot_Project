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
  - 앞의 과정을 거친 후, 크롭된 이미지 좌표값에 따라 바꾸고싶은 이미지에 얼굴에 근접한 부분의 픽셀값을 swap합니다.
  - 서버 DB에서 form data를 통해 image를 받아 딥러닝을 돌리고, 최종 결과값을 base64 인코딩을 하여 서버로 전송합니다/

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

## 2023-02-01

### Combined copy

이것 저것 시도해보려고 만든 복사본
변경점

- 가인이가 만든 app.py 파일 간추림

### front-backend-test

backend 용으로 간단한 이미지 표출만 해보려고 만든 복사본 파일

app.js 변경점
버튼 만듬
Get Image 누르면 이미지 나옴

일단 지금은 안됨
버튼 누를때마다 기똥차게 Network request failed 뜸
![image](https://user-images.githubusercontent.com/72803972/215819148-5478d536-8a0d-4d45-891a-bec2547dabc3.png)

#### Network ERROR 뜨는 이유로 보이는 것

##### 원인 의심 1

POSTMAN에서 지금 body만 지정해줬는데
마우스를 위에 올려보면 이런 메세지가 보인다.
![image](https://user-images.githubusercontent.com/72803972/215820586-87cd8f3f-9ae7-436e-8417-fd107a032813.png)

##### 원인 의심 2

POSTMAN에서 HEADER에 들어가면
connection close로 적혀있는데 이거 때문인가 모르겠음
![image](https://user-images.githubusercontent.com/72803972/215822294-9aac7115-71ff-42da-a300-6c6dc44e03fc.png)
![image](https://user-images.githubusercontent.com/72803972/215822348-d01fd788-bfe4-4207-94e8-9467eb53131e.png)

### front-test

에이닷 UI 하나부터 쌓아가기 시작하려 만든 복사본
