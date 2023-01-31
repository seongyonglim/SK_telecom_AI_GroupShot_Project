from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
# from flask_cors import CORS
import cv2
import glob
import os
import imagecompare
import detect_faces_masks
import combine
import time
import base64

app = Flask(__name__) # 플라스크 api로 던질거 설정(?) 포스트 맨으로 파일 확인할 예정
# CORS(app) # 플라스크 function을 통해서 오류를 확인한다.

@app.route('/user_img', methods = ['POST']) # localurl + /user_img 에서 request설정을 통해 서버에서 flask로 사진전달
def flask_to_react():

    # data = request.get_json()
    # path_postman = "images/postman_img/"

    # parsed_request = request.files.get('1')
    f = request.files['1'] # key 1값의 value
    f.save('images/postman_img/' + secure_filename(f.filename)) # postman에서 받은 파일 폴더에 저장
    
    # parsed_request.save(path_postman)

    path_postman = "images/postman_img/" 
    img_list = os.listdir(path_postman) # 저장된 postman 폴더안의 이미지를 불러온다
    
    time.sleep(2)
    
    for img in img_list:

        imagecompare.main(img) # postman에서 불러온 이미지를 imagecompare 돌림. imagecompare 파일에 select $PATH 변경했으니 확인.
        cf_names, cf_coordinates = detect_faces_masks.main()
        combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')

        path_read = "images/BestShot/"
        img_list = os.listdir(path_read)
        for file in img_list:
            img = os.path.join(path_read, file)

            # with open("path/to/image.jpg", "rb") as img:
            #     encoded_string = base64.b64encode(img.read()).decode("utf-8")
            #     return encoded_string
            # final_bestshot_img = cv2.imread(img_path)
            with open(img, 'rb') as img:
                img_encoded = base64.b64encode(img.read())

            print(">"*100)
            print(img_encoded)

            fp = open('tmp.txt','w')
            fp.write(str(img_encoded))
            fp.close()

            # return jsonify({"final_img" : str(img_encoded)})
            return img_encoded

            # return send_file(img, mimetype='image/jpg')
    # return {"similar_img" : similar_img, "final_bestshot_img" : final_bestshot_img}
    # return jsonify({"similar" : smi_gallery , "bestshot" : final_bestshot_img})
    
    

# if __name__ == "__main__":
#     app.run(host='SKTCamServer', port='5000', debug=True)