import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';

export const uploadImageAsync = async (uri: string, major: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const imageRef = ref(storage, `${major}/${filename}`);
  await uploadBytes(imageRef, blob);
  return await getDownloadURL(imageRef);
}