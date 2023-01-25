import os
from PIL import Image
from PIL import ImageChops
from PIL.ExifTags import TAGS, GPSTAGS


class Worker(object):
    def __init__(self, img):
        self.img = img
        self.get_exif_data()
        self.date = self.get_date_time()
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

        worst_bw_diff = image_diff(
            black_reference_image, white_reference_image)

        percentage_histogram_diff = (
            input_images_histogram_diff / float(worst_bw_diff)) * 100
    finally:
        if close_a:
            image_a.close()
        if close_b:
            image_b.close()

    return percentage_histogram_diff


def main(img_name):
    # 현재 경로에서 PhoneGalleryImage를 찾아온다
    path_read = "images/PhoneGalleryImage/"
    path_save = "images/similar_images/"

    # 해동 폴더내의 사진 전부 추출
    files = os.listdir(path_read)

    # 대표이미지 불러오기
    selected_image_name = img_name
    image_a = Image.open(path_read+selected_image_name)

    # 대표이미지 시간 정보 불러오기
    image_a_worker = Worker(image_a)
    image_a_date = image_a_worker.date
    date_of_image_a = image_a_date.split()[0]  # 유저가 선택한 이미지 날짜
    # time_of_image_a = image_a_date.split()[1]  # 유저가 선택한 이미지 시간

    # 같은 이미지 이름과 파일 저장 리스트
    similar_img = []
    similar_img_names = []

    # 다른 이미지 이름과 파일 저장 리스트
    diff_img = []
    diff_img_names = []

    # 대표이미지와 PhoneGalleryImage 폴더에 있는모든 이미지를 하나씩 비교하여 유사도 측정
    for file in files:

        # 이미지를 하나씩 불러온다 (시간 정보도 함께 불러온다)
        image_b = Image.open(path_read+file)
        image_b_worker = Worker(image_b)
        image_b_date = image_b_worker.date

        if image_b_date == None:
            continue
        else:
            pass

        date_of_image_b = image_b_date.split()[0]  # 갤러리에서 선택한 이미지 날짜
        # time_of_image_b = image_b_date.split()[1]  # 갤러리에서 선택한 이미지 시간

        if date_of_image_a != date_of_image_b:
            continue

        percentage_of_image_similarity_measure = image_diff_percent(
            image_a, image_b)

        print(selected_image_name, '와', file, '의 유사도:',
              percentage_of_image_similarity_measure)

        # 유사도가 12미만일 경우 비슷한 이미지로 판단하여 비슷한 이미지 목록에 넣는다
        if percentage_of_image_similarity_measure < 12:
            similar_img.append(image_b)
            similar_img_names.append(file)
        else:
            diff_img.append(image_b)
            diff_img_names.append(file)

    print('같은 이미지 목록:', similar_img_names)
    print('다른 이미지 목록:', diff_img_names)

    # similar_images 폴더가 존재하지 않으면 새로 만듦
    if not os.path.isdir(path_save):
        os.mkdir(path_save)

    # 매번 실행할때마다 similar_images 폴더를 비움
    img_list = os.listdir(path_save)
    for img in img_list:
        os.remove(path_save + img)

    # 비슷한 이미지들을 전부 similar_images 폴더에 JPEG 이름으로 저장
    for i in range(len(similar_img)):
        from PIL import ImageOps
        similar_img[i] = ImageOps.exif_transpose(similar_img[i])
        similar_img[i].save(path_save+similar_img_names[i], 'JPEG')
    return selected_image_name


if __name__ == '__main__':
    img_name = '01.jpg'
    main(img_name)
