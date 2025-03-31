import * as React from 'react';
import { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import { SelectedImgContext } from './contexts/SelectedImageContext';

import posts from './data/posts.js';
import Navbar from './NavBar.jsx';
import BackButtonImage from './components/back.png'
import LogoutButton from './components/LogoutButton.jsx';
import BottomBar from './BottomBar.jsx';

// Top bar to be rendered in any page
// Consists of centered NavBar (1/2) and 2 spaces to the left and right of NavBar (1/4 each).
// Content is rendered below topBar, within the Outlet.
export default function Root({ isLoggedIn }) {
    const [selectedImage, setSelectedImage] = useState(null); // Index of the selected image, null if no image is selected
    const [closeSelectedImage, setCloseSelectedImage] = useState(() => () => {}); // Function from Track to close the selected image.

    return (
        <SelectedImgContext.Provider value={
            { selectedImage, setSelectedImage, closeSelectedImage, setCloseSelectedImage }
        }>
        <div className='w-full h-full'>
            <div id="topBar" className="nav-h">
                {/* 1/4 of topBar to the left of NavBar */}
                <div className="w-1/4 h-full flex flex-col items-start justify-center">

                    <Link 
                        reloadDocument to="/home" 
                        className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold font-sans ml-4 mb-1 select-none
                        bg-clip-text text-transparent opacity-100 hover:opacity-85 shadow-lg
                        bg-gradient-to-r from-[#481a12] via-[#2961bc] to-[#6855f7] 
                        dark:from-rose-500 dark:via-red-600 dark:to-rose-700"
                    >
                        LookBook
                        <div className="h-0.5 w-[102%] rounded bg-foreground dark:opacity-50"></div>
                    </Link>

                    <div className=''>
                        {/* Back button for displayed images (currently unused) */}
                        <button 
                            className={`${selectedImage != null ? 'hidden absolute' : 'hidden'} z-10 border border-gray-400 transition bg-gray-100/10 hover:bg-gray-100/50 mt-2 ml-5 sm:ml-6 py-1 sm:py-2 px-4 rounded shadow`}
                            onClick={() => {
                                closeSelectedImage(selectedImage);
                            }} 
                        >
                            <img src={BackButtonImage} alt="Back" className="w-4 h-4" />
                        </button> 
       
                    </div>    

                </div>
                        
                {/* Navbar is center 1/2 of topBar */}
                <div className="w-1/2">
                    <div className='hidden sm:flex justify-center'>    
                        <Navbar selectedImage={selectedImage} posts={posts} closeSelectedImage={closeSelectedImage}/>
                    </div>
                </div>
                
                
                {/* 1/4 of topBar; to the right of NavBar */}
                <div className='w-1/4 flex justify-end align-middle'>
                    {/* 
                        TODO:  Consider using this shadcn 'Dropdown Menu' component 
                        https://ui.shadcn.com/docs/components/dropdown-menu
                    */}
                { 
                    isLoggedIn && (
                        <LogoutButton />
                    )  
                }
                {   !isLoggedIn && (
                    <div className='flex mr-2 sm:mr-4 gap-2'>
                        <a onClick={() => {
                                const htmlElement = document.documentElement;
                                if (htmlElement.classList.contains('dark')) {
                                htmlElement.classList.remove('dark');
                                } else {
                                htmlElement.classList.add('dark');
                                }
                            }}
                            className="cursor-pointer bg-background px-2 py-2 sm:px-3 sm:py-3 lg:px-5 
                                text-background-foreground hover:bg-white/30 rounded-xl
                                transition duration-150 flex items-center justify-center"
                            >
                            {document.documentElement.classList.contains('dark') ? (
                                // Filled moon for dark mode
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                >
                                <path d="M12 2a9.93 9.93 0 0 0-7.07 2.93A10 10 0 1 0 12 2z" />
                                </svg>
                            ) : (
                                // Hollow moon for light mode
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                >
                                <path strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                                />
                                </svg>
                            )}
                        </a>
                        <a href="/login"
                            className="bg-secondary text-secondary-foreground inline-block rounded-lg p-2 
                            hover:text-foreground border border-secondary hover:border-foreground transition hover:bg-transparent
                            sm:hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="login" fill='currentColor' className="w-6 h-6 mr-0.5">
                            <g>
                                <path d="M14.47,13.47a.75.75,0,0,0,0,1.06.75.75,0,0,0,1.06,0l2-2a.78.78,0,0,0,.16-.24.73.73,0,0,0,0-.58.78.78,0,0,0-.16-.24l-2-2a.75.75,0,0,0-1.06,1.06l.72.72H3a.75.75,0,0,0,0,1.5H15.19Z"></path>
                                <path d="M20.08,2.25H9.92A1.72,1.72,0,0,0,8.25,4V7a.75.75,0,0,0,1.5,0V4c0-.15.09-.25.17-.25H20.08c.08,0,.17.1.17.25V20c0,.15-.09.25-.17.25H9.92c-.08,0-.17-.1-.17-.25V17a.75.75,0,0,0-1.5,0v3a1.72,1.72,0,0,0,1.67,1.75H20.08A1.72,1.72,0,0,0,21.75,20V4A1.72,1.72,0,0,0,20.08,2.25Z"></path>
                            </g>
                            </svg>
                        </a>
                    </div>
                    )
                }
                </div>
            </div>
            
            {/* All page content is rendered here, below the topbar */}
            <Outlet className='body-h w-full'/>

            {/* Bottom navbar to display on small screens */}
            <BottomBar />
        </div>
        </SelectedImgContext.Provider>
    );
}