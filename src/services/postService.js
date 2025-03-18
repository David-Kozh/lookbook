import { db } from '../config/firebaseConfig';
import { doc, addDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";
import { uploadPostMedia } from "./storageService";

//! Check usage across app
export const createPost = async (uid, collectionId, post) => {
  const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');
  
  // Upload media files to Cloud Storage and get their URLs
  const mediaFiles = {};
  if (post.imageFile) {
    mediaFiles.image = post.imageFile;
  }
  if (post.contentFile) {
    mediaFiles.content = post.contentFile;
  }
  const mediaUrls = await uploadPostMedia(post.id, mediaFiles);

  const postData = {
    title: post.title || 'Untitled Post',
    description: post.description || '',
    image: mediaUrls.image || '',
    aspectRatio: post.aspectRatio || '1:1',
    postType: post.postType || 'default',
    content: mediaUrls.content || null,
    createdAt: new Date(),
  };

  try {
    const newPostRef = await addDoc(postsRef, postData);
    console.log('Post created successfully');
    return newPostRef.id; // Return the generated ID if needed
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
};

export const updatePost = async (uid, collectionId, postId, data) => {
  const postDocRef = doc(db, 'users', uid, 'collections', collectionId, 'posts', postId);

  try {
    const mediaFiles = {};
    let mediaUrls = {};

    // Check if there are new media files to upload
    if (data.imageFile) {
      mediaFiles.image = data.imageFile;
    }
    if (data.contentFile) {
      mediaFiles.content = data.contentFile;
    }

    // If there are media files to upload, upload them and get their URLs
    if (Object.keys(mediaFiles).length > 0) {
      mediaUrls = await uploadPostMedia(uid, collectionId, postId, mediaFiles);

      // Remove the media files from the data object to avoid storing them in Firestore
      delete data.imageFile;
      delete data.contentFile;
    }

    // Update the post document with the new media URLs and other data
    await updateDoc(postDocRef, {
      ...data,
      ...mediaUrls,
    });

    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error.message);
  }
};

export const deletePost = async (uid, collectionId, postId) => {
  const postDocRef = doc(db, 'users', uid, 'collections', collectionId, 'posts', postId);

  try {
    await deleteDoc(postDocRef);
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error.message);
  }
};

export const getPosts = async (uid, collectionId) => {
  const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');

  try {
    const snapshot = await getDocs(postsRef);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error.message);
    throw new Error('Failed to get posts');
  }
};