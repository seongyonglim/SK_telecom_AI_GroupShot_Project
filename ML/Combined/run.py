import imagecompare
import detect_faces_masks
import combine

img_name = 'a (1).jpg'  # 대표이미지 이름 변수
imagecompare.main(img_name)
cf_names, cf_coordinates = detect_faces_masks.main()
combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')
