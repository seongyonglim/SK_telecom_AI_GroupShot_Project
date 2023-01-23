from deepface import DeepFace # DeepFace의 라이브러리를 사용합니다.
from tqdm import tqdm # 진행 프로세스를 프로그레스바 형식으로 표현하기 위해서 tqdm을 사용하였습니다.
import tensorflow as tf
import matplotlib.pyplot as plt
import PIL
import PIL.Image
import pathlib
import glob
import os
import cv2

# 학습된 모델은 가장 accuracy가 높았던 Facenet512 모델을 사용하였습니다.
# 분류 기준은 consine, euclidean, euclidean_12를 사용하여 분류 기준을 잡았습니다.
# 평균 결과값을 도출하기 위한 리스트 변수 선언

model = "Facenet512"
metrics = ["cosine", "euclidean", "euclidean_l2"] 
result = [] 

# metrics의 리스트를 metric으로 하나하나씩 데이터를 불러옵니다.
# DeepFace의 라이브러리 api 함수를 통해서 사진의 비교절차를 거치는데, 모델과 분류기준을 통해 두 사진을 비교하는 과정을 가집니다.
# DeepFace의 api함수 verify의 parameter으로는 비교할 두 사진의 사진경로, model, metrics을 parameter로 설정합니다.
# 두 결과데이터의 최종결과값을 불린 형식으로 표현하는 verfied(key)에 위치하고있는 value값을 가져옵니다.
# 딕셔너리 형태의 resp_obs 결과데이터를 전체 데이터 확인을 위해서 출력합니다.
# 평균 결과값 도출을 위해 result 리스트에 최종결과값 하나하나를 대입하는 과정입니다.

IMAGE_DIR = 'C:/workspace/A._Project/newface/facecompare/PhoneGalleryImage'

gallery = glob.iglob(f'{IMAGE_DIR}/*')

# list_gallery = list(gallery)
# print(list_gallery[3])
# img2 = cv2.imread(list_gallery[3])
# cv2.imshow('',img2)
# cv2.waitKey(4000)

#     faces = face_detector(img)

#     image_bottom, image_right = img.shape[:2]


# data_dir = pathlib.Path('./PhoneGalleryImage')
# data_dir = pathlib.Path('C:/workspace/A._Project/newface/faceswap/jim_carrey.jpg')

# gallery = list(data_dir.glob('.jpg/*'))
# # gallery.append(data_dir.glob('*/*.jpeg'))
# # gallery.append(data_dir.glob('*/*.png')) 

# # gallery = tf.keras.utils.image_dataset_from_directory(data_dir)

# # gallery = gallery.cache().prefetch(buffer_size = tf.data.AUTOTUNE)

# PIL.Image.open(gallery[0])
# fnames = list(data_dir.glob('*/*.jpg'))
# fnames[0]
# PIL.Image.open(gallery)

for img in gallery:
    r = []
    for metric in metrics: 
        galleryimage = cv2.imread(img)

        resp_obj = DeepFace.verify( 
            img1_path = galleryimage, img2_path = "C:/workspace/A._Project/newface/facecompare/UserSelectedImage/tayler.jpg",
            # img1_path = "리스트 형태의 이미지 파일들", img2_path = "사용자가 선택한 이미지에서 크롭하여 가져온 이미지"
            model_name= model, distance_metric = metric)
        
        print(resp_obj["verified"]) 
        print(resp_obj) 
    
        r.append(resp_obj["verified"]) 
    cnt = 0
    for i in r:
        if i:
            cnt+=1
    if cnt==3:
        result.append(True)
    else:
        result.append(False)

print(result) # result 리스트에 최종결과값을 하나의 데이터로 요약하여 보여줍니다.

true_index = []

for i in tqdm(range(len(result))): 
    if result[i] == False: 
       continue
    else: 
       true_index.append(i)
    
print(true_index)

# IMAGE_DIR = 'C:/workspace/A._Project/newface/facecompare/PhoneGalleryImage'

similar_gallery = glob.iglob(f'{IMAGE_DIR}/*')

list_gallery = list(similar_gallery)
cnt = 0
for id in true_index:

    smiliar_with_seletedimage = cv2.imread(list_gallery[id])
    cv2.imshow('smiliar_with_seletedimage',smiliar_with_seletedimage)
    cv2.waitKey(4000)
    name = 'C:/workspace/A._Project/newface/facecompare/SimilarWtihCroppedImage/SmilarImage'+str(cnt)+'.png'
    cv2.imwrite(name,smiliar_with_seletedimage)
    cnt+=1


# for id in true_index:
#     PIL.Image.open(list_gallery[id])

# for id in true_index:
#     list_gallery[id]
#     galleryimage = cv2.imread(list_gallery[id])
#     cv2.imshow('',galleryimage)
#     cv2.waitKey(4000)

# print(type(result))
# print(len(result))

# sum = 0 # sum 변수 초기화

# # result 리스트의 길이에 따라 i를 생성하는 반복 횟수가 달라지도록 설정하되, 프로세스를 확인하기 위해 tqdm를 사용하였습니다.
# # result 리스트의 i번쨰 인덱스의 value값이 거짓일때, (i번째 분류 기준에 따른 결과값이 거짓일때)
# # 불린형식의 False 값을 정수형 데이터 0으로 변환시켜줍니다.
# # result 리스트의 i번째 인덱스의 value값이 참일떄,
# # 불린형식의 True 값을 정수형 데이터 1으로 변환시켜줍니다.
# # 최종결과값들의 총 합산을 도출합니다.

# for i in tqdm(range(len(result))): 
#     if result[i] == False: 
#        result[i] = 0 
#     else: 
#        result[i] = 1 
    
#     sum = sum + result[i] 

# # 최종결과값들의 총 합산을 분류기준에 따라 나온 결과값 도출 횟수로 나누어서 최종결과값의 평균을 구합니다.(다른 모델까지 사용후 합산을 위해 사용)
# # 최종결과값의 평균을 나타냅니다. 프로젝트를 위해서 데이터를 사용할 시에 이 결과값을 사용하면 됩니다.
# # 최종결과값의 평균을 정수형 데이터로 나타내었을때, 0.5보다 확률이 작다고 판별할시에,
# # 다음과 같이 출력합니다.

# average = sum/len(result) 
# print(average) 

# if average < 0.5: 
#     print("두 사진의 비교 결과는 틀리다고 나왔습니다") 
# else:
#     print("두 사진의 비교 결과는 같다고 나왔습니다")


# python face_compare.py