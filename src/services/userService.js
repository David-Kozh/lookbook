import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, collection, query, orderBy } from "firebase/firestore";
import { uploadProfilePicture, deleteCollectionThumbnail, deleteAllPostMedia } from './storageService';
import { deleteAllLikesOnPost, deleteAllOutgoingLikes } from './likeService';

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

export const getUserCollectionThumbnails = async (uid) => { //? Move to collectionService.js?
  const collectionsRef = collection(db, 'users', uid, 'collections');
  const thumbnails = [];

  try {
      const collectionsQuery = query(collectionsRef, orderBy('createdAt', 'desc'));
      const collectionsSnapshot = await getDocs(collectionsQuery);

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

// Follow a user
export const followUser = async (currentUserId, targetUserId) => {
  try {
    const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
    const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);

    // Add the target user to the current user's "following" list
    await setDoc(followingRef, { timestamp: Date.now() });

    // Add the current user to the target user's "followers" list
    await setDoc(followerRef, { timestamp: Date.now() });

    console.log(`User ${currentUserId} is now following ${targetUserId}`);
  } catch (error) {
    console.error('Error following user:', error.message);
  }
};

// Unfollow a user
export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
    const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);

    // Remove the target user from the current user's "following" list
    await deleteDoc(followingRef);

    // Remove the current user from the target user's "followers" list
    await deleteDoc(followerRef);

    console.log(`User ${currentUserId} has unfollowed ${targetUserId}`);
  } catch (error) {
    console.error('Error unfollowing user:', error.message);
  }
};

// Fetch followers of a user
export const getFollowers = async (userId) => {
  try {
    const followersRef = collection(db, 'users', userId, 'followers');
    const followersSnapshot = await getDocs(followersRef);

    const followers = followersSnapshot.docs.map(doc => doc.id);
    console.log(`Followers of ${userId}:`, followers);
    return followers;
  } catch (error) {
    console.error('Error fetching followers:', error.message);
    throw new Error('Failed to fetch followers');
  }
};

// Fetch users a user is following
export const getFollowing = async (userId) => {
  try {
    const followingRef = collection(db, 'users', userId, 'following');
    const followingSnapshot = await getDocs(followingRef);

    const following = followingSnapshot.docs.map(doc => doc.id);
    console.log(`Users followed by ${userId}:`, following);
    return following;
  } catch (error) {
    console.error('Error fetching following:', error.message);
    throw new Error('Failed to fetch following');
  }
};

//* Delete functions
//*
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
      
      // Delete all likes on the post before deleting the post
      await deleteAllLikesOnPost(postId);
      // Delete all media associated with the post
      await deleteAllPostMedia(uid, collectionId, postId);
      // Delete the post document
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
    // Delete all outgoing likes by the user
    await deleteAllOutgoingLikes(uid);
    
    // Delete all collections and posts before deleting the user
    await deleteUserCollections(uid);

    // Delete all followers and following references
    await deleteAllFollowers(uid);
    await deleteAllFollowing(uid);

    // Delete the user document
    await deleteDoc(userDocRef);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }

};

// Helper function to delete all followers of a user
export const deleteAllFollowers = async (uid) => {
  const followersRef = collection(db, 'users', uid, 'followers');
  const followersSnapshot = await getDocs(followersRef);

  try {
    for (const followerDoc of followersSnapshot.docs) {
      const followerId = followerDoc.id;

      // Remove the current user from the follower's "following" subcollection
      const followingRef = doc(db, 'users', followerId, 'following', uid);
      await deleteDoc(followingRef);

      // Remove the follower from the current user's "followers" subcollection
      await deleteDoc(followerDoc.ref);
    }
    console.log(`All followers of user ${uid} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting followers:', error.message);
  }
};

// Helper function to delete all users the current user is following
export const deleteAllFollowing = async (uid) => {
  const followingRef = collection(db, 'users', uid, 'following');
  const followingSnapshot = await getDocs(followingRef);

  try {
    for (const followingDoc of followingSnapshot.docs) {
      const followingId = followingDoc.id;

      // Remove the current user from the followed user's "followers" subcollection
      const followerRef = doc(db, 'users', followingId, 'followers', uid);
      await deleteDoc(followerRef);

      // Remove the followed user from the current user's "following" subcollection
      await deleteDoc(followingDoc.ref);
    }
    console.log(`All following references of user ${uid} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting following references:', error.message);
  }
};