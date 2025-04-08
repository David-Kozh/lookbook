import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import ButtonGroup from './components/CollectionsButtons.jsx';
import { getPosts } from './services/postService.js';

//  If the selected button is null, display default view of posts carousel
//  Once a button is selected, display the corresponding element from below:
//      - CreatePostPage (form)
//      - EditPostPage (form)
//      - ViewPost: animates to the selected post in the image track
//      - DeletePost (modal)

export default function EditCollection({ loggedInUserId, collection, showCreatePost, showEditPost, cancelEdit, showSettings }) {
    const location = useLocation(); // URL location
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const defaultPost = {
        id: 'default',  //* Unique id for default objects
        title: 'No Collections Yet!',
        aspectRatio: '1:1',
    };
    const [posts, setPosts] = useState([defaultPost]);
    
    //* Get posts for loggedInUserId, collection.id. If no posts exist, posts == [defaultPost]
    useEffect(() => {
        const fetchCollections = async () => {
            try {
            const collectionPosts = await getPosts(loggedInUserId, collection.id);
            setPosts(collectionPosts);
            } catch (error) {
            console.error('Error fetching user collections:', error.message);
            }
        };
        if (loggedInUserId && (collection.id !== 'default')) {
            fetchCollections();
        }
    }, [loggedInUserId, collection]);

    /* Button Group State */
    const [selectedButton, setSelectedButton] = useState(null); //? why not referenced & in CollectionsMenu
    
    //* Change view based on the button clicked
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName); //? why not referenced
        if(buttonName === 'create'){
            console.log("Create Button Clicked");
            // TODO: Animate in the CreatePost form/modal (undecided)
            showCreatePost();
        }
        else if(buttonName === 'edit'){
            console.log("Edit Button Clicked");
            // TODO: Animate in the EditPost form/modal (undecided)
            //! Can pass actual post so that getPosts doesnt have to be called again in the EditPost component (reducing total requested num bytes from firestore)
            showEditPost(currentIndex); // pass current index
        }
        else if(buttonName === 'view'){
            console.log("View Button Clicked");
            // TODO: Animate to the selected post in the image track
            // ? Back Button? (to return to the same place in the dashboard?) Or BreadCrumbs?
            setTimeout(() => {
                navigate(`/posts/${loggedInUserId}/${collection.id}`);
            }, 10);
        }
        else if(buttonName === 'delete'){
            console.log("Delete Button Clicked");
            // TODO: Pass name of selected post to CollectionsButtons to display in confirmation modal
        }
    };

    useEffect(() => {
        const url = window.location.href;   // Get the current URL
        const index = parseInt(url.split('#slide')[1], 10); // Extract the index from the URL
    
        // Update the current index
        if(isNaN(index)){
          window.location.hash = '#slide0';
          setCurrentIndex(0);
          console.log("Index is NaN");
        }
        else{
          setCurrentIndex(index);
        }
        console.log("selected carousel item changed to:", index);
    }, [location]);
  
    useEffect(() => { 
    // Set the current index to 0 when the page loads
    // This is necessary because the URL does not change when the page is refreshed
    // but the selectedIndex state does change when the page is refreshed (to default state) causing error (displays )
        window.location.hash = '#slide0';
        setCurrentIndex(0);
    }, []);

    return (
    <div id="edit-collection-menu" className='w-full h-full flex flex-col gap-2'>
        <div className="flex mt-2 ml-1 justify-between" style={{height: "5%"}}>
            <div className='text-2xl md:text-3xl font-bold select-none' >
                {collection.title}
            </div>

            <div className='flex gap-2'>
                <Button onClick={cancelEdit}>❮</Button>
                <Button className='px-3 md:flex md:gap-1' onClick={() => showSettings(collection)}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" id="settings" className='w-4 h-4'>
                            <g data-name="10. Settings">
                                <path fill="white" d="M22.217,13.28a.523.523,0,0,1-.248-.509c.02-.253.031-.511.031-.771s-.011-.518-.031-.773a.521.521,0,0,1,.248-.507,2.515,2.515,0,0,0,.92-3.431L21.647,4.71A2.517,2.517,0,0,0,18.211,3.8a.494.494,0,0,1-.535-.021,10.008,10.008,0,0,0-1.391-.8A.5.5,0,0,1,16,2.512,2.515,2.515,0,0,0,13.488,0H10.512A2.517,2.517,0,0,0,8,2.521a.5.5,0,0,1-.284.452,9.961,9.961,0,0,0-1.392.8.5.5,0,0,1-.541.018,2.513,2.513,0,0,0-3.431.919L.863,7.289a2.515,2.515,0,0,0,.92,3.431.523.523,0,0,1,.248.509C2.011,11.482,2,11.74,2,12s.011.518.031.773a.521.521,0,0,1-.248.507,2.515,2.515,0,0,0-.92,3.431l1.49,2.579a2.516,2.516,0,0,0,3.436.915.492.492,0,0,1,.535.021,10.008,10.008,0,0,0,1.391.8A.5.5,0,0,1,8,21.488,2.515,2.515,0,0,0,10.512,24h2.976A2.517,2.517,0,0,0,16,21.479a.5.5,0,0,1,.284-.452,9.961,9.961,0,0,0,1.392-.8.5.5,0,0,1,.541-.018,2.516,2.516,0,0,0,3.431-.919l1.489-2.578A2.515,2.515,0,0,0,22.217,13.28ZM20,12c0,.205-.009.408-.025.608a2.54,2.54,0,0,0,1.242,2.4.512.512,0,0,1,.187.7l-1.487,2.578a.516.516,0,0,1-.706.183,2.517,2.517,0,0,0-2.67.107,8.029,8.029,0,0,1-1.113.641A2.515,2.515,0,0,0,14,21.488a.512.512,0,0,1-.512.512H10.512A.514.514,0,0,1,10,21.479,2.51,2.51,0,0,0,8.571,19.22a8.077,8.077,0,0,1-1.112-.641,2.516,2.516,0,0,0-2.676-.1.513.513,0,0,1-.7-.187L2.6,15.712a.513.513,0,0,1,.187-.7,2.54,2.54,0,0,0,1.242-2.4C4.009,12.408,4,12.205,4,12s.009-.408.025-.608a2.54,2.54,0,0,0-1.242-2.4.512.512,0,0,1-.187-.7L4.083,5.711a.513.513,0,0,1,.706-.183,2.515,2.515,0,0,0,2.67-.107A8.029,8.029,0,0,1,8.572,4.78,2.515,2.515,0,0,0,10,2.512.512.512,0,0,1,10.512,2h2.976A.514.514,0,0,1,14,2.521,2.51,2.51,0,0,0,15.429,4.78a8.077,8.077,0,0,1,1.112.641,2.518,2.518,0,0,0,2.676.1.513.513,0,0,1,.7.187L21.4,8.288a.513.513,0,0,1-.187.7,2.54,2.54,0,0,0-1.242,2.4C19.991,11.592,20,11.8,20,12Z"></path>
                                <path fill="white" d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"></path>
                            </g>
                    </svg>
                    <div className='hidden text-xs md:inline'>Settings</div>
                </Button>
            </div>
        </div>
        <div className="h-0.5 rounded-full bg-card-foreground dark:opacity-50 my-1"></div>
        
        <div id="edit-collection" className='w-full mt-1 flex flex-col gap-8 sm:gap-2 items-center justify-evenly sm:justify-between' style={{height: "90%"}}>
            <div className='w-full flex flex-col gap-6 sm:gap-4 items-center'>
                <div className='text-2xl lg:text-3xl mt-2 font-mono font-bold underline underline-offset-4 select-none'>'{posts[currentIndex].title}'</div>

                <div className={`carousel my-2 shadow-lg shadow-black/40 ${posts[currentIndex].aspectRatio === '1:1' ? 'carousel-img' : 'carousel-img-wide'}`} 
                    style={{transition: 'width 0.3s 0.01s'}}>
                    
                    {posts.map((post, index) => {
                        const paddingTop = (1 / post.aspectRatio) * 100; //?
                        return (
                            <div id={`slide${index}`} className="carousel-item relative" key={index}
                                style={{opacity: `${currentIndex == index ? '1' : '0'}`,
                                    transition: 'opacity 0.3s 0.01s'}}
                            >    
                                {post.image ? (
                                    <img className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                            drop-shadow-2xl shadow-inner shadow-black object-cover`}
                                        src={post.image} draggable="false" />
                                )   :   (
                                    <div className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                            drop-shadow-2xl shadow-inner shadow-black object-cover`}
                                        draggable="false" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex h-full justify-center items-center mb-2" style={{height: "15%"}}>
                <ButtonGroup onButtonClick={handleButtonClick} selectedIndex={currentIndex} setSelectedIndex={setCurrentIndex} numSlides={posts.length} 
                    selectedItemName={posts[currentIndex].title} itemType={'post'} 
                    itemRef={{
                        loggedInUserId: loggedInUserId, 
                        collectionId: collection.id,
                        postId: posts[currentIndex].id
                    }}
                />
            </div>
        </div>
    </div>
    )
}