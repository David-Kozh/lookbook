import * as React from "react";
import { useState, useEffect } from 'react';
import ImageTrack from "./Track.jsx";
import posts from './data/posts.js';
import { useParams } from 'react-router-dom';
import { getPosts } from "./services/postService";
import { getCollection, getUserCollections } from "./services/collectionService";
import { addLike, getUserLikes, hasLiked, removeLike } from "./services/likeService";
import { fetchUserData } from "./services/userService.js";

//* Component that fetches posts and manages their states for the ImageTrack component
//TODO  Implement collectionInfo in Track.jsx
/*
  TODOs for <ImageTrack/>:
  - Split down into some sub-components for readability
  - Handle posts with no description (display title as a caption)
    - Then use that structure to implement a way to hide the description (if present)
    allowing for the image to be displayed in a larger space.
*/
function TrackPage({ isLoggedIn, loggedInUser}) {
  const { userId, collectionId } = useParams();
  const [userToView, setUserToView] = useState(null);
  // The collection of posts to display
  const [collection, setCollection] = useState([]);
  // Information about the collection (Title, description, etc.)
  const [collectionInfo, setCollectionInfo] = useState({});
  const [mode, setMode] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLike = async (postId) => { //* Function to be called by like button in image info
    if (!loggedInUser?.uid) {
      console.error("No logged-in user found.");
      return;
    }
    try {
      // Optimistically update the local state
      setCollection((prevCollection) =>
        prevCollection.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked }
            : post
        )
      );
  
      // Perform the server-side update
      if (await hasLiked(loggedInUser.uid, postId)) {
        await removeLike(loggedInUser.uid, postId);
      } else {
        await addLike(loggedInUser.uid, postId);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
  
      // Revert the optimistic update in case of an error
      setCollection((prevCollection) =>
        prevCollection.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked }
            : post
        )
      );
    }
  };

  //* Fetch the collection of posts
  useEffect(() => { 
    const fetchCollection = async () => {
      if (userId) {
        try {
          let userCollectionInfo = '';
          let idToUse = collectionId;
          if(!collectionId){ // Use the first collection if no collectionId is provided
            const userCollections = await getUserCollections(userId);
            userCollectionInfo = userCollections[0];
            idToUse = userCollectionInfo.id;
          } else {
            userCollectionInfo = await getCollection(userId, collectionId);
          }
          const userCollection = await getPosts(userId, idToUse);
          
          setUserToView(await fetchUserData(userId));
          setCollection(userCollection);
          setCollectionInfo(userCollectionInfo);
          console.log('User Collection found in params');

          if(userCollection.length > 0){
            setIsLoading(false);
            setMode('view');
          } else {
            setErrorMessage('No posts found');
            setIsLoading(false);
          }        

        } catch (error) {
          console.error(error);
        }

      } else if (isLoggedIn && loggedInUser) {
        console.log('NO URL PARAMS FOUND');
        try {
          const collections = await getUserCollections(loggedInUser.uid);
          if (collections.length > 0) {
            // Get the first collection by default
            const userCollection = await getPosts(loggedInUser.uid, collections[1].id);
            const userCollectionInfo = await getCollection(loggedInUser.uid, collections[1].id);
            setUserToView(loggedInUser);
            setCollection(userCollection);
            setCollectionInfo(userCollectionInfo);
            
            if(userCollection.length > 0){
              setIsLoading(false);
              setErrorMessage(false);
              setMode('view');
            } else {
              setErrorMessage('No posts found');
              setIsLoading(false);
            }
          } else {
            setErrorMessage('No collection found!');
            setIsLoading(false);
          }

        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Displaying Example Collection');
        setCollection(posts); // Set Collection info?
        setUserToView('example'); // Set user to example user
        setMode('example');
        setIsLoading(false);
      }
    }

    fetchCollection();
  }, [isLoggedIn, userId, collectionId]);

  useEffect(() => { // Check if the user is logged in and if the user has liked any of the posts in the collection
    const updateLikedStatus = async () => {
      if (mode === 'view' && isLoggedIn && loggedInUser) {
        console.log('Checking if user has liked any posts in the collection');
        try {
          const userLikes = await getUserLikes(loggedInUser.uid);
          if (userLikes) {
            const updatedCollection = collection.map(post => ({
              ...post,
              isLiked: userLikes.includes(post.id),
            }));
            setCollection(updatedCollection);
          }
        } catch (error) {
          console.error('Error fetching user likes:', error);
        }
      }
    };
  
    updateLikedStatus();
  }, [mode, isLoggedIn, loggedInUser]);

  useEffect(() => {
    // Get the current theme class on the <html> element
    const htmlElement = document.documentElement;
    const originalTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
  
    if(errorMessage === false) {  // Apply the collection's theme only if no error was detetcted during fetching
      const collectionTheme = collectionInfo?.displaySettings?.theme;
      if (collectionTheme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
  
    // Cleanup: Restore the user's original theme on unmount
    return () => {
      if (originalTheme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    };
  }, [collectionInfo?.displaySettings?.theme]);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-[60%] flex items-center justify-center text-mono text-2xl italic"> 
          Loading... 
        </div>

      ) : (errorMessage ? (
          <div className="w-full h-[60%] flex items-center justify-center text-mono text-2xl font-semibold text-[#5c1111]"> 
            {errorMessage} 
          </div>

        ) : (
          <ImageTrack isLoggedIn={isLoggedIn} posts={collection} collectionInfo={collectionInfo} handleLike={handleLike} userToView={userToView}/>
        ))
      }
    </div>
  )
}
export default TrackPage;