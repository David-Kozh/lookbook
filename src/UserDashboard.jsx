import React, { useState, useEffect } from 'react';
import { getUserCollections } from './services/collectionService';
import CollectionsMenu from './CollectionsMenu.jsx';
import CreateCollection from './CreateCollection.jsx';
import EditCollection from './EditCollection.jsx';
import EditCollectionSettings from './EditCollectionSettings.jsx';
import CreatePostPage from './CreatePostPage.jsx';
import EditPost from './EditPost.jsx';

//? BreadCrumb for navigation through menu? Collections > Edit MyCollection > Edit Post
//? Should CollectionSettings be in a dialog box?
//* User dashboard to manage collections and the posts within them
export default function UserDashboard({ loggedInUserId }) {
    const [userCollections, setUserCollections] = useState([]);
    const [dashTab, setDashTab] = useState('menu');     // Show CollectionsMenu by default. Then change state based on button in CollectionsMenu
    const [collectionIndexToEdit, setCollectionIndexToEdit] = useState(0);
    const [postIndexToEdit, setPostIndexToEdit] = useState(0);
    
    useEffect(() => {
        const fetchCollections = async () => {
          try {
            const collections = await getUserCollections(loggedInUserId);
            setUserCollections(collections);
          } catch (error) {
            console.error('Error fetching user collections:', error.message);
          }
        };
        if (loggedInUserId) {
          fetchCollections();
        }
    }, [loggedInUserId]);

    //* Create Collection Menu
    const showCreateCollection = () => { // Usage: Called from CollectionsMenu
        console.log("show create-collection - from dashboard");
        fadeOutComponent('collections-menu');
        setTimeout(() => {
            setDashTab('create-collection');
        }, 150);
    };
    const cancelCreateCollection = () => { // Usage: navigates back to CollectionsMenu
        console.log('cancel create-collection - from dashboard');
        fadeOutComponent('create-collection-menu');
        setTimeout(() => {
            setDashTab('menu');
        }, 150);
    }
    
    //* Edit Collection Menu
    const showEditCollection = (index) => { // Usage: Called from CollectionsMenu
        if (userCollections.length === 0) {
            console.log('No collections to edit');
            return;
        }
        console.log("show edit-collection - from dashboard");
        setCollectionIndexToEdit(index);
        fadeOutComponent('collections-menu');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    };
    const cancelEditCollection = () => {    // Usage: navigate back to CollectionsMenu
        console.log('cancel edit-collection - from dashboard');
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('menu');
        }, 150);
    }

    //* Collection Settings Page
    const showEditCollectionSettings = () => {  // Called from EditCollection
        console.log("show edit-collection-settings - from dashboard");
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('edit-collection-settings');
        }, 150);
    };
    const cancelEditCollectionSettings = () => { // Navigates back to EditCollection
        console.log('cancel edit-collection-settings - from dashboard');
        fadeOutComponent('edit-collection-settings');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    };

    //* Create Post Page
    const showCreatePost = () => {      // Create a new post while editing a collection
        console.log("create post from dashboard (by EditCollection");
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('create-post');
        }, 150);
    };
    const cancelCreatePost = () => {    // Close the create-post page and return to EditCollection
        console.log('cancel create-post - from dashboard');
        fadeOutComponent('create-post');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    }

    //* Edit Post Page
    const showEditPost = ( index ) => { // Passes the index of the post to EditPost from EditCollection
        console.log("edit from dashboard (by EditCollection)");
        setPostIndexToEdit(index);
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('edit-post');
        }, 150);
    };
    const cancelEditPost = () => {      // Close the edit-post page and return to EditCollection
        console.log('cancel edit-post - from dashboard');
        fadeOutComponent('edit-post');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    }
    
    //* Fade out animation
    const fadeOutComponent = (elementId) => {
        const el = document.getElementById(elementId);

        el.animate({
            opacity: [1, 0]
        }, {
            duration: 100,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    }
 
    return (
        <div className='w-full body-h flex justify-center'>
            <div id="dash-bg" className='w-[90%] sm:w-4/5 lg:w-3/4 2xl:w-2/3 h-5/6 flex flex-col bg-[#e8dada] rounded-lg shadow-lg px-6 py-4 mt-8 bg-opacity-75 space-y-1'>               
                    <div className='w-full h-min'>
                        <h1 className='text-3xl xl:text-4xl font-bold mb-1 select-none'>Dashboard</h1>
                        <div className="h-0.5 rounded-full bg-zinc-800 my-1"></div>
                    </div>

                    {dashTab === 'menu' && 
                        <CollectionsMenu loggedInUserId={loggedInUserId} showCreateCollection={showCreateCollection} showEditCollection={showEditCollection} />
                    }
                    {dashTab === 'create-collection' && 
                        <CreateCollection loggedInUserId={loggedInUserId} cancelCreate={cancelCreateCollection} />
                    }
                    {dashTab === 'edit-collection' && 
                        <EditCollection loggedInUserId={loggedInUserId} collection={userCollections[collectionIndexToEdit]} 
                            showCreatePost={showCreatePost} showEditPost={showEditPost} showSettings={showEditCollectionSettings}
                            cancelEdit={cancelEditCollection} 
                        />
                    }
                    {dashTab === 'edit-collection-settings' &&
                        <EditCollectionSettings loggedInUserId={loggedInUserId} collection={userCollections[collectionIndexToEdit]}
                            cancelEditSettings={cancelEditCollectionSettings} 
                        />
                    }
                    {dashTab === 'create-post' && //* Create a post while editing a collection
                        <CreatePostPage loggedInUserId={loggedInUserId} cancelCreate={cancelCreatePost} 
                            collectionId={userCollections[collectionIndexToEdit].id} 
                        />
                    }
                    {dashTab === 'edit-post' && 
                        <EditPost loggedInUserId={loggedInUserId}  collectionId={userCollections[collectionIndexToEdit].id} 
                            postIndex={postIndexToEdit} cancelEdit={cancelEditPost}
                        />
                    }
            </div>
        </div>
    );
}