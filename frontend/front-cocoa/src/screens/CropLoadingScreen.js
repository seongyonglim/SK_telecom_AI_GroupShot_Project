import { useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { WHITE } from '../colors';
import PythonTestScreen from './PythonTestScreen';
import axios from 'axios';

const CropLoadingScreen = async () => {
    await console.log("hi")
    var url = 'http://172.23.254.165:5000/'
    const navigation = useNavigation();

    await axios.get(url+'/crop_face');
    navigation.navigate(PythonTestScreen);

    return (
    <View style={styles.container}>
        <View style={styles.selectContainer}>
        <Text style={styles.selectTitle}>
            {'데이터 처리중이야\n기다려줘!'}
        </Text>
        <Image
            source={require('../../assets/loadingGif.gif')}
            style={styles.selectAdot}
        />
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: WHITE,
    },
    selectContainer: {
    flexDirection: 'row',
    },
    selectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    textAlignVertical: 'center',
    },
    selectAdot: {
    width: 200,
    height: 250,
    },
});

export default CropLoadingScreen;
