import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ParallaxScroll } from "./components/ui/parallax-scroll.jsx";
import { getLikedPosts } from "./services/likeService.js";

export function LikedPostsFeed({ currentUserId }) {
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState(null); // Track the last document for pagination
    const batchSize = 12; // Number of collections to fetch per batch
    const parallaxScrollRef = useRef(null); // Reference for the ParallaxScroll element
    const navigate = useNavigate();

    const handleImageClick = (userId, collectionId) => {
        navigate(`/posts/${userId}/${collectionId}`);
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
                    collectionId: post.collection.id,
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
        <ParallaxScroll
            ref={parallaxScrollRef}
            className='h-[81.5%] sm:h-[87.5%]'
            images={thumbnails.map((thumb) => ({
                thumbnailUrl: thumb.thumbnailUrl,
                userId: thumb.userId,
                collectionId: thumb.collectionId,
            }))}
            onClick={handleImageClick}
        />
    );
}