import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const generateUniqueHandle = async (baseHandle) => {
  let handle = baseHandle.toLowerCase().replace(/\s+/g, '-'); // Convert to slug
  let isUnique = false;
  let suffix = 0;

  while (!isUnique) {
    const handleQuery = query(collection(db, 'users'), where('handle', '==', handle));
    const handleSnapshot = await getDocs(handleQuery);

    if (handleSnapshot.empty) {
      isUnique = true;
    } else {
      suffix += 1;
      handle = `${baseHandle}-${suffix}`;
    }
  }

  return handle;
};

// TODO: Complete fields for the user document. defaultTheme?
const createUserDocument = async (user) => {
  // ! This is where the user document is defined in the database
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const baseHandle = user.displayName || user.email.split('@')[0];
    const handle = await generateUniqueHandle(baseHandle);
    
    const newUser = {
      email: user.email || 'no-email@example.com',
      displayName: user.displayName || 'Display Name',
      handle,
      photoURL: user.photoURL || 'default',
      createdAt: new Date(),
      bio: 'This is your profile bio. Tell the world a little about what kind of works are in your LookBook!',
      socialMediaLinks: {},
      darkModePref: false,
    };

    await setDoc(userDocRef, newUser);
    console.log('User document created:', newUser);
  }
};

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(userCredential.user);
    
    console.log('User signed up:', userCredential.user);
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
