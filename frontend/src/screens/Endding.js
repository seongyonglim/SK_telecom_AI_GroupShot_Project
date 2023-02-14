import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  alert,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import AWS from 'aws-sdk';
import { AWS_KEY } from '../AWS';

// AWS S3 설정
AWS.config.update({
  accessKeyId: AWS_KEY.accessKey,
  secretAccessKey: AWS_KEY.secretKey,
  region: AWS_KEY.region,
});

export default function App() {
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

  const shareImage = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on your platform');
      return;
    }

    Sharing.shareAsync(imageUri);
  };

  useEffect(() => {
    downloadFromS3();
  }, []);

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <TouchableOpacity style={styles.button} onPress={shareImage}>
        <Text style={styles.buttonText}>Share Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});