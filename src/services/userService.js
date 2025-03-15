import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

export const fetchUserData = async (uid) => {
  console.log('Fetching user data...');
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    console.log('User document data:', userDoc.data());
    return userDoc.data();
  } else {
    console.error('No such user document!');
    return null;
  }
};

export const updateUserData = async (uid, data) => {
  const userDocRef = doc(db, 'users', uid);

  try {
    await updateDoc(userDocRef, data);
    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error.message);
  }
};

export const deleteUser = async (uid) => {
    const userDocRef = doc(db, 'users', uid);

    try {
        await deleteDoc(userDocRef);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }
};

