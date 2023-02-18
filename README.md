# 잘나왔닷

---

## 소개

여러장의 단체사진에서 개별 인물들이 가장 잘 나온 얼굴들을 조합하여 모두가 만족할 수 있는 단체사진을 제공하는 앱입니다.

## 조원 소개

- 주현우
- 최가인
- 이유진
- 김재현
- 임성용

---

## DL

- 딥러닝 모델 및 데이터 처리 Python 코드가 담긴 디렉토리입니다.

### app.py

- 백엔드 역할을 담당하는 코드.
- Flask를 통해 앱으로부터 신호를 주고 받아 요구하는 작업을 수행합니다.
- AWS를 활용하여 앱으로부터 편집할 이미지를 받아서 처리한 후 다시 앱으로 전송합니다.
- 아래 언급될 detect_faces_masks.py, draw_face.py, combine.py 모두 import 되고 돌아가게됩니다.

### detect_faces_masks.py

- 유사한 사진들로부터 얼굴 객체를 탐지하여 crop한 다음 jpg 형태로 저장합니다.
- 리턴값으로 각 객체의 파일명 및 좌표들을 불러옵니다.

### draw_face.py

- detect_faces_masks.py의 리턴값들을 활용하여 어떤 얼굴을 편집하고 있는지 박스를 그려 사용자에게 보여줍니다.

### combine.py

- 사용자가 지정한 얼굴을 자연스럽게 합성시킵니다.

### star_mask.py

- crop한 얼굴 사진들중에서 제일 잘 나온 사진을 판별하여 해당 사진에 별 표시를 추가합니다.

---

## frontend

- React Native 프레임워크로 제작된 프론트앤드 코드가 담긴 디렉토리입니다.

### src\screens\Login.js

- 로그인 화면이 담겨있습니다. 로그인을 하면 SelectHome.js 로 넘어갑니다.

### src\screens\PickerScreen.js

- 갤러리로부터 사진을 고르는 화면입니다.

### src\screens\SelectHome.js

- PickerScreen.js 와 연결하여 편집을 진행할 사진을 고른 후 대표사진을 선정하는 화면입니다.
- 선택한 사진들을 AWS로 업로드한 후 서버에 신호를 전송하여 얼굴 객체를 뽑아 전달 받습니다.
- 위 작업이 끝나면 PhotoEditing.js 로 넘어갑니다

### src\screens\PhotoEditing.js

- 얼굴 합성을 진행하는 화면입니다.
- 가장 좌측 얼굴부터 사용자로부터 선택받아 실시간으로 합성을 진행하여 보여줍니다.
- 모든 얼굴들에 대한 합성이 끝나면 Ending.js 로 넘어갑니다.

### src\screens\Ending.js

- 최종 사진을 표출하고 sns에 공유할 수 있는 화면입니다.

---

## Referenced git

- https://github.com/Linzaer/Ultra-Light-Fast-Generic-Face-Detector-1MB
