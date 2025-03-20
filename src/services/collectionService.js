import { db } from '../config/firebaseConfig';
import { doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { uploadCollectionThumbnail, deleteCollectionThumbnail } from './storageService';

//* Returns the ID of the newly created collection
export const createCollection = async (uid, collectionData) => {
    const collectionsRef = collection(db, 'users', uid, 'collections');

    const newCollectionData = {
        title: collectionData.title || 'Untitled Collection',
        subtitle: collectionData.subtitle || '',
        thumbnail: '',
        createdAt: new Date(),
        displaySettings: {
            font: collectionData.displaySettings.font,
            theme: collectionData.displaySettings.theme,
            public: collectionData.displaySettings.public || false,
        },
    };

    try {
        const newCollectionRef = await addDoc(collectionsRef, newCollectionData);
        const collectionId = newCollectionRef.id;
        
        //* Upload the thumbnail file to Cloud Storage and update the new Collection
        if (collectionData.thumbnailFile) {
            const thumbnailURL = await uploadCollectionThumbnail(uid, collectionId, collectionData.thumbnailFile);
            await updateDoc(newCollectionRef, { thumbnail: thumbnailURL });
        }
        console.log('Collection created successfully');
        return newCollectionRef.id;

    } catch (error) {
        console.error('Error creating collection:', error.message);
    }
};

export const updateCollection = async (uid, collectionId, data) => {
    const collectionDocRef = doc(db, 'users', uid, 'collections', collectionId);
    
    try {
        if (data.thumbnailFile) {
            // Upload the new thumbnail file to Cloud Storage, overwriting the old one
            const thumbnailURL = await uploadCollectionThumbnail(uid, collectionId, data.thumbnailFile);

            // Remove the thumbnailFile from the data object to avoid storing it in Firestore
            delete data.thumbnailFile;

            // Update the collection document with the new thumbnail URL
            await updateDoc(collectionDocRef, {
                ...data,
                thumbnail: thumbnailURL,
            });

        } else {
            await updateDoc(collectionDocRef, data);
        }

        console.log('Collection updated successfully');
    } catch (error) {
        console.error('Error updating collection:', error.message);
    }
};

export const deleteCollection = async (uid, collectionId) => {
    const collectionDocRef = doc(db, 'users', uid, 'collections', collectionId);

    try {
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
        await deleteDoc(collectionDocRef);
        console.log('Collection deleted successfully');
    } catch (error) {
        console.error('Error deleting collection:', error.message);
    }
};

export const getUserCollections = async (uid) => {
    const collectionsRef = collection(db, 'users', uid, 'collections');
    try {
        const querySnapshot = await getDocs(collectionsRef);
        const collections = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error.message);
        throw new Error('Error fetching collections');
    }
};

export const getCollection = async (uid, collectionId) => {
    const collectionRef = doc(db, 'users', uid, 'collections', collectionId);

    try {
        const collectionDoc = await getDoc(collectionRef);
        if (collectionDoc.exists()) {
            return { id: collectionDoc.id, ...collectionDoc.data() };
        } else {
            console.error('No such collection document!');
            throw new Error('Error fetching collection');
        }
    } catch (error) {
        console.error('Error fetching collection:', error.message);
    }
};