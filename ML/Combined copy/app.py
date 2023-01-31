from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
import cv2
import glob
import os
import imagecompare
import detect_faces_masks
import combine
import time
import base64

app = Flask(__name__)

@app.route('/user_img', methods=['POST'])
def flask_to_react():
    f = request.files['1']
    f.save('images/postman_img/' + secure_filename(f.filename))

    path_postman = "images/postman_img/" 
    img_list = os.listdir(path_postman)

    time.sleep(2)
    
    for img in img_list:
        imagecompare.main(img)
        cf_names, cf_coordinates = detect_faces_masks.main()
        combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')

        path_read = "images/BestShot/"
        img_list = os.listdir(path_read)
        for file in img_list:
            img = os.path.join(path_read, file)

            with open(img, 'rb') as img:
                img_encoded = base64.b64encode(img.read())
            
            return img_encoded

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
