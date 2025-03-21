import React from 'react'
import { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter,  RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';
import { fetchUserData } from './services/userService';
import Root from './root.jsx'
import TrackPage from './TrackPage.jsx'
import UserDashboard from './UserDashboard';
import Home from './Home.jsx'
import ProfileSection from './ProfileSection.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import exampleCollections from './data/userCollections.js';
import Login from './login.jsx';
import SignUp from './signup.jsx';
import './App.css'
/*
  * Firebase Tasks:
    //✅ User Authentication
    //✅ Database for user collections and posts
    //✅  Finish replacing example data with Firestore function calls
    //✅  Cloud Storage for images and videos
    TODO  Testing and bugfixing
    TODO  Establish ordering for posts when creating a collection (is createdAt sufficient?)
  * Current Tasks:
    ! Current Stage: Testing Firebase and updating front end
    TODO  Update user settings (name, image, password, etc.)
    TODO  Link to own profile page if signed in, and viewing other profile in /bio/:userId
  * Functionalies to implement:
    Posts with no descriptions and those with short captions
    Add "like" functionality to posts
    Add "carousel" as a content type (daisyUI) like other post.content
    Add a check for 'theme' of collection in track. If dark, use something like bg-[#546578db]
  * Lower-priority:
    TODO  Signup page form validation (using sign in with google for now)
    TODO  Resize images/video does not work for 1:1 --> Transition between col/row orientation (issue with height of description not being set to image height)
    * Edit-Collection/Post Components:
      TODO  Gray out the "Save Changes" button if no changes have been made
      TODO  Gray out unchanged fields using Form API (touched fields)
  ?  Questions:
  ?   Limits on num collections/posts? File sizes?
  ?   Add a leftSideBar/drawer on the TrackPage for logged in users to easily swap between collections
  ? Additional Track Orientation?: https://ui.aceternity.com/components/parallax-scroll
  svgs: https://iconscout.com/icons/settings-icon?price=free
  tailwind gradients: https://tailscan.com/gradients
  Alternate colors for App Title gradient (red/rose): from-rose-500 via-red-600 to-rose-700
*/
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserProfile(null);
      }
    });
    
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserData(user.uid);
        setUserProfile(profile);
        console.log('User profile:', profile);
      } catch (error) {
        console.error('Unable to fetch user profile:', error.message);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root isLoggedIn={isLoggedIn}/>,
      errorElement: <ErrorPage />,
      children: [
        { //* Displays example collection for non-logged in users. Displays user's collections for logged in users.
          //? Drawer/LeftSideBar to swap between available collections.
          //?   > Viewing collections from bio page works for first iteration.
          path: "/posts", 
          element: <TrackPage isLoggedIn={isLoggedIn} loggedInUser={user} />,
        },
        { //* Displays a collection from DB.
          path: "/posts/:userId/:collectionId",
          element: <TrackPage isLoggedIn={isLoggedIn} loggedInUser={user} />,
        },
        { //* Landing page for non-logged in users. Displays UserDashboard for logged in users.
          path: "/home",
          element: isLoggedIn ? <UserDashboard loggedInUserId={user.uid} /> : <Home />,
        },
        { //* Displays 1) example profile for non-logged in users, or, 2) The user's public facing profile for logged in users.
          path: "/bio",
          element: <ProfileSection isLoggedIn={isLoggedIn} loggedInUser={user} exampleCollections={exampleCollections} />,
        },
        { //* Displays profile of a seperate user
          path: "/bio/:userId",
          element: <ProfileSection isLoggedIn={isLoggedIn} loggedInUser={user} exampleCollections={exampleCollections}/>,
        }
      ],
    },
    {
      path: "/login",
      element: <Login isLoggedIn={isLoggedIn} />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    }
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);