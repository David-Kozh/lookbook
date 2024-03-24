import React from 'react'
import { useState } from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './root.jsx'
import TrackPage from './TrackPage.jsx'
import Home from './Home.jsx'
import ProfileSection from './ProfileSection.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import userCollections from './data/userCollections.js';
import './App.css'
import Login from './login.jsx';
import SignUp from './signup.jsx';

/*
  * Edit-Collection Component:
    TODO: Gray out the "Save Changes" button if no changes have been made
    TODO: Gray out unchanged fields using Form API (touched fields)
  * Backend: 
    TODO: Sign-in/Sign-up functionality
    ? Firebase ?
    * User Authentication
    * Cloud Storage for images and videos
    * Database for user collections and posts
    * 

  * Priority:
    TODO: URL structure and Breadcrumbs navigation for Dashboard > Your Collections > Collection > Post 
    *       - (just back button on mobile)
    TODO: What if you resize in/out of a vertical/horizontal orientation while an image is selected in the Image Track?
    TODO: In handleResize() -> Animate the image info so image info updates with image resize
    TODO: Handle overflow on image info
    TODO: Review necessity of selectedImageContext
    
    * Lower-priority:
    TODO: Add bottom nav bar for small screens (from daisyUi)
    TODO: Apply resize() to mp4 content in track
    TODO: Add "carousel" as a content type (daisyUI) just like mp4
    TODO: Add "like/save" functionality to posts
    TODO: Profile Picture Functionality/User Settings (Change name, password, etc.)
    TODO: Integrate example profile into Home-tab (for non-logged in users)
    TODO: Animation from track to profile section.
  
  * App Structure Considerations:
  *     Alternative Track Orientation?: https://ui.aceternity.com/components/parallax-scroll
  *  
  * Collection Data Structure:
  *   - Collection Name
  *   - Optional Subtitle
  *   - Optional Thumbnail (Does not display on track)
  *   - postsArray
  *     - Post1, Post2, Post3, etc.
  *   - Display Settings
  *     - Setting1: Value1, Setting2: Value2, etc.

  ?  Questions:
  ?   How should users unique handles be displayed? Is a TrackPage anonymous if it is without a Bio page?
  ?   Add a leftSideBar on the TrackPage for logged in users to easily swap between collections? (Or a different navigation component?)
  ?   Should expanded images and their descriptions be displayed in a single card?  
  ?   Images with no description? 
  ?       - Would need to modify available space to maximize image size 
  ?   Should description be displayed as a caption if it is short enough and/or the screen is big enough?
  ?   Should 1:1 images row/col orientation depend on if aspect ratio >, or < 1:1? [probably]

  svgs: https://iconscout.com/icons/settings-icon?price=free
*/
function App() {
  const [isLoggedIn, setIsLogged] = useState(true);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/posts",
          element: <TrackPage />,
        },
        {
          path: "/home",
          element: <Home isLoggedIn={isLoggedIn}/>,
          // Landing page for non-logged in users. Displays UserDashboard for logged in users. 
        },
        {
          path: "/bio",
          element: <ProfileSection userCollections={userCollections}/>,
          // Displays profile of currently open collection. (not application user)
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
