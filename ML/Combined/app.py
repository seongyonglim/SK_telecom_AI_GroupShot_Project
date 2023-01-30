from flask import Flask, jsonify
# from flask_cors import CORS
import cv2
import glob
import os
import imagecompare
import detect_faces_masks
import combine

app = Flask(__name__) # 플라스크 api로 던질거 설정(?) 포스트 맨으로 파일 확인할 예정
# CORS(app) # 플라스크 function을 통해서 오류를 확인한다.

@app.route('/')
def flask_to_react():
    img_name = 'a (1).jpg'  # 대표이미지 이름 변수
    imagecompare.main(img_name)
    cf_names, cf_coordinates = detect_faces_masks.main()
    combine.main(cf_names, cf_coordinates, 'a (2).jpg', 'a (4)_2.jpg')

    path_read = "images/BestShot/"
    img_list = os.listdir(path_read)
    for file in img_list:
        img_path = os.path.join(path_read, file)
        # final_bestshot_img = cv2.imread(img_path)

    
        return jsonify(img_path)
    # return {"similar_img" : similar_img, "final_bestshot_img" : final_bestshot_img}
    # return jsonify({"similar" : smi_gallery , "bestshot" : final_bestshot_img})
    
    

# if __name__ == "__main__":
#     app.run(host='chlrkdls1269', port='5000', debug=True)