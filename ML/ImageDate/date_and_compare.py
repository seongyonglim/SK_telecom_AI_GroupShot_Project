try:
    import PIL
    import PIL.Image as PILimage
    from PIL import ImageDraw, ImageFont, ImageEnhance
    from PIL.ExifTags import TAGS, GPSTAGS
    import glob
    from PIL import Image
    import cv2
    from PIL import ImageChops
 
except ImportError as err:
    exit(err)

class Worker(object):
    def __init__(self, img):
        self.img = img
        self.get_exif_data()
        self.date =self.get_date_time()
        super(Worker, self).__init__()

    def get_exif_data(self):
        exif_data = {}
        info = self.img._getexif()
        if info:
            for tag, value in info.items():
                decoded = TAGS.get(tag, tag)
                if decoded == "GPSInfo":
                    gps_data = {}
                    for t in value:
                        sub_decoded = GPSTAGS.get(t, t)
                        gps_data[sub_decoded] = value[t]

                    exif_data[decoded] = gps_data
                else:
                    exif_data[decoded] = value
        self.exif_data = exif_data
        # return exif_data 

    def get_date_time(self):
        if 'DateTime' in self.exif_data:
            date_and_time = self.exif_data['DateTime']
            return date_and_time 

if __name__ == '__main__':
    try:
        userselected = Image.open("C:/workspace/A._Project/newface/facecompare/UserSelectedImage/01.jpg")
        userimage = Worker(userselected)
        userimage_date = userimage.date

        date_of_userimage = userimage_date.split()[0] # 유저가 선택한 이미지 날짜
        time_of_userimage = userimage_date.split()[1] # 유저가 선택한 이미지 시간

        IMAGE_DIR = 'C:/workspace/A._Project/newface/facecompare/PhoneGalleryImage'

        gallery = glob.iglob(f'{IMAGE_DIR}/*')
        list_gallery = list(gallery)

        THE_SAMEDATE_IMAGE_INDEX = []

        for i in range(len(list_gallery)):
            img = PILimage.open(list_gallery[i])
            image = Worker(img)
            date = image.date

            # 외부에서 가져온 사진일경우 사진 데이터의 date타입이 None인 경우가 허다하다. 이 경우 에러가 발생하기 때문에 예외처리를 하였다.

            if date == None:
                continue
            else:
                pass
            

            date_of_galleryimage = date.split()[0] # 갤러리에서 선택한 이미지 날짜
            time_of_galleryimage = date.split()[1] # 갤러리에서 선택한 이미지 시간

            # 첫 번째로 .. 유저가 선택한 이미지와 갤러리의 이미지의 촬영된 날짜를 확인하여 똑같은 경우 1차적으로 분류합니다.

            if date_of_userimage == date_of_galleryimage:
                THE_SAMEDATE_IMAGE_INDEX.append(i)
            else:
                continue

            # 두 번째로 .. 유저가 선택한 이미지와 갤러리의 이미지의 촬영된 시간을 확인하여 5분 오차 내외의 사진들을 2차적으로 분류합니다.(사진 유사도 부정확할시에 추가할 예정)

        # print(THE_SAMEDATE_IMAGE_INDEX)

        # 여기서 부터 날짜 분류가 끝나고, 2차로 이미지 유사도 분석을 시작합니다.

        class ImageCompareException(Exception):
            pass

        def pixel_diff(image_a, image_b):
            if image_a.size != image_b.size:
                raise ImageCompareException(
                    "different image sizes, can only compare same size images: A=" + str(image_a.size) + " B=" + str(
                        image_b.size))

            if image_a.mode != image_b.mode:
                raise ImageCompareException(
                    "different image mode, can only compare same mode images: A=" + str(image_a.mode) + " B=" + str(
                image_b.mode))

            diff = ImageChops.difference(image_a, image_b)
            diff = diff.convert('L')

            return diff

        def total_histogram_diff(pixel_diff):
            return sum(i * n for i, n in enumerate(pixel_diff.histogram()))

        def image_diff(image_a, image_b):
            histogram_diff = total_histogram_diff(pixel_diff(image_a, image_b))
            return histogram_diff


        def is_equal(image_a, image_b, tolerance=0.0):
            return image_diff_percent(image_a, image_b) <= tolerance


        def image_diff_percent(image_a, image_b):
    
            close_a = False
            close_b = False
            if isinstance(image_a, str):
                image_a = Image.open(image_a)
                close_a = True

            if isinstance(image_b, str):
                image_b = Image.open(image_b)
                close_b = True

            try:
                input_images_histogram_diff = image_diff(image_a, image_b)
                black_reference_image = Image.new('RGB', image_a.size, (0, 0, 0))
                white_reference_image = Image.new('RGB', image_a.size, (255, 255, 255))

                worst_bw_diff = image_diff(black_reference_image, white_reference_image)

                percentage_histogram_diff = (input_images_histogram_diff / float(worst_bw_diff)) * 100
            finally:
                if close_a:
                    image_a.close()
                if close_b:
                    image_b.close()

            return percentage_histogram_diff

        IMAGE_DIR = 'C:/workspace/A._Project/newface/facecompare/PhoneGalleryImage'

        gallery = glob.iglob(f'{IMAGE_DIR}/*')

        list_gallery = list(gallery)

        # userselected = Image.open("C:/workspace/A._Project/newface/facecompare/UserSelectedImage/open.jpg")
        SAVE_CNT = 0

        # print(THE_SAMEDATE_IMAGE_INDEX)

        for id in THE_SAMEDATE_IMAGE_INDEX:
            phonegallery = Image.open(list_gallery[id])

            userselected = userselected.resize((512, 512)) # 핸폰 사진 크기 똑같아서 안해도댐 수정예정. 2023-01-25
            phonegallery = phonegallery.resize((512, 512))

            # print(image_diff_percent(userselected, phonegallery))
            percentage_of_image_similarity_measure = image_diff_percent(userselected, phonegallery)

    

            if percentage_of_image_similarity_measure < 16:
                # print("{}와 {}는 \n 같은 사진입니다".format(userselected,phonegallery))
                # print(SAVE_CNT)

                SAVE_CNT+=1

                SAME_IMAGE = cv2.imread(list_gallery[id])
                name = 'C:/workspace/A._Project/newface/ImageDate/SameDateImage/'+str(SAVE_CNT)+'.jpg'
                print(name)
                print(SAVE_CNT)
                cv2.imwrite(name,SAME_IMAGE)
                
            else:
                # print("다른 사진입니다")
                continue


    except Exception as e:
        print(e)