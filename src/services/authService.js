import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// TODO: Complete fields for the user document
const createUserDocument = async (user) => {
  // ! This is where the user document is defined in the database
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const { 
      email = 'no-email@example.com', 
      displayName = 'Jane Doe',
      handle = 'janedoe',
      photoURL = 'default-profile-pic-url' 
    } = user;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        displayName,
        handle,
        photoURL,
        createdAt,
        bio: 'This is your profile bio. Tell the world a little about what kind of works are in your LookBook!',
        mediaLinks: [], // Array of social media links (e.g. LinkedIn, Personal website, etc.)
      });
    } catch (error) {
      console.error('Error in createUserDocument:', error.message);
    }
  }
};

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Error in signup: ' + error.message);
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error('Error in login: ' + error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return "User logged out successfully";
  } catch (error) {
    throw new Error('Error in logout: ' + error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await createUserDocument(user);
    return user;
  } catch (error) {
    throw new Error('Error in signInWithGoogle: ' + error.message);
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    await createUserDocument(user);
    return user;
  } catch (error) {
    throw new Error('Error in signInWithGithub: ' + error.message);
  }
};
