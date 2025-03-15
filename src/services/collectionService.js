import { getFirestore, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export const createCollection = async (uid, collectionData) => {
    //* This line defines collections as a subcollection of the user document
    const collectionsRef = collection(db, 'users', uid, 'collections');
    
    const newCollectionData = {
        title: collectionData.title || 'Untitled Collection',
        subtitle: collectionData.subtitle || '',
        thumbnail: collectionData.thumbnail || '',
        createdAt: new Date(),
        displaySettings: {
            font: collectionData.displaySettings.font,
            theme: collectionData.displaySettings.theme,
            public: collectionData.displaySettings.public || false,
        },
    };

    try {
        const newCollectionRef = await addDoc(collectionsRef, newCollectionData);
        console.log('Collection created successfully');
        return newCollectionRef.id; // Return the generated ID if needed
    } catch (error) {
        console.error('Error creating collection:', error.message);
    }
};

export const updateCollection = async (uid, collectionId, data) => {
    const collectionDocRef = doc(db, 'users', uid, 'collections', collectionId);

    try {
        await updateDoc(collectionDocRef, data);
        console.log('Collection updated successfully');
    } catch (error) {
        console.error('Error updating collection:', error.message);
    }
};

export const deleteCollection = async (uid, collectionId) => {
    const collectionDocRef = doc(db, 'users', uid, 'collections', collectionId);

    try {
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