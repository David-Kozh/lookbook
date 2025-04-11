import { db } from '../config/firebaseConfig';
import { doc, addDoc, updateDoc, deleteDoc, getDocs, collection, orderBy, query } from "firebase/firestore";
import { deleteAllPostMedia, uploadPostMedia } from "./storageService";
import { deleteAllLikesOnPost } from './likeService';

// Max number of posts per collection limited to 10
export const createPost = async (uid, collectionId, post, maxPosts = 10) => {
  console.log('Creating post:', post, 'in collection:', collectionId, 'for user:', uid);
  const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');

  try {
    // Check the current number of posts in the collection
    const postsSnapshot = await getDocs(postsRef);
    if (postsSnapshot.size >= maxPosts) {
      throw new Error(`Post limit of ${maxPosts} reached for this collection. Cannot create more posts.`);
    }

    const postData = {
      userId: uid,
      collectionId: collectionId,
      title: post.title || 'Untitled Post',
      description: post.description || '',
      image: '',
      aspectRatio: post.aspectRatio || '1:1',
      postType: post.postType || 'default',
      content: null,
      createdAt: post.createdAt || new Date(),
    };

    const newPostRef = await addDoc(postsRef, postData);
    const postId = newPostRef.id;
    console.log('Post doc created, Uploading media files...');

    // Upload media files to Cloud Storage and get their URLs
    const mediaFiles = {};
    if (post.imageFile) {
      mediaFiles.image = post.imageFile;
    }
    if (post.contentFile) {
      mediaFiles.content = post.contentFile;
    }
    const mediaUrls = await uploadPostMedia(uid, collectionId, postId, mediaFiles);

    // Update the document with the actual URLs
    await updateDoc(doc(db, 'users', uid, 'collections', collectionId, 'posts', postId), {
      image: mediaUrls.image || '',
      content: mediaUrls.content || null,
    });

    console.log('Post created successfully');
    return newPostRef.id; // Return the generated ID if caller needs it

  } catch (error) {
    console.error('Error creating post:', error.message);
  }
};

export const updatePost = async (uid, collectionId, postId, data) => {
  const postDocRef = doc(db, 'users', uid, 'collections', collectionId, 'posts', postId);

  try {
    const updatedData = {}; //* Prune data so only changed fields are passed to updateDoc
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

    // Add non-null/undefined fields from data to updatedData
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        updatedData[key] = data[key];
      }
    }

    // Add media URLs to updatedData
    if (mediaUrls.image) {
      updatedData.image = mediaUrls.image;
    }
    if (mediaUrls.content) {
      updatedData.content = mediaUrls.content;
    }

    // Update the post document with the new media URLs and other data
    await updateDoc(postDocRef, updatedData);

    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error.message);
  }
};

//* Delete a post and its associated media/likes
export const deletePost = async (uid, collectionId, postId) => {
  const postDocRef = doc(db, 'users', uid, 'collections', collectionId, 'posts', postId);

  try {
    await deleteAllPostMedia(uid, collectionId, postId);
    console.log('Post\'s Media successfully');

    await deleteAllLikesOnPost(uid, collectionId, postId);
    console.log('Post\'s Likes successfully');

    await deleteDoc(postDocRef);
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error.message);
  }
};

export const getPosts = async (uid, collectionId) => {
  const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');
  //TODO How to order posts?
  // Firebase does not have a static order?
  const postsQuery = query(postsRef, orderBy('createdAt'));
  try {
    const snapshot = await getDocs(postsRef);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error.message);
    throw new Error('Failed to get posts');
  }
};