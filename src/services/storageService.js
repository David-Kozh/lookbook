import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../config/firebaseConfig';

//* This file manages the cloud storage for the app
/*  
    * Example Paths:
        User Directory: users/12345/
        Collection Directory: users/12345/collections/67890/
        Collection Thumbnail: users/12345/collections/67890/thumbnail.jpg
        Post Directory: users/12345/collections/67890/posts/abcde/
        Post Image: users/12345/collections/67890/posts/abcde/image
        Post Content: users/12345/collections/67890/posts/abcde/content
*/
//* Collection Thumbnail
export const uploadCollectionThumbnail = async (uid, collectionId, file) => {
    const storageRef = ref(storage, `users/${uid}/collections/${collectionId}/thumbnail.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const deleteCollectionThumbnail = async (uid, collectionId) => {
    const storageRef = ref(storage, `users/${uid}/collections/${collectionId}/thumbnail.jpg`);
    await deleteObject(storageRef);
};


//* Post Media (Thumbnail and optional audio or video files)
export const uploadPostMedia = async (uid, collectionId, postId, mediaFiles) => {
    console.log('Uploading post media to storage');
    const urls = {};

    for (const [key, file] of Object.entries(mediaFiles)) {
        const storageRef = ref(storage, `users/${uid}/collections/${collectionId}/posts/${postId}/${key}`);
        await uploadBytes(storageRef, file);
        urls[key] = await getDownloadURL(storageRef);
    }

    return urls;
};

export const deletePostMedia = async (uid, collectionId, postId, mediaKeys) => {
    for (const key of mediaKeys) {
        const storageRef = ref(storage, `users/${uid}/collections/${collectionId}/posts/${postId}/${key}`);
        await deleteObject(storageRef);
    }
};

//* Delete all media for a post
export const deleteAllPostMedia = async (uid, collectionId, postId) => {
    const postRef = ref(storage, `users/${uid}/collections/${collectionId}/posts/${postId}`);
    const listResult = await listAll(postRef);

    for (const itemRef of listResult.items) {
        await deleteObject(itemRef);
    }
};