import { useState, useEffect } from "react";
import { ParallaxScroll } from "./components/ui/parallax-scroll.jsx";
import { getFollowing } from "./services/userService.js";
import { getRecentCollectionsFromFollowing } from "./services/collectionService.js";

export function FollowingFeed({ currentUserId }) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // Track the last document for pagination
  const batchSize = 12; // Number of collections to fetch per batch

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
        setThumbnails((prevThumbnails) => [
          ...prevThumbnails,
          ...collections.map((collection) => ({
            thumbnailUrl: collection.thumbnail,
            createdAt: collection.createdAt,
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

  // Infinite scroll: Load more collections when the user scrolls near the bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        fetchCollections();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, fetchCollections]);

  return (
    <div className="w-full h-full flex">

      {following.length === 0 && !loading ? (
        <div className="flex w-full h-[50%] items-center justify-center">
          <p className="w-[70%] text-xl font-bold font-mono text-center">Start following users to see their collections!</p>
        </div>
      ) : (
        <ParallaxScroll images={thumbnails.map((thumb) => thumb.thumbnailUrl)} />
      )}
      {loading && <p>Loading more...</p>}
      {!hasMore && <p>No more collections to load.</p>}
      
    </div>
  );
}