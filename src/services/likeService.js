import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

// Add a like
export const addLike = async (userId, postId) => {
  try {
    const likesRef = collection(db, 'likes');
    await addDoc(likesRef, { userId, postId, timestamp: new Date() });
    console.log('Like added successfully');
  } catch (error) {
    console.error('Error adding like:', error.message);
    throw new Error('Failed to add like');
  }
};

// Remove a like
export const removeLike = async (userId, postId) => {
  try {
    console.log('userId:', userId);
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || currentUserId !== userId) {
      console.error('User ID mismatch or user is not authenticated');
    }

    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log('Like removed successfully');
  } catch (error) {
    console.error('Error removing like:', error.message);
    throw new Error('Failed to remove like');
  }
};

// Check if a user has liked a post
export const hasLiked = async (userId, postId) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking like status:', error.message);
    throw new Error('Failed to check like status');
  }
};

// Get all posts liked by a user
export const getUserLikes = async (userId) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().postId);
  } catch (error) {
    console.error('Error fetching user likes:', error.message);
    throw new Error('Failed to fetch user likes');
  }
};