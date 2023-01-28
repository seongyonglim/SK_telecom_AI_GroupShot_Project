import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export const uploadPhoto = async (uri) => {
  if (uri.startsWith('https')) {
    return uri;
  }

  const blob = await new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      // eslint-disable-next-line no-console
      console.log('blob error: ', e);
      reject(new Error('사진 업로드에 실패했습니다.'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const filename = uri.split('/').pop();
  const storageRef = ref(
    getStorage(),
    `/${getAuth().currentUser.uid}/${filename}`
  );
  // '/4ILU0c8Ao2ZBz9LNTxtDFTxm0jq1/IMG_0019.JPEG
  await uploadBytes(storageRef, blob);

  blob.close();

  return await getDownloadURL(storageRef);
};
