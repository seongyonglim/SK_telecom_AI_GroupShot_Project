try:
    import PIL
    import PIL.Image as PILimage
    from PIL import ImageDraw, ImageFont, ImageEnhance
    from PIL.ExifTags import TAGS, GPSTAGS
    import glob
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


def main():
    date = image.date
    print(date)

if __name__ == '__main__':
    try:
        IMAGE_DIR = 'C:/workspace/A._Project/newface/facecompare/PhoneGalleryImage'

        gallery = glob.iglob(f'{IMAGE_DIR}/*')
        list_gallery = list(gallery)

        for i in range(len(list_gallery)):
            img = PILimage.open(list_gallery[i])
            image = Worker(img)
            date = image.date
            print(date)

    except Exception as e:
        print(e)