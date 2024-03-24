import * as React from "react";
import ImageTrack from "./Track.jsx";
import posts from './data/posts.js';

function TrackPage() {

  return (
    <>
      <ImageTrack posts={posts}/>
    </>
    
  )
}
export default TrackPage;