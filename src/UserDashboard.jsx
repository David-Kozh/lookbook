import React, { useState } from 'react';
import CollectionsMenu from './CollectionsMenu.jsx';
import CreateCollection from './CreateCollection.jsx';
import EditCollection from './EditCollection.jsx';
import EditCollectionSettings from './EditCollectionSettings.jsx';
import CreatePost from './CreatePostPage.jsx';
import EditPost from './EditPost.jsx';

import userCollectionsData from './data/userCollections.js';    // Initial state of userCollections

// ? BreadCrumb for navigation through menu? Collections > Edit MyCollection > Edit Post
// ? Should CollectionSettings be in a dialog box?

// TODO: "No Collections" message & handling when userCollections is empty in CollectionsMenu
// TODO: "No Posts" message & handling when postsArray is empty in EditCollection

export default function UserDashboard() {
    const [userCollections, setUserCollections] = useState(userCollectionsData);

    const [dashTab, setDashTab] = useState('menu');     // Show CollectionsMenu by default. Then change state based on button in CollectionsMenu
    const [collectionIndexToEdit, setCollectionIndexToEdit] = useState(0);
    const [postIndexToEdit, setPostIndexToEdit] = useState(0);

    // Create Collection Menu
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

    // Edit Collection Menu
    const showEditCollection = (index) => { // Usage: Called from CollectionsMenu
        console.log("show edit-collection - from dashboard");
        setCollectionIndexToEdit(index);
        fadeOutComponent('collections-menu');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    };
    const cancelEditCollection = () => { // Usage: navigate back to CollectionsMenu
        console.log('cancel edit-collection - from dashboard');
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('menu');
        }, 150);
    }

    // Collection Settings Page
    const showEditCollectionSettings = () => { // Usage: Called from EditCollection
        console.log("show edit-collection-settings - from dashboard");
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('edit-collection-settings');
        }, 150);
    };
    const cancelEditCollectionSettings = () => { // Usage: navigates back to EditCollection
        console.log('cancel edit-collection-settings - from dashboard');
        fadeOutComponent('edit-collection-settings');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    };

    // Create Post Page
    const showCreatePost = () => {
        console.log("create post from dashboard (by EditCollection");
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('create-post');
        }, 150);
    };
    const cancelCreatePost = () => {
        console.log('cancel create-post - from dashboard');
        fadeOutComponent('create-post');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    }

    // Edit Post Page
    const showEditPost = ( index ) => {
        console.log("edit from dashboard (by EditCollection)");
        setPostIndexToEdit(index);
        fadeOutComponent('edit-collection-menu');
        setTimeout(() => {
            setDashTab('edit-post');
        }, 150);
    };
    const cancelEditPost = () => {
        console.log('cancel edit-post - from dashboard');
        fadeOutComponent('edit-post');
        setTimeout(() => {
            setDashTab('edit-collection');
        }, 150);
    }
    
    // Fade out animation
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

    //* Back End Function Calls
    //*     Collections Functions
    const addCollection = (newCollection) => { // Usage: Called from CreateCollection
        setUserCollections(prevCollections => [...prevCollections, newCollection]);
    };
    const updateCollection = (updatedCollection) => { // Usage: Called from EditCollectionSettings
        setUserCollections(prevCollections => 
            prevCollections.map((collection, index) => 
                index === collectionIndexToEdit ? updatedCollection : collection
            )
        );
    };
    const deleteCollection = (indexToDelete) => { // Usage: Called from delete button in CollectionsMenu
        setUserCollections(prevCollections => 
          prevCollections.filter((collection, index) => index !== indexToDelete)
        );
    };

    //*     Posts Functions
    const addPost = (newPost) => { // Usage: Called from CreatePost
        setUserCollections(prevCollections => 
        prevCollections.map((collection, index) => 
            index === collectionIndexToEdit 
            ? { ...collection, postsArray: [...collection.postsArray, newPost] } 
            : collection
        )
        );
    };
    const updatePost = (updatedPost) => { // Usage: Called from EditPost
        setUserCollections(prevCollections => 
            prevCollections.map((collection, index) => 
                index === collectionIndexToEdit 
                ?   { 
                    ...collection, 
                    postsArray: collection.postsArray.map((post, postIndex) => 
                        postIndex === postIndexToEdit ? updatedPost : post) 
                    } 
                : collection
            )
        );
    };
    const deletePost = (postIndexToDelete) => { // Usage: Called from delete button in EditCollection -> ButtonGroup -> DeleteAlert
        setUserCollections(prevCollections => 
            prevCollections.map((collection, index) => 
                index === collectionIndexToEdit 
                ?   { 
                    ...collection, 
                    postsArray: collection.postsArray.filter((post, postIndex) => postIndex !== postIndexToDelete) 
                    } 
                : collection
            )
        );
    };

    return (
        <div className='w-full body-h flex justify-center'>
            
            <div id="dash-bg" className='w-[90%] sm:w-4/5 lg:w-3/4 2xl:w-2/3 h-5/6 flex flex-col bg-slate-200 rounded-lg shadow-lg px-6 py-4 mt-8 bg-opacity-75 space-y-1'>
                                   
                    <div className='w-full h-min'>
                        <h1 className='text-3xl xl:text-4xl font-bold mb-1 select-none'>Dashboard</h1>
                        <div className="h-0.5 rounded-full bg-zinc-800 my-1"></div>
                    </div>

                    {dashTab === 'menu' && 
                        <CollectionsMenu userCollections={userCollections} showCreateCollection={showCreateCollection} showEditCollection={showEditCollection} deleteCollection={deleteCollection}/>
                    }

                    {dashTab === 'create-collection' && 
                        <CreateCollection cancelCreate={cancelCreateCollection} addCollection={addCollection}/>
                    }

                    {dashTab === 'edit-collection' && 
                        <EditCollection collection={userCollections[collectionIndexToEdit]} 
                            showCreatePost={showCreatePost} showEditPost={showEditPost} showSettings={showEditCollectionSettings}
                            deletePost={deletePost} 
                            cancelEdit={cancelEditCollection} 
                        />
                    }

                    {dashTab === 'edit-collection-settings' &&
                        <EditCollectionSettings collection={userCollections[collectionIndexToEdit]}
                            cancelEditSettings={cancelEditCollectionSettings} updateCollection={updateCollection} 
                        />
                    }

                    {dashTab === 'create-post' && 
                        <CreatePost cancelCreate={cancelCreatePost} addPost={addPost}/>
                    }

                    {dashTab === 'edit-post' && 
                        <EditPost cancelEdit={cancelEditPost} post={userCollections[collectionIndexToEdit].postsArray[postIndexToEdit]} updatePost={updatePost}/>
                    }

            </div>
            
        </div>

        
    );
}