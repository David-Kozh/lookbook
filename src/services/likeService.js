import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, limit, startAfter, doc, getDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

// Add a like
export const addLike = async (userId, postOwnerId, collectionId, postId) => {
  try {
    const likesRef = collection(db, 'likes');
    await addDoc(likesRef, { 
      userId,
      postOwnerId,
      collectionId, 
      postId, 
      timestamp: new Date() 
    });
    console.log('Like added successfully');
  } catch (error) {
    console.error('Error adding like:', error.message);
    throw new Error('Failed to add like');
  }
};

// Remove a like
export const removeLike = async (userId, postOwnerId, collectionId, postId) => {
  try {
    console.log('userId:', userId);
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || currentUserId !== userId) {
      console.error('User ID mismatch or user is not authenticated');
    }

    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef, 
      where('userId', '==', userId), 
      where('postOwnerId', '==', postOwnerId),
      where('collectionId', '==', collectionId),
      where('postId', '==', postId)
    );
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
export const hasLiked = async (userId, postOwnerId, collectionId, postId) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef, 
      where('userId', '==', userId), 
      where('postOwnerId', '==', postOwnerId),
      where('collectionId', '==', collectionId),
      where('postId', '==', postId)
    );
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
    return querySnapshot.docs.map((doc) => {
      const { postId, postOwnerId, collectionId } = doc.data();
      return { postId, postOwnerId, collectionId };
    });
  } catch (error) {
    console.error('Error fetching user likes:', error.message);
    throw new Error('Failed to fetch user likes');
  }
};

/**
 * Fetch a batch of liked posts for a user.
 * @param {string} userId - The ID of the user whose liked posts are being fetched.
 * @param {Object} lastDoc - The last document from the previous batch (for pagination).
 * @param {number} batchSize - Number of liked posts to fetch per batch.
 * @returns {Object} - An object containing the liked posts and the last document for pagination.
 */
export const getLikedPosts = async (userId, lastDoc = null, batchSize = 12) => {
  try {
      // Reference to the user's likes collection
      const likesRef = collection(db, 'likes');
      const q = query(
          likesRef,
          where('userId', '==', userId),
          orderBy("timestamp", "desc"), // Order by the timestamp of the like
          ...(lastDoc ? [startAfter(lastDoc)] : []), // Pagination support
          limit(batchSize) // Limit the number of results
      );

      // Execute the query to get the likes
      const likesSnapshot = await getDocs(q);

      // Fetch the corresponding posts for each like
      const likedPosts = [];
      for (const likeDoc of likesSnapshot.docs) {
          const likeData = likeDoc.data();
          const { postOwnerId, collectionId, postId } = likeData;
          if (!postOwnerId || !collectionId || !postId) {
            console.warn(`Skipping like document with missing fields: ${likeDoc.id}`);
            continue; // Skip this document if any field is missing
          }
          // Fetch the post document
          const postRef = doc(db, "users", postOwnerId, "collections", collectionId, "posts", postId);
          const postDoc = await getDoc(postRef);

          if (postDoc.exists()) {
              likedPosts.push({
                  id: postDoc.id,
                  ...postDoc.data(),
              });
          } else {
              console.warn(`Post ${postId} by user ${postOwnerId} not found.`);
          }
      }

      return {
          likedPosts,
          lastDoc: likesSnapshot.docs[likesSnapshot.docs.length - 1] || null, // Return the last document for pagination
      };
  } catch (error) {
      console.error("Error fetching liked posts:", error.message);
      throw new Error("Failed to fetch liked posts");
  }
};

//* Delete functions
// Delete all likes on a specific post
export const deleteAllLikesOnPost = async (postOwnerId, collectionId, postId) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, 
      where('postOwnerId', '==', postOwnerId),
      where('collectionId', '==', collectionId),
      where('postId', '==', postId)
    );
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log(`All likes on post ${postId} have been deleted successfully.`);
  } catch (error) {
    console.error('Error deleting likes on post:', error.message);
    throw new Error('Failed to delete likes on post');
  }
};

// Delete all outgoing likes from a user
export const deleteAllOutgoingLikes = async (userId) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log(`All outgoing likes from user ${userId} have been deleted successfully.`);
  } catch (error) {
    console.error('Error deleting outgoing likes:', error.message);
    throw new Error('Failed to delete outgoing likes');
  }
};