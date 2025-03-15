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
  * Edit-Collection/Post Components:
    TODO  Gray out the "Save Changes" button if no changes have been made
    TODO  Gray out unchanged fields using Form API (touched fields)
  * Firebase: 
    //✅ User Authentication
    //✅ Database for user collections and posts
    TODO  Replace example data with Firestore function calls
    TODO  Cloud Storage for images and videos
  * Functionalies to implement:
    TODO  Add "carousel" as a content type (daisyUI) just like mp4
    TODO  Add "like/save" functionality to posts
    TODO  Profile Picture Functionality/User Settings (Change name, password, etc.)
  * Priority Tasks:
    TODO  Check that the post/collection object keys in form components match the firebase service files
    TODO  Add a check to delete button for collections, so that the default/placeholder collection cannot be deleted
    TODO  add a check for 'theme' of collection. If dark, use something like bg-[#546578db]
    TODO  Bugtest resizing of expanded posts when window is resized
    TODO  Handle overflow on image descriptions
  * Lower-priority:
    TODO  Apply resize() to mp4 content in track (check resize() in general)
    TODO  Review necessity of selectedImageContext
    TODO  In handleResize() -> Animate the image info so image info updates with image resize
  ?  Questions:
  ?   How should the user's own profile be displayed? 
  ?     In theory:
  ?       'Posts' tab are shared by link
  ?       Clicking 'Bio' tab from 'Posts' tab should display the collection owner's profile.
  ?       Clicking 'Home' will displays the user's dashboard. --> Button to then navigate to profile?
  ?       'Home' (dashboard) --> 'Bio' = your own profile?
  ?   Animation from track to profile section
  ?   Add a leftSideBar/drawer on the TrackPage for logged in users to easily swap between collections
  ?   Should expanded images and their descriptions be displayed in a single card? 
  ?   Images with no description? Should shorter descriptions be displayed as a caption
  ?       - Would need to modify available space to maximize image size 
  ?   Should 1:1 images/description be row/col orientated
  ? Additional Track Orientation?: https://ui.aceternity.com/components/parallax-scroll

  svgs: https://iconscout.com/icons/settings-icon?price=free
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
        console.error('Error fetching user profile:', error.message);
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root isLoggedIn={isLoggedIn}/>,
      errorElement: <ErrorPage />,
      children: [
        { //* Displays example collections for non-logged in users. Displays user's collections for logged in users.
          //? For logged in users, how to decide which collection to show? Drawer/LeftSideBar to swap between available collections?
          path: "/posts", 
          element: <TrackPage />,
        },
        { //* Displays a collection from DB.
          //? Drawer/LeftSideBar seems less necessary here. Focus is on collections as individually packaged units.
          path: "/posts/:userId/:collectionId", //TODO: Add collectionId to params in TrackPage
          element: <TrackPage />,
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
      element: <Login />,
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