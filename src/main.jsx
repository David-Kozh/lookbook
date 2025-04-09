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
import { FollowingFeed } from './FollowingFeed';
import { ParallaxScrollDemo } from './FeedDemo.jsx';
/*
  * Firebase Tasks:
    ✅  User Authentication
    ✅  Database for users, collections, posts, likes
    ✅  Cloud Storage for images and videos
  * Current Tasks:
    TODO  Link images in FollowingFeed to their respective collections
  * Functionalies to implement:
    Similar parallax scroll component for liked posts (within feed)
    Make dark mode a user profile variable, and keep it persistent
    Add "carousel" as a content type (daisyUI) like other post.content

  ?  Questions:
  ?   Remove "Posts" from navbars in favor navigating from bio/feed?
  ?   Can 1:1 images with short description be displayed better than current row display? --> Wasted whitespace (same for 16:9 in mobile view) 
  ?   Limits on num collections/posts? File sizes?
  ?   Add a leftSideBar/drawer on the TrackPage for logged in users to easily swap between collections?
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
        { //* Displays example collection for non-logged in users. Displays user's collections for logged in users.
          //? Drawer/LeftSideBar to swap between available collections.
          //?   > Viewing collections from bio page works for first iteration.
          path: "/posts", 
          element: <TrackPage isLoggedIn={isLoggedIn} loggedInUser={user} />,
        },
        { //* Displays a collection from DB.
          path: "/posts/:userId",
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
        },
        { //* Displays user's feed of collections from users they follow
          path: "/feed",
          element: isLoggedIn ? <FollowingFeed currentUserId={user.uid}/> : <ParallaxScrollDemo/>, //TODO replace Demo with Feed from Jane Doe's following (need to populate some more example collections)
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