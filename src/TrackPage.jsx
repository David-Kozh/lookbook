import * as React from "react";
import { useState, useEffect } from 'react';
import ImageTrack from "./Track.jsx";
import posts from './data/posts.js';
import { useParams } from 'react-router-dom';
import { getPosts } from "./services/postService";
import { getCollection, getUserCollections } from "./services/collectionService";

//* Component that fetches posts and pases them to the ImageTrack component
//TODO  Implement collectionInfo in TrackPage
/*
  TODOs for <ImageTrack/>:
  - Split down into some sub-components for readability
  - Handle posts with no description (display title as a caption)
    - Then use that structure to implement a way to hide the description (if present)
    allowing for the image to be displayed in a larger space.
    
*/
function TrackPage({ isLoggedIn, loggedInUser}) {
  const { userId, collectionId } = useParams();
  // The collection of posts to display
  const [collection, setCollection] = useState([]);
  // Information about the collection (Title, description, etc.)
  const [collectionInfo, setCollectionInfo] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      if (userId && collectionId) {
        try {
          const userCollection = await getPosts(userId, collectionId);
          const userCollectionInfo = await getCollection(userId, collectionId);
          setCollection(userCollection);
          setCollectionInfo(userCollectionInfo);
          console.log('User Collection found in params');

          if(userCollection.length > 0){
            setIsLoading(false);
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
            setCollection(userCollection);
            setCollectionInfo(userCollectionInfo);
            
            if(userCollection.length > 0){
              setIsLoading(false);
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
        setCollection(posts);
        setIsLoading(false);
      }
    }

    fetchCollection();
  }, [isLoggedIn, userId, collectionId]);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-[60%] flex items-center justify-center text-mono text-2xl italic"> 
          Loading... 
        </div>

      ) : (errorMessage ? (
          <div className="w-full h-[60%] flex items-center justify-center text-mono text-2xl font-semibold text-[#5c1111]"> 
            {errorMessage} 
          </div>

        ) : (
          <ImageTrack posts={collection} collectionInfo={collectionInfo} />
        ))
      }
    </>
  )
}
export default TrackPage;