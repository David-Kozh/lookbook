import React from 'react'
import { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter,  RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';
import { fetchUserData } from './services/userService';
import Root from './root.jsx';
import TrackPage from './TrackPage.jsx';
import UserDashboard from './UserDashboard';
import Home from './Home.jsx';
import ProfileSection from './ProfileSection.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import exampleCollections from './data/userCollections.js';
import Login from './login.jsx';
import SignUp from './signup.jsx';
import './App.css';
import { FollowingFeed } from './FollowingFeed';
import { ParallaxScrollDemo } from './FeedDemo.jsx';
/*
  * Firebase Tasks:
    ✅  User Authentication
    ✅  Database for users, collections, posts, likes
      * Max-limits for number of collections & posts is enforced in CollectionButtons.jsx as well as service files
    ✅  Cloud Storage for images, audio & videos
    ✅  User Feed
    -   Hosting
  * Current Tasks:
    !BUG: Close selected image button (under app title) does not disapear on nav away from /posts
    Push to production
  * Functionalies to implement in Production:
    Tooltips for 'additional content' field
    Adjust expanded-image-dimensions to include padding for wide-image-panels. 
    --> If no description, force 1:1 to col view and adjust dimensions of image and info panels to roughly 70/30 split
    Add feedback to user for disabled buttons
  ?  Questions:
  ?   Make dark mode a user profile variable, or is it persistent enough with local storage?
  ?   Force col display for 1:1 images with short descriptions? --> Wasted whitespace (same for 16:9 in mobile view)
  svgs: https://iconscout.com/icons/settings-icon?price=free
  tailwind gradients: https://tailscan.com/gradients
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
        setUser(false);
        setUserProfile(false);
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
        { //* Landing page for non-logged in users. Displays UserDashboard for logged in users.
          index: true,
          element: isLoggedIn ? <UserDashboard loggedInUserId={user.uid} loggedInUser={userProfile} /> : <Home />,
        },
        { //* Displays 1) example profile for non-logged in users, or, 2) The user's public facing profile for logged in users.
          path: "/bio",
          element: <ProfileSection isLoggedIn={isLoggedIn} loggedInUser={userProfile} exampleCollections={exampleCollections} />,
        },
        { //* Displays profile of a seperate user
          //TODO change to lookbook.com/userHandle
          path: "/bio/:handle",
          element: <ProfileSection isLoggedIn={isLoggedIn} loggedInUser={userProfile} exampleCollections={exampleCollections}/>,
        },
        { //* Displays user's feed of collections from users they follow
          path: "/feed",
          element: isLoggedIn ? <FollowingFeed currentUserId={user.uid}/> : <ParallaxScrollDemo/>, //TODO Populate demo with example collections
        },
        { //* Displays example collection for non-logged in users.
          path: "/example", 
          element: <TrackPage isLoggedIn={isLoggedIn} loggedInUser={userProfile} />,
        },
        { //* Displays a collection from DB.
          //TODO change to lookbook.com/userHandle/collectionName
          path: "/:handle/:collectionId",
          element: <TrackPage isLoggedIn={isLoggedIn} loggedInUser={userProfile} />,
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