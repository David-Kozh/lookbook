import { db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { uploadProfilePicture, deleteCollectionThumbnail, deleteAllPostMedia } from './storageService';

export const fetchUserData = async (uid) => {
  console.log('Fetching user data...');
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    userData.id = uid; // Add the user ID to the returned data
    console.log('User document data:', userData);
    return userData;
  } else {
    console.error('No such user document!');
    return null;
  }
};

export const updateUser = async (uid, data) => {
  const userDocRef = doc(db, 'users', uid);

  try {
    // Check if photo is present in data; Upload to storage
    if (data.photoFile) {
      console.log('Uploading profile picture...');
      const photoUrl = await uploadProfilePicture(uid, data.photoFile);
      data.photoURL = photoUrl;
      delete data.photoFile; // Remove the photo file from data
    }

    await updateDoc(userDocRef, data);
    console.log('User data updated successfully');

  } catch (error) {
    console.error('Error updating user data:', error.message);
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

export const deleteUserCollections = async (uid) => {
  const collectionsRef = collection(db, 'users', uid, 'collections');
  const collectionsSnapshot = await getDocs(collectionsRef);

  for (const collectionDoc of collectionsSnapshot.docs) {
    const collectionId = collectionDoc.id;
    const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');
    const postsSnapshot = await getDocs(postsRef);

    // Delete all posts in the collection
    for (const postDoc of postsSnapshot.docs) {
      const postId = postDoc.id;
      await deleteAllPostMedia(uid, collectionId, postId);
      await deleteDoc(postDoc.ref);
    }

    // Delete the collection document
    await deleteCollectionThumbnail(uid, collectionId);
    await deleteDoc(collectionDoc.ref);
  }
};

export const deleteUser = async (uid) => {
  const userDocRef = doc(db, 'users', uid);

  try {
    //* Delete all collections and posts before deleting the user
    await deleteUserCollections(uid);
    await deleteDoc(userDocRef);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }

};