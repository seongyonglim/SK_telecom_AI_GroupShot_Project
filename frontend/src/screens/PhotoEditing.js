import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AWS from 'aws-sdk';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { AWS_KEY, flask_API } from '../AWS';

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
    }, 3000);
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
      navigation.navigate('Ending');
      axios.get(url + '/upload_result');
    }
  };

  const handlePrevPage = async () => {
    if (pageIndex - 1 >= 0) {
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
      console.log('팝업 : 첫 번째 사람입니다.');
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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 23,
          marginTop : 15,
          marginBottom : 15,
        }}
      >
        <TouchableOpacity onPress={handlePrevPage}>
          <FontAwesome name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage}>
          <FontAwesome name="chevron-right" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <Image style={styles.mainImageContainer} source={{ uri: imageUri }} />

      <ScrollView horizontal>
        {otherImages.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => onImageSelected(image)} >
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
    justifyContent: 'center',
    backgroundColor: '#afcbf4',
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
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#fff',
    marginLeft : 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default PhotoEditing;
