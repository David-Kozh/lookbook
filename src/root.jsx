import * as React from 'react';
import { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import { SelectedImgContext } from './contexts/SelectedImageContext';

import posts from './data/posts.js';
import Navbar from './NavBar.jsx';
import BackButtonImage from './components/back.png'
import BottomBar from './BottomBar.jsx';


export default function Root() {
    const [selectedImage, setSelectedImage] = useState(null); // Index of the selected image, null if no image is selected
    const [closeSelectedImage, setCloseSelectedImage] = useState(() => () => {}); // Function from Track to close the selected image.
    const [isLoggedIn, setIsLogged] = useState(false); // User's login status

    // Top bar to be rendered in any page
    // Consists of NavBar (3/5) and 2 spaces to the left and right of NavBar (1/5 each).
    // Content is rendered below topBar, within the Outlet.
    return (
        <SelectedImgContext.Provider value={
            { selectedImage, setSelectedImage, closeSelectedImage, setCloseSelectedImage }
        }>
        <div className='w-full h-full'>
            <div id="topBar" className="nav-h">
                {/* 1/5 of topBar to the left of NavBar */}
                <div className="w-1/4 h-full flex flex-col items-start justify-center">

                    <Link 
                        reloadDocument to="/home" 
                        className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold font-sans ml-4 mb-1 select-none"
                    >
                        LookBook
                        <div className="h-0.5 2xl:h-1 w-[105%] rounded-lg bg-gray-800"></div>
                    </Link>

                    <div className=''>
 
                        <button 
                            className={`${selectedImage != null ? 'absolute' : 'hidden'} border border-gray-400 transition bg-gray-100/10 hover:bg-gray-100/50 mt-2 ml-5 sm:ml-6 py-1 sm:py-2 px-4 rounded shadow`}
                            onClick={() => {
                                closeSelectedImage(selectedImage);
                            }} 
                        >
                            <img src={BackButtonImage} alt="Back" className="w-4 h-4" />
                        </button> 
       
                    </div>    

                </div>
                        
                {/* Navbar is center 3/5 of topBar 

                
                */}
                <div className="w-1/2">
                    <div className='hidden sm:flex justify-center'>    
                        <Navbar selectedImage={selectedImage} posts={posts} closeSelectedImage={closeSelectedImage}/>
                    </div>
                </div>
                
                
                {/* 1/5 of topBar to the right of NavBar */}
                <div className='w-1/4 flex justify-end align-middle'>
                    {/* 
                        TODO:  Turn this avatar into a shadcn 'Dropdown Menu' component 
                        https://ui.shadcn.com/docs/components/dropdown-menu
                    */}
                {
                    isLoggedIn && ( 
                    <div className="avatar">
                        <div className="w-16 rounded-full mx-4">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                    )  
                }
                {   !isLoggedIn && (
                    <div className='flex mr-2 sm:mr-4 sm:gap-2'>
                    <a
                        href="#"
                        className="inline-block rounded-l-lg sm:rounded-lg bg-[#7b76d2] px-2 py-2 md:px-3 sm:py-3 lg:px-5 
                        text-xs sm:text-sm font-medium text-white text-center hover:bg-[#9E9BDE] 
                        sm:hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] transition duration-200 "
                    >
                        Sign Up
                    </a>
                    <button
                        className="inline-block rounded-r-lg sm:rounded-lg bg-slate-800/90 px-2 py-2 md:px-3 sm:py-3 lg:px-5 
                        text-xs sm:text-sm font-medium text-center text-white hover:text-slate-800
                        border border-slate-800/80 transition hover:bg-transparent
                        sm:hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] duration-200">
                        Log In
                    </button>

                    </div>
                    )
                }
                </div>
            </div>
            
            {/* Content is rendered here below the topbar */}
            <Outlet className='body-h'/>

            {/* WIP: Bottom navbar to display on small screens */}
            <BottomBar />
        </div>
        </SelectedImgContext.Provider>
    );
}