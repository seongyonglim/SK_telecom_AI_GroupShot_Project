## 설명

대표사진 선정 후 사진 유사도를 측정하여 대포사진과 유사한 사진들로부터 얼굴부분만 crop 하고 JPG 파일 형태로 저장하는 코드입니다.

- 사진 유사도 코드: imagecompare.py
- 얼굴 crop 코드: crop_faces_save.py
- 전체 기능 동작 코드: run.py

## pip install -r requirements.txt 에서 dlib 오류날 경우

requirements.txt 에서 dlib 파트 삭제 후

```
$ pip install dlib-19.19.0-cp38-cp38-win_amd64
```

입력하여 dlib 따로 설치

## 실행법

```
python run.py
```

대표 사진 img_name = ~~~ 을 수정하면 됩니다.
