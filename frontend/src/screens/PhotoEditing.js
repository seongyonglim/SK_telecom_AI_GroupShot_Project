import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  Button,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import AWS from 'aws-sdk';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { AWS_KEY, flask_API } from '../AWS';
import { WHITE, GRAY, PRIMARY } from '../colors';

// Flask 서버의 URL
var url = flask_API;

// AWS SDK 설정
AWS.config.update({
  accessKeyId: AWS_KEY.accessKey,
  secretAccessKey: AWS_KEY.secretKey,
  region: AWS_KEY.region,
});

// S3 객체 생성
const s3 = new AWS.S3();

// 사진 편집 화면
const PhotoEditing = () => {
  // 원본 이미지의 URL
  const [imageUri, setImageUri] = useState(null);
  // 편집된 얼굴 이미지의 URL 목록
  const [otherImages, setOtherImages] = useState([]);
  // 선택된 얼굴 이미지의 URL
  const [selectedImage, setSelectedImage] = useState(null);
  // 현재 페이지 인덱스
  const [pageIndex, setPageIndex] = useState(0);
  // 로딩 화면을 보여줄지 여부
  const [loading, setLoading] = useState(false);
  // 로딩 화면을 보여줄지 여부
  const [faceNum, setFaceNum] = useState(0);

  // 네비게이션 객체
  const navigation = useNavigation();

  // S3에서 데이터를 다운로드하는 함수
  const downloadFromS3 = async (pageIndex) => {
    // AWS SDK 설정
    AWS.config.update({
      accessKeyId: AWS_KEY.accessKey,
      secretAccessKey: AWS_KEY.secretKey,
      region: AWS_KEY.region,
    });

    // S3 객체 생성
    const s3 = new AWS.S3();

    // "boxed_img" 폴더에서 박스가 그려진 이미지 가져오기
    const mainImgParams = {
      Bucket: AWS_KEY.bucket,
      Prefix: 'boxed_img/',
    };

    // main 이미지 가져오기
    const mainImgdata = await new Promise((resolve, reject) => {
      s3.listObjects(mainImgParams, (err, data) => {
        if (err) reject(err);

        resolve(data);
      });
    });
    const mainImgfirstParams = {
      Bucket: AWS_KEY.bucket,
      Key: mainImgdata.Contents[0].Key,
    };

    const mainImgUrl = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', mainImgfirstParams, (err, url) => {
        if (err) reject(err);

        resolve(url);
      });
    });
    setImageUri(mainImgUrl);
    ////////////////////

    const faceNumParams = {
      Bucket: AWS_KEY.bucket,
      Prefix: 'face_num/',
    };

    s3.listObjectsV2(faceNumParams, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        const faceNumFirstParams = {
          Bucket: AWS_KEY.bucket,
          Key: data.Contents[0].Key,
        };
        if (faceNumFirstParams.Key.endsWith('.txt')) {
          const fileName = faceNumFirstParams.Key.split('/')
            .pop()
            .split('.')[0];
          setFaceNum(fileName);
          //console.log(fileName);
        } else {
          console.log('The first file is not a .txt file.');
        }
      }
    });

    /////////////////////////

    // 서브 이미지 가져오기
    const croppedImgParams = {
      Bucket: AWS_KEY.bucket,
      Prefix: 'cropped_face_imgs/',
    };

    const data = await new Promise((resolve, reject) => {
      s3.listObjects(croppedImgParams, (err, data) => {
        if (err) reject(err);

        resolve(data);
      });
    });

    // "cropped_face_imgs" 폴더에서 마지막 파일이름 기준으로 filter해서 가져옴
    // 페이지 넘기는것 처럼 보이도록
    const croppedImgUrls = await Promise.all(
      data.Contents.filter((object) =>
        object.Key.endsWith(`_${pageIndex + 1}.jpg`)
      ).map(
        (object) =>
          new Promise((resolve, reject) => {
            s3.getSignedUrl(
              'getObject',
              {
                Bucket: AWS_KEY.bucket,
                Key: object.Key,
              },
              (err, url) => {
                if (err) reject(err);

                resolve(url);
              }
            );
          })
      )
    );
    setOtherImages(croppedImgUrls);
  };

  // S3로 다운로드 한 이미지들을 배열 저장
  useEffect(() => {
    downloadFromS3(pageIndex);
  }, [pageIndex]);

  // 서브 이미지 선택 시 동작 함수
  const onImageSelected = async (selectedImageUri) => {
    setSelectedImage(selectedImageUri);
    const fileName = selectedImageUri.split('/').pop().split('?')[0];

    const s3 = new AWS.S3({
      accessKeyId: AWS_KEY.accessKey,
      secretAccessKey: AWS_KEY.secretKey,
      region: AWS_KEY.region,
    });

    setLoading(true); // 로딩 스크린 열기

    const params = {
      Bucket: AWS_KEY.bucket,
      Key: `want_to_modify/${fileName}`,
      Body: fileName,
    };
    await s3.putObject(params).promise();

    // app.py의 /combine_face 실행
    try {
      const response = await axios.get(url + '/combine_face');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    await downloadFromS3(pageIndex); // 페이지에 나온 사진 전부 reload 하고

    setTimeout(() => {
      setLoading(false); // 로딩 스크린 닫기
    }, 100);
  };

  const handleNextPage = async () => {
    if (pageIndex + 1 < faceNum) {
      try {
        setLoading(true);
        const s3 = new AWS.S3({
          accessKeyId: AWS_KEY.accessKey,
          secretAccessKey: AWS_KEY.secretKey,
          region: AWS_KEY.region,
        });
        await s3
          .putObject({
            Bucket: AWS_KEY.bucket,
            Key: `pageIndex/${pageIndex + 1}.txt`,
            Body: `${pageIndex + 1}`,
          })
          .promise();
        await axios.get(url + '/draw_box');
        await downloadFromS3(pageIndex + 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
      setPageIndex(pageIndex + 1);
    } else {
      try {
        setLoading(true);

        await s3
          .putObject({
            Bucket: AWS_KEY.bucket,
            Key: `pageIndex/${0}.txt`,
            Body: `${0}`,
          })
          .promise();
        await axios.get(url + '/draw_box');
        await downloadFromS3(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setPageIndex(0);
      }
    }
  };

  const handlePrevPage = async () => {
    if (pageIndex >= 1) {
      try {
        setLoading(true);
        const s3 = new AWS.S3({
          accessKeyId: AWS_KEY.accessKey,
          secretAccessKey: AWS_KEY.secretKey,
          region: AWS_KEY.region,
        });
        await s3
          .putObject({
            Bucket: AWS_KEY.bucket,
            Key: `pageIndex/${pageIndex - 1}.txt`,
            Body: `${pageIndex - 1}`,
          })
          .promise();
        await axios.get(url + '/draw_box');
        await downloadFromS3(pageIndex - 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
      setPageIndex(pageIndex - 1);
    } else {
      ///////이거 왼쪽으로가다보면 3번사람, 2번사람, 1번사람, 없는 0번사람 찍고 다시 3번사람으로 감
      try {
        setLoading(true);

        await s3
          .putObject({
            Bucket: AWS_KEY.bucket,
            Key: `pageIndex/${faceNum-1}.txt`,
            Body: `${faceNum-1}`,
          })
          .promise();
        await axios.get(url + '/draw_box');
        await downloadFromS3(faceNum-1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setPageIndex(faceNum-1);
      }
    }
  };

  const combineParams = {
    Bucket: AWS_KEY.bucket,
    Prefix: 'result_img/',
  };

  const checkDownloadResult = async () => {
    const combineData = await s3.listObjects(combineParams).promise();
    if (combineData.Contents.some((object) => object.Key.endsWith('.jpg'))) {
      return true;
    }
  }

  const handleGoEnding = async () => {
    await axios.get(url + 'upload_result');
    try{
    const resultLoop = setInterval(async () => {
      var resultCombineData = await checkDownloadResult();
      

      if (resultCombineData == true){
        navigation.navigate('Ending');
        clearInterval(resultLoop);
      }
    },500);
  } catch (error) {
    // 에러 처리
    console.error(error);
  }

  };

  return (
    <View style={styles.container}>
      {/* 로딩화면 */}
      <Modal visible={loading}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fefbfc',
          }}
        >
          <ActivityIndicator size="large" />
          <Image source={require('../../assets/loadingCharacter.gif')} />
        </View>
      </Modal>
      {/* 로딩화면 */}
      <Button title={'다음 페이지'} onPress={handleGoEnding} />
      <Image style={styles.mainImageContainer} source={{ uri: imageUri }} />
      <TouchableOpacity onPress={handlePrevPage} style={styles.chevronLeft}>
        <FontAwesome name="chevron-left" size={40} color={WHITE} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNextPage} style={styles.chevronRight}>
        <FontAwesome name="chevron-right" size={40} color={WHITE} />
      </TouchableOpacity>
      <View style={styles.rowContainer}>
        <Image
          source={require('../../assets/cropdot.gif')}
          style={styles.cropdot}
        />
        <Text style={styles.selectText}>가장 마음에 드는 사진을 골라줘!</Text>
      </View>
      <ScrollView horizontal persistentScrollbar style={styles.ScrollView}>
        {otherImages.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => onImageSelected(image)}>
            <Image
              source={{ uri: image }}
              style={styles.croppedImageContainer}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingBottom: '5%',
  },
  mainImageContainer: {
    width: '100%',
    height: '67%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  croppedImageContainer: {
    // {
    // ...styles.otherImage,
    // marginTop: 20,
    // },
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 4,
    borderColor: GRAY.DEFAULT,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chevronLeft: {
    position: 'absolute',
    top: '34%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chevronRight: {
    position: 'absolute',
    top: '34%',
    bottom: 0,
    left: '93%',
    right: 0,
  },
  cropdot: {
    resizeMode: 'contain',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginLeft: 20,
  },
  ScrollView: {
    backgroundColor: WHITE,
    marginHorizontal: 15,
  },
  selectText: {
    fontSize: 15,
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    marginLeft: 10,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
});

export default PhotoEditing;