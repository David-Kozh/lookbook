import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonGroup from './components/CollectionsButtons.jsx';
import { getUserCollectionThumbnails } from './services/userService';
import { getUserCollections } from './services/collectionService';

//* If the selected button is null, display default view of collections carousel
//* Displays corresponding view once a button is selected
//* ✅ Ready for testing with firebase db and storage
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
            const userThumbnails = await getUserCollectionThumbnails(loggedInUserId);
            console.log('Setting user collections:', userCollections);
            if (userCollections.length > 0) {
                setCollections(userCollections);
                setThumbnails(userThumbnails);
            }
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
        if (collections.length > 0) {
            const fetchThumbnails = async () => {
                try {
                    const thumbnails = await getUserCollectionThumbnails(loggedInUserId);
                    setThumbnails(thumbnails);
                } catch (error) {
                    console.error(error.message);
                    //TODO  More effective error handling?
                } finally {
                    //TODO More effective loading handling. Create a loading state/components?
                    // setLoading(false);
                }
            };
            
            if(collections.length === 1 && collections[0].id === 'default'){
                console.log('No collections to display');
            }
            else {
                fetchThumbnails();
                console.log('thumbnails set');
            }
        }
    }, [collections, loggedInUserId]);

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
            setTimeout(() => {
                navigate(`/posts/${loggedInUserId}/${collections[currentIndex].id}`);
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
    //* Set current index to 0 when the page loads.
    //  > Necessary since URL doesn't change when page is refreshed
    //  but selectedIndex state returns to default state causing error
        window.location.hash = '#slide0';
        setCurrentIndex(0);
    }, []);

    return (
    <div id="collections-menu" className='w-full h-full flex flex-col gap-2'>
        <div className='w-full mt-2 ml-1 text-2xl xl:text-4xl font-bold select-none' style={{height: "5%"}}>Your Collections</div>
        <div className="h-0.5 rounded-full bg-card-foreground dark:opacity-50"></div>

        <div id="collections" className='w-full mt-1 flex flex-col gap-8 sm:gap-2 items-center justify-evenly sm:justify-between' style={{height: "90%"}}>
            <div className='w-full flex flex-col gap-6 sm:gap-4 items-center'>
                <div className='text-2xl lg:text-3xl mt-2 font-mono font-bold underline underline-offset-4 select-none'>{collections[currentIndex].title}</div>

                <div className={`carousel my-2 shadow-lg shadow-black/40 ${thumbnails[currentIndex].aspectRatio === '1:1' ? 'carousel-img' : 'carousel-img-wide'}`} 
                    style={{transition: 'width 0.3s 0.01s'}}>
                    {console.log(currentIndex)}
                    {thumbnails.map((thumbnail, index) => {
                        return (
                            <div id={`slide${index}`} className="carousel-item relative" key={index}
                                style={{opacity: `${currentIndex == index ? '1' : '0'}`,
                                    transition: 'opacity 0.3s 0.01s'}}
                            >   
                                 
                                {thumbnail.thumbnailUrl ? (
                                    <img className={`${(thumbnail.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                    drop-shadow-2xl shadow-inner shadow-black`}
                                    src={thumbnail.thumbnailUrl} draggable="false" />
                                ) : (
                                    <div className={`${(thumbnail.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
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
                        postId: false
                    }}
                />
            </div>
        </div>
    </div>
    );
}