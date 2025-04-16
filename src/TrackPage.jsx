import * as React from "react";
import { useState, useEffect } from 'react';
import ImageTrack from "./Track.jsx";
import posts from './data/posts.js';
import { useParams } from 'react-router-dom';
import { getPosts } from "./services/postService";
import { getCollection, getUserCollections } from "./services/collectionService";
import { addLike, getUserLikes, hasLiked, removeLike } from "./services/likeService";
import { getUserIdFromHandle, fetchUserData } from "./services/userService.js";

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
  const { handle, encodedCollectionName } = useParams(); //! Need to get collectionId from encoded collection title in url

  const [userToView, setUserToView] = useState(null);
  // The collection of posts to display
  const [collection, setCollection] = useState([]);
  // Information about the collection (Title, description, etc.)
  const [collectionInfo, setCollectionInfo] = useState({});
  const [mode, setMode] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLike = async (postId) => { //* Function to be called by like button in image info
    if (!loggedInUser?.id) {
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
      const userId = await getUserIdFromHandle(handle);

      if (await hasLiked(loggedInUser.id, userId, collectionInfo.id, postId)) {
        await removeLike(loggedInUser.id, userId, collectionInfo.id, postId);
      } else {
        await addLike(loggedInUser.id, userId, collectionId, postId);
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
      console.log('handle:', handle, 'encodedCollectionName:', encodedCollectionName);
      if (handle) {
        try {
          const userId = await getUserIdFromHandle(handle);
          let userCollectionInfo = '';
          let idToUse = '';
          if(!encodedCollectionName){ // Use the first collection if no collectionId is provided
            const userCollections = await getUserCollections(userId);
            userCollectionInfo = userCollections[0];
            idToUse = userCollectionInfo.id;
          } else {
            // Decode the collection title from the URL
            const decodedTitle = decodeCollectionTitle(encodedCollectionName);

            // Fetch all collections for the user and find the one matching the decoded title
            const userCollections = await getUserCollections(userId);
            const matchingCollection = userCollections.find(
              (collection) => collection.title.toLowerCase() === decodedTitle.toLowerCase()
            );

            if (!matchingCollection) {
              setErrorMessage('Collection not found');
              setIsLoading(false);
              return;
            }

            userCollectionInfo = matchingCollection;
            idToUse = matchingCollection.id;
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
          const collections = await getUserCollections(loggedInUser.id);
          if (collections.length > 0) {
            // Get the first collection by default
            const userCollection = await getPosts(loggedInUser.id, collections[1].id);
            const userCollectionInfo = await getCollection(loggedInUser.id, collections[1].id);
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
  }, [isLoggedIn, handle, encodedCollectionName]);

  useEffect(() => { // Check if the user is logged in and if the user has liked any of the posts in the collection
    const updateLikedStatus = async () => {
      if (mode === 'view' && isLoggedIn && loggedInUser) {
        console.log('Checking if user has liked any posts in the collection');
        try {
          const userLikes = await getUserLikes(loggedInUser.id);
          if (userLikes) {
            const userId = await getUserIdFromHandle(handle);
            const updatedCollection = collection.map(post => {
              // Check if the post is liked by matching postId, postOwnerId, and collectionId
              const isLiked = userLikes.some(
                like =>
                  like.postId === post.id &&
                  like.postOwnerId === userId &&
                  like.collectionId === collectionInfo.id
              );
              return { ...post, isLiked }; // Add the isLiked property to the post
            });
            setCollection(updatedCollection);
          }
        } catch (error) {
          console.error('Error fetching user likes:', error);
        }
      }
    };
  
    updateLikedStatus();
  }, [mode, isLoggedIn, loggedInUser]);

  //* Store the user's original theme and apply the collection's theme
  //* Apply the original theme again on unmount
  useEffect(() => { 
    
    const htmlElement = document.documentElement;   // Get the current theme class on the <html> element
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