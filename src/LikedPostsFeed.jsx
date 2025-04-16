import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ParallaxScroll } from "./components/ui/parallax-scroll.jsx";
import { getHandleFromUserId } from "./services/userService.js";
import { getLikedPosts } from "./services/likeService.js";
import { getCollection, encodeCollectionTitle } from "./services/collectionService.js";

export function LikedPostsFeed({ currentUserId }) {
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState(null); // Track the last document for pagination
    const batchSize = 12; // Number of collections to fetch per batch
    const parallaxScrollRef = useRef(null); // Reference for the ParallaxScroll element
    const navigate = useNavigate();

    const handleImageClick = async (userId, collectionId) => {
        try {
            const handle = await getHandleFromUserId(userId);
            // get collection name from collectionId
            const collection = await getCollection(userId, collectionId);
            const encodedCollectionName = encodeCollectionTitle(collection.title);
            navigate(`/${handle}/${encodedCollectionName}`);
        } catch (error) {
            console.error("Error navigating to post:", error.message);
        }
    };

    // Fetch the list of users the current user is following
    useEffect(() => {
        if(currentUserId) {
            fetchLikedPosts();
        }
    }, [currentUserId]);

    // Fetch recent collections from followed users
    const fetchLikedPosts = async () => {
        if (loading || !hasMore || currentUserId == null) return;
        setLoading(true);

        try {
            const { likedPosts, lastDoc: newLastDoc } = await getLikedPosts(
                currentUserId,
                lastDoc,
                batchSize
            );

        if (likedPosts.length > 0) {
            console.log("Fetched liked posts:", likedPosts);
            setThumbnails((prevThumbnails) => [
                ...prevThumbnails,
                ...likedPosts.map((post) => ({
                    thumbnailUrl: post.image,
                    createdAt: post.createdAt,  //? Should liked posts be ordered by createdAt of post or by timestamp of like?
                    userId: post.userId, //! Old posts do not have userId or collectionId. Needed to navigate to posts
                    collectionId: post.collectionId,
                })),
            ]);
            setLastDoc(newLastDoc); // Update the last document for pagination
        } else {
            setHasMore(false); // No more liked posts to fetch
        }
        } catch (error) {
            console.error("Error fetching liked posts:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Infinite scroll: Load more collections when the user scrolls near the bottom
    useEffect(() => {
        const handleScroll = () => {
        const scrollElement = parallaxScrollRef.current;
        if (
            scrollElement && hasMore && !loading &&
            scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 200
        ) {
            console.log(hasMore, !loading);
            fetchLikedPosts();
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
    }, [hasMore, loading, fetchLikedPosts]);

    return (
        <div className="h-[80.5%] sm:h-[87%] w-full flex flex-col">
        {thumbnails.length > 0 ? (
            <ParallaxScroll
                ref={parallaxScrollRef}
                className='w-full h-full'
                images={thumbnails.map((thumb) => ({
                    thumbnailUrl: thumb.thumbnailUrl,
                    userId: thumb.userId,
                    collectionId: thumb.collectionId,
                }))}
                onClick={handleImageClick}
            />
        ) : (
            <div className="flex w-full h-[50%] items-center justify-center">
                <p className="w-[70%] text-xl font-bold font-mono text-center">Like some posts!</p>
            </div>
        )}
        </div>
        
    );
}