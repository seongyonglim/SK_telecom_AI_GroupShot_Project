from vision.ssd.mb_tiny_RFB_fd import create_Mb_Tiny_RFB_fd, create_Mb_Tiny_RFB_fd_predictor
from vision.ssd.config.fd_config import define_img_size
import cv2
import os
import sys

# 불러올 이미지 지정
path_result = "images/result_img/"

# 저장할 경로 지정
path_boxed = "images/boxed_img/"


def main():
    currentdir = os.path.dirname(os.path.realpath(__file__))
    parentdir = os.path.dirname(currentdir)
    sys.path.append(parentdir)

    # 기본값 지정
    test_device = "cpu"
    test_threshold = 0.3
    test_candidate_size = 1200
    test_input_size = 1280

    define_img_size(test_input_size)

    # 사용할 모델 지정
    model_path = "pretrained/RFB-640-masked_face-v2.pth"
    net = create_Mb_Tiny_RFB_fd(3, is_test=True, device=test_device)
    predictor = create_Mb_Tiny_RFB_fd_predictor(
        net, candidate_size=test_candidate_size, device=test_device)
    net.load(model_path)

    # 파일 리스트 가져오기
    listdir = os.listdir(path_result)

    # 각 개체에 대해 반복
    for file in listdir:
        img_path = os.path.join(path_result, file)
        orig_image = cv2.imread(img_path)
        if orig_image is None:
            continue
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        boxes, labels, probs = predictor.predict(
            image, test_candidate_size / 2, test_threshold)
        for i in range(boxes.size(0)):
            box = boxes[i, :]
            xmin = int(box[0])
            ymin = int(box[1])
            xmax = int(box[2])
            ymax = int(box[3])
            cv2.rectangle(orig_image, (xmin, ymin),
                          (xmax, ymax), (0, 0, 255), 2)

        cv2.imwrite(path_boxed + "boxed.jpg", orig_image)


if __name__ == '__main__':
    main()
