import { db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";

export const fetchUserData = async (uid) => {
  console.log('Fetching user data...');
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    console.log('User document data:', userDoc.data());
    return userDoc.data();
  } else {
    console.error('No such user document!');
    return null;
  }
};

export const updateUserData = async (uid, data) => {
  const userDocRef = doc(db, 'users', uid);

  try {
    await updateDoc(userDocRef, data);
    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error.message);
  }
};

export const deleteUser = async (uid) => {
    const userDocRef = doc(db, 'users', uid);

    try {
        await deleteDoc(userDocRef);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }
};

export const getUserCollectionThumbnails = async (uid) => {
  const collectionsRef = collection(db, 'users', uid, 'collections');
  const thumbnails = [];

  try {
      const collectionsSnapshot = await getDocs(collectionsRef);
      for (const collectionDoc of collectionsSnapshot.docs) {
          const collectionData = collectionDoc.data();
          let thumbnailUrl = collectionData.thumbnail;
          let aspectRatio = '1:1';

          // If the collection does not have a thumbnail, get the first post's image
          if (!thumbnailUrl) {
              const postsRef = collection(db, 'users', uid, 'collections', collectionDoc.id, 'posts');
              const postsSnapshot = await getDocs(postsRef);
              if (!postsSnapshot.empty) {
                  const firstPostDoc = postsSnapshot.docs[0];
                  const firstPostData = firstPostDoc.data();
                  thumbnailUrl = firstPostData.image || '';
                  aspectRatio = firstPostData.aspectRatio || '1:1';
              }
          }

          thumbnails.push({thumbnailUrl: thumbnailUrl, aspectRatio: aspectRatio});
      }

      return thumbnails;
  } catch (error) {
      console.error('Error getting collection thumbnails:', error.message);
      throw new Error('Failed to get collection thumbnails');
  }
};