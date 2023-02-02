from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
import glob
import os
import imagecompare
import detect_faces_masks
import combine

app = Flask(__name__) # 플라스크 api로 던질거 설정(?) 포스트 맨으로 파일 확인할 예정

@app.route('/deep', methods = ['GET', 'POST']) # localurl + /user_img 에서 request설정을 통해 서버에서 flask로 사진전달
def flask_to_react():

    # data = request.get_json()
    # path_postman = "images/postman_img/"

    # parsed_request = request.files.get('1')

    # f = request.files['select'] # key 1값의 value
    # f.save('images/postman_img/' + secure_filename(f.filename)) # postman에서 받은 파일 폴더에 저장
    
    # parsed_request.save(path_postman)

    path_postman = "images/postman_img/" 
    img_list = os.listdir(path_postman) # 저장된 postman 폴더안의 이미지를 불러온다
    
    for img in img_list:
        imagecompare.main(img) # postman에서 불러온 이미지를 imagecompare 돌림. imagecompare 파일에 select $PATH 변경했으니 확인.
        cf_names, cf_coordinates = detect_faces_masks.main()
        combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')

        path_read = "images/BestShot/"
        img_list = os.listdir(path_read)

        for file in img_list:
            img = os.path.join(path_read, file)

            return send_file(img, mimetype='image/jpg')
  
if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)