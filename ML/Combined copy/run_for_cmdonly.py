import imagecompare
import detect_faces_masks
import combine
import time
import os



img_name = 'a (1).jpg'  # 대표이미지 이름 변수
imagecompare.main(img_name)
print("Image Compare of your select image : target is your gallery , Fully Complete !!")
time.sleep(2)
# print("Next "+time.sleep(0.7)+"."+time.sleep(0.7)+"."+time.sleep(0.7)+".")


cf_names, cf_coordinates = detect_faces_masks.main()
print("Detect the face of image ,,, wearing mask is no problem...!!! Run The Program...")
time.sleep(2)
print("And crop the face of image")


combine.main(cf_names, cf_coordinates, 'a (3).jpg', 'a (2)_2.jpg')
time.sleep(2)
os.system('cls')

print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200)
print("*"*60+"!!!!!AI is completely swap your image of faces with best photograhped faces!!!!!"+"*"*60)
print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200),print("*"*200)
