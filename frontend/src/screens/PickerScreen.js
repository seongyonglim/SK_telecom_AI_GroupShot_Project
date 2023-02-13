import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState } from 'react';
import ImagePicker from '../components/ImagePicker';
import HeaderRight from '../components/HeaderRight';

const PickerScreen = () => {
  // 네비게이션 객체와 현재 라우트 정보 가져오기
  const navigation = useNavigation();
  const stateRoutes = useNavigationState((state) => state.routes);

  const maxCount = 10;
  // 선택된 이미지 정보를 저장하는 state
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // 이전 화면으로 돌아갈 때 선택된 이미지 정보를 넘겨주기 위한 함수
  const onSelect = useCallback(() => {
    const prevScreenName = stateRoutes[stateRoutes.length - 2].name;
    navigation.navigate(prevScreenName, { selectedPhotos });
  }, [navigation, selectedPhotos, stateRoutes]);

  useLayoutEffect(() => {
    // 헤더에 오른쪽 버튼 추가
    navigation.setOptions({
      headerRight: () => (
        // 오른쪽 버튼의 상태에 따라 비활성화 여부 설정
        <HeaderRight disabled={selectedPhotos.length < 1} onPress={onSelect} />
      ),
    });
  }, [navigation, onSelect, selectedPhotos.length]);

  // 사진이 이미 선택된 것인지 확인하는 함수
  const isSelectedPhoto = (photo) => {
    return selectedPhotos.findIndex((item) => item.id === photo.id) > -1;
  };

  // 사진 선택 전환 함수
  const togglePhoto = (photo) => {
    const isSelected = isSelectedPhoto(photo);
    setSelectedPhotos((prev) => {
      // 선택된 사진이면 선택 취소
      if (isSelected) {
        return prev.filter((item) => item.id !== photo.id);
      }

      // 선택된 사진 개수가 최대 개수보다 적으면 추가
      if (maxCount > prev?.length) {
        return [...prev, photo];
      }

      // 그렇지 않으면 기존 배열 반환
      return prev;
    });
  };

  return (
    <ImagePicker togglePhoto={togglePhoto} isSelectedPhoto={isSelectedPhoto} />
  );
};

export default PickerScreen;
