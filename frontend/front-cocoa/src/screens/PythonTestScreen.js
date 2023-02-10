import { useNavigation } from '@react-navigation/native';

import {
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BG from '../../assets/splash.webp';
import { PRIMARY } from '../colors';
import axios from 'axios';
import PhotoEditing from './.PhotoEditing';

const PythonTestScreen = () => {
  const navigation = useNavigation();

  var url = 'http://172.23.254.165:5000/';

  {
    /* 파이썬 얼굴 crop + 합성 동작 버튼 */
  }
  const combine_face = async () => {
    await axios.get(url + 'combine_face');
  };

  {
    /* 파이썬에서 사진을 다운받아 확인하는 버튼 */
  }
  const check_upload = async () => {
    await axios.get(url + 'check_upload');
  };

  {
    /* AWS 파일 정리 버튼 */
  }
  const cleanup_AWS = async () => {
    await axios.get(url + 'cleanup_AWS');
  };

  /* PhotoEditing Screen 이동 버튼 */
  const move_PhotoEditing = async () => {
    navigation.navigate(PhotoEditing);
  };

  return (
    <ImageBackground source={BG} style={styles.container}>
      <View style={styles.rectangleContainer}>
        <TouchableOpacity style={styles.button} onPress={move_PhotoEditing}>
          <Text style={styles.buttonText}>다음 화면으로</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={combine_face}>
          <Text style={styles.buttonText}>얼굴 합성</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={check_upload}>
          <Text style={styles.buttonText}>업로드 데이터 파이썬으로 확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={cleanup_AWS}>
          <Text style={styles.buttonText}>AWS 비우기</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: PRIMARY.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PythonTestScreen;
