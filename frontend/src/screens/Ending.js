import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Text,
  Alert,
  Share,
} from 'react-native';
import AWS from 'aws-sdk';
import { AWS_KEY } from '../AWS';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { GRAY, WHITE, PRIMARY } from '../colors';

// AWS S3 설정
AWS.config.update({
  accessKeyId: AWS_KEY.accessKey,
  secretAccessKey: AWS_KEY.secretKey,
  region: AWS_KEY.region,
});

const Ending = () => {
  const [imageUri, setImageUri] = useState(null);

  const downloadFromS3 = async () => {
    // "result_img" 폴더에서 이미지 가져오기
    const imgParams = {
      Bucket: AWS_KEY.bucket,
      Prefix: 'result_img/',
    };
    const s3 = new AWS.S3();

    const imgData = await new Promise((resolve, reject) => {
      s3.listObjects(imgParams, (err, data) => {
        if (err) reject(err);

        resolve(data);
      });
    });

    const imgFirstParams = {
      Bucket: AWS_KEY.bucket,
      Key: imgData.Contents[0].Key,
    };

    const imgUrl = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', imgFirstParams, (err, url) => {
        if (err) reject(err);

        resolve(url);
      });
    });

    setImageUri(imgUrl);
  };

  // 이미지 파일을 저장하는 함수
  const saveImage = async (imageUri) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'image.jpg';
      await FileSystem.downloadAsync(imageUri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Expo Image', asset, false);
      Alert.alert('Image saved to camera roll!');
    } catch (error) {
      console.log(error.message);
    }
  };
  // 이미지 파일을 공유하는 함수
  const shareImage = async (imageUri) => {
    try {
      const answer = await new Promise((resolve) => {
        Alert.alert(
          'Save before sharing',
          'Do you want to save the image before sharing?',
          [
            {
              text: 'Save',
              onPress: () => {
                resolve(true);
              },
            },
            {
              text: 'Cancel',
              onPress: () => {
                resolve(false);
              },
            },
          ]
        );
      });

      if (answer) {
        await saveImage(imageUri);
      }

      const fileUri = `${FileSystem.documentDirectory}image.jpg`;
      const result = await Share.share({
        url: fileUri,
        title: 'Image Sharing',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // // 이미지 파일을 공유하는 함수
  // const shareImage = async (imageUri) => {
  //   try {
  //     const answer = await new Promise((resolve) => {
  //       Alert.alert(
  //         'Save before sharing',
  //         'Do you want to save the image before sharing?',
  //         [
  //           {
  //             text: 'Save',
  //             onPress: () => {
  //               resolve(true);
  //             },
  //           },
  //           {
  //             text: 'Cancel',
  //             onPress: () => {
  //               resolve(false);
  //             },
  //           },
  //         ]
  //       );
  //     });

  //     if (answer) {
  //       await saveImage(imageUri);
  //     }

  //     const album = await MediaLibrary.getAlbumAsync('Expo Image');
  //     const photos = await MediaLibrary.getAssetsAsync({
  //       first: 1,
  //       album: album,
  //     });

  //     if (photos && photos.assets.length > 0) {
  //       const fileUri = `file://${photos.assets[0].uri}`;
  //       const result = await Share.share({
  //         url: fileUri,
  //         title: 'Image Sharing',
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  useEffect(() => {
    downloadFromS3();
  }, []);

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => saveImage(imageUri)} style={styles.button}>
          <MaterialIcons name="save-alt" size={40} color={WHITE} />
          {/* <Text style={styles.buttonText}>저장하기</Text> */}
        </Pressable>

        <Pressable onPress={() => shareImage(imageUri)} style={styles.button}>
          <Entypo name="share" size={40} color={WHITE} />
          {/* <Text style={styles.buttonText}>공유하기</Text> */}
        </Pressable>

        <Image
          source={require('../../assets/endingdot.gif')}
          style={styles.endingAdot}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  endingAdot: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
    marginTop: -100,
    marginRight: -30,
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  button: {
    width: 60,
    height: 60,
    margin: 10,
    // marginLeft: 30,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 9,
    backgroundColor: PRIMARY.DEFAULT,
    borderRadius: 50,
    borderColor: PRIMARY.DEFAULT,
    borderWidth: 1,
  },
  buttonText: {
    color: PRIMARY.DEFAULT,
    width: '100%',
    textalign: 'center',
    marginTop: 3,
  },
});

export default Ending;
