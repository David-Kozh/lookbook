import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonGroup from './components/CollectionsButtons.jsx';
import { getUserCollections } from './services/collectionService';

//* The thumbnail displayed for each collection is the image of the first post in the collection
//* If the selected button is null, display default view of collections carousel
//* Displays corresponding view once a button is selected
//? 'Selected dashboard tab' context? -- needed in Dashboard, CollectionsMenu and CollectionsButtons
//? Should there be a defined thumbnail? Where else would it be used? On the users profile? 

export default function CollectionsMenu({ loggedInUserId, showCreateCollection, showEditCollection }) {
    const location = useLocation(); // URL location
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0); // Collection index to edit/delete
    const defaultCollection = {
        id: 'default',
        title: 'No Collections Yet!',
        postsArray: [
            {
                aspectRatio: '1:1'
            }
        ]
    };
    const [collections, setCollections] = useState([defaultCollection]); //collections[currentIndex].id 
    const defultThumbnail = {
        aspectRatio: '1:1'
    }
    const [thumbnails, setThumbnails] = useState([defultThumbnail]);
    
    //* Get the user's collections
    useEffect(() => {
        const fetchCollections = async () => {
          try {
            const userCollections = await getUserCollections(loggedInUserId);
            setCollections(userCollections);
          } catch (error) {
            console.error('Error fetching user collections:', error.message);
            setCollections([defaultCollection]);
          }
        };
        if (loggedInUserId) {
          fetchCollections();
        }
    }, [loggedInUserId]);

    useEffect(() => {
        //* Grabs the first post from each collection as a default thumbnail
        // TODO  !!! Update this to get the posts from firebase, not .postArray
        // TODO  Change to check for an available thumbnail in each collection before defaulting to the first post
        if (collections.length > 0) {
            setThumbnails(collections.map(collection => collection.postsArray[0]));
            console.log('thumbnails set');
        }
    }, [collections]);

    /* Button Group State */ //? why not referenced
    const [selectedButton, setSelectedButton] = useState(null); 

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName); //? why not referenced
        if(buttonName === 'create'){
            console.log("Create Button Clicked");
            showCreateCollection(); //* Show the CreateCollection form
        }
        else if(buttonName === 'edit'){
            console.log("Edit Button Clicked");
            showEditCollection(currentIndex); //* Show the EditCollection component
        }
        else if(buttonName === 'view'){
            console.log("View Button Clicked");
            //? Animate to the selected Collection using a callback function to dashboard instead of redirect
            //?     - Animate dash-bg opacity and pos to take it out of view
            //?     - Animate a TrackPage component into view
            //? Back Button? (to return to the same place in the dashboard?) Or BreadCrumbs?
            setTimeout(() => {
                navigate('/posts');
            }, 10);
        }
        else if(buttonName === 'delete'){
            console.log("Delete Button Clicked", currentIndex);
        }   
    };

    useEffect(() => {
      const url = window.location.href; // Get the current URL
      const index = parseInt(url.split('#slide')[1], 10);   // Extract the index from the URL
  
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
    // but the selectedIndex state does change when the page is refreshed (to default state) causing error
        window.location.hash = '#slide0';
        setCurrentIndex(0);
    }, []);

    return (
    <div id="collections-menu" className='w-full h-full flex flex-col gap-2'>
        <div className='mt-2 ml-2 text-2xl lg:text-3xl font-bold select-none text-zinc-900' style={{height: "5%"}}>Your Collections</div>

        <div id="collections" className='w-full mt-1 flex flex-col gap-8 sm:gap-2 items-center justify-evenly sm:justify-between' style={{height: "90%"}}>
            <div className='w-full flex flex-col gap-6 sm:gap-4 items-center'>
                <div className='text-2xl lg:text-3xl mt-2 font-mono font-bold underline underline-offset-4 text-zinc-900 select-none'>{collections[currentIndex].title}</div>

                <div className={`carousel my-2 shadow-lg shadow-black/40 ${thumbnails[currentIndex].aspectRatio === '1:1' ? 'carousel-img' : 'carousel-img-wide'}`} 
                    style={{transition: 'width 0.3s 0.01s'}}>
                    {console.log(currentIndex)}
                    {thumbnails.map((post, index) => {
                        return (
                            <div id={`slide${index}`} className="carousel-item relative" key={index}
                                style={{opacity: `${currentIndex == index ? '1' : '0'}`,
                                    transition: 'opacity 0.3s 0.01s'}}
                            >   
                                 
                                {post.image ? (
                                    <img className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                    drop-shadow-2xl shadow-inner shadow-black`}
                                    src={post.image} draggable="false" />
                                ) : (
                                    <div className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                    drop-shadow-2xl bg-gray-700 shadow-black`} draggable="false"/>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex h-full justify-center items-center mb-2" style={{height: "15%"}}>
                <ButtonGroup onButtonClick={handleButtonClick} selectedIndex={currentIndex} setSelectedIndex={setCurrentIndex} numSlides={thumbnails.length} 
                    selectedItemName={collections[currentIndex].title} itemType={'collection'} 
                    itemRef={{  
                        loggedInUserId: loggedInUserId, 
                        collectionId: collections[currentIndex].id,
                        postId: null
                    }}
                />
            </div>
        </div>
    </div>
    );
}