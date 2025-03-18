import * as React from "react";
import { useState, useEffect } from 'react';
import ImageTrack from "./Track.jsx";
import posts from './data/posts.js';
import { useParams } from 'react-router-dom';
import { getPosts } from "./services/postService";
import { getCollection } from "./services/collectionService";

function TrackPage({ isLoggedIn, loggedInUser}) {
  const { userId, collectionId } = useParams();
  // The collection of posts to display
  const [collection, setCollection] = useState([]);
  // Information about the collection (Title, description, etc.)
  const [collectionInfo, setCollectionInfo] = useState({});

  useEffect(() => {
    const fetchCollection = async () => {
      if (userId && collectionId) {
        try {
          const userCollection = await getPosts(userId, collectionId);
          const userCollectionInfo = await getCollection(userId, collectionId);
          setCollection(userCollection);
          setCollectionInfo(userCollectionInfo);
        } catch (error) {
          console.error(error);
        }
      } else if (isLoggedIn && loggedInUser) {
        try {
          const userCollection = await getPosts(userId, );
          const userCollectionInfo = await getCollection(userId, collectionId);
          setCollection(userCollection);
          setCollectionInfo(userCollectionInfo);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Displaying Example Collection');
        setCollection(posts);
      }
    }

    fetchCollection();
  }, [isLoggedIn, userId, collectionId]);

  return (
    <>
      <ImageTrack posts={collection} collectionInfo={collectionInfo} />
    </>
  )
}
export default TrackPage;