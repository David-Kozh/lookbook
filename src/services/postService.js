import { getFirestore, doc, addDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";

const db = getFirestore();

export const createPost = async (uid, collectionId, post) => {
  const postsRef = collection(db, 'users', uid, 'collections', collectionId, 'posts');
  
  const postData = {
    title: post.title || 'Untitled Post',
    description: post.description || '',
    image: post.image || '',
    aspectRatio: post.aspectRatio || '1:1',
    postType: post.postType || 'default',
    content: post.content || null,
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
    await updateDoc(postDocRef, data);
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