import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParallaxScroll } from "./components/ui/parallax-scroll.jsx";
import { LikedPostsFeed } from "./LikedPostsFeed.jsx";
import { getFollowing } from "./services/userService.js";
import { getRecentCollectionsFromFollowing } from "./services/collectionService.js";

//TODO "no more collections to load" message does not display when end of page reached. Move to inside parallax-scroll component?
export function FollowingFeed({ currentUserId }) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // Track the last document for pagination
  const [selectedFeed, setSelectedFeed] = useState("Following"); // Track selected feed
  const batchSize = 12; // Number of collections to fetch per batch
  const parallaxScrollRef = useRef(null); // Reference for the ParallaxScroll element
  const navigate = useNavigate();

  const handleImageClick = (userId, collectionId) => {
    navigate(`/posts/${userId}/${collectionId}`);
  };

  // Fetch the list of users the current user is following
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const followingList = await getFollowing(currentUserId);
        setFollowing(followingList);
      } catch (error) {
        console.error("Error fetching following list:", error.message);
      }
    };

    fetchFollowing();
  }, [currentUserId]);

  // Fetch recent collections from followed users
  const fetchCollections = async () => {
    if (loading || !hasMore || following.length === 0) return;
    setLoading(true);

    try {
      const { collections, lastDoc: newLastDoc } = await getRecentCollectionsFromFollowing(
        following,
        lastDoc,
        batchSize
      );

      if (collections.length > 0) {
        console.log("Fetched collections:", collections);
        setThumbnails((prevThumbnails) => [
          ...prevThumbnails,
          ...collections.map((collection) => ({
            thumbnailUrl: collection.thumbnail,
            createdAt: collection.createdAt,
            userId: collection.userId,
            collectionId: collection.id,
          })),
        ]);
        setLastDoc(newLastDoc); // Update the last document for pagination
      } else {
        setHasMore(false); // No more collections to fetch
      }
    } catch (error) {
      console.error("Error fetching collections:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetching collections when the 'following' array is updated
  useEffect(() => {
    if (following.length > 0) {
      fetchCollections();
    }
  }, [following]); // Runs whenever the 'following' array changes

  // Infinite scroll: Load more collections when the user scrolls near the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = parallaxScrollRef.current;
      if (
        scrollElement && hasMore && !loading &&
        scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 200
      ) {
        console.log(hasMore, !loading);
        fetchCollections();
      }
    };

    const scrollElement = parallaxScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading, fetchCollections]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="flex w-[92%] h-[5%] justify-between items-center bg-card rounded-xl">
        <p className="text-card-foreground font-mono ml-4 text-lg select-none">{selectedFeed == 'Following' ? 'Recent from Followed Users' : 'Liked Posts'}</p>
        <Select 
          defaultValue="Following"
          onValueChange={(value) => setSelectedFeed(value)} // Update selected feed
        >
          <SelectTrigger className="w-[24%] max-w-32 h-min bg-input text-card-foreground mr-2 sm:mr-4 font-mono text-xs md:text-sm">
            <SelectValue placeholder="Following"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem className='text-xs font-mono' value="Following">Following</SelectItem>
            <SelectItem className='text-xs font-mono' value="Liked Posts">Liked Posts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedFeed === "Following" ? (
        following.length === 0 && !loading ? (
          <div className="flex w-full h-[50%] items-center justify-center">
            <p className="w-[70%] text-xl font-bold font-mono text-center">Start following users to see their collections!</p>
          </div>
        ) : (
          <ParallaxScroll 
            ref={parallaxScrollRef}
            className='h-[80.5%] sm:h-[87%]' 
            images={thumbnails.map((thumb) => ({
              thumbnailUrl: thumb.thumbnailUrl,
              userId: thumb.userId,
              collectionId: thumb.collectionId,
            }))}
            onClick={handleImageClick}
          />
        )
      ):(
          <LikedPostsFeed currentUserId={currentUserId} /> // Render the LikedPostsFeed component
      )}

      {loading && 
        <div className="w-full h-min items-center justify-center">
          <p className="w-full text-xl font-bold font-mono text-center">Loading...</p>
        </div>
      }
      {false && !hasMore && following.length > 0 && 
        <div className="w-full h-min items-center justify-center">
          <p className="w-full text-xl font-bold font-mono text-center">No more collections to load.</p>
        </div>
      }
      
    </div>
  );
}