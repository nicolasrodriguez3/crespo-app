import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function getProfileImage(userID) {
	const storage = getStorage();
	const pathReference = ref(storage, `avatars/${userID}`);
	return await getDownloadURL(pathReference)
}