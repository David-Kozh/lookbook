import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getUserCollections } from './services/collectionService';
import { fetchUserData, getUserCollectionThumbnails } from './services/userService';
import exampleThumbnails from './data/exampleThumbnails';
import EditUserSettings from './EditUserSettings'; // Import the new component
// Data required:
//  - User image, name, bio, and links
//  - User's collections
//  - Currently open collection id (so it can be skipped in the MoreCollections section. Possibly for More Info header as well)
// ? Should additional info section be associated with the collection?
//? Display Profile and More Collections section in 2 columns on larger screens

export default function ProfileSection({ isLoggedIn, loggedInUser, exampleCollections }) {
    const location = useLocation(); // URL location
    const navigate = useNavigate();
    const { userId } = useParams();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [collections, setCollections] = useState(exampleCollections);
    const [thumbnails, setThumbnails] = useState(exampleThumbnails);
    const [userProfile, setUserProfile] = useState(null);
    const [mode, setMode] = useState('example');
    const [editSettings, setEditSettings] = useState(false); // State to toggle edit settings

    const defaultCollection = {
        title: 'No Collections Yet!',
        postsArray: [
            {
                aspectRatio: '1:1'
            }
        ]
    };

    //* Function to view a collection from profile
    const viewCollection = (index) => {
        console.log('Viewing collection:', collections[index].title);
        setTimeout(() => {
            navigate(`/posts/${loggedInUser.uid}/${collections[index].id}`);
        }, 10);
    }

    useEffect(() => {   //* Get the current URL, extract the index and update
        const url = window.location.href; 
        const index = parseInt(url.split('#slide')[1], 10); 
        if(isNaN(index)){
          window.location.hash = '#slide0';
          setCurrentSlide(0);
          console.log("Index is NaN");
        }
        else{
          setCurrentSlide(index);
        }
        console.log("selected carousel item changed to:", index);
    }, [location]);

    useEffect(() => { 
    /*  
        Sets the current index to 0 when the page loads
        This is necessary because the URL does not change when the page is refreshed
        but the selectedSlide state does change when the page is refreshed (to default state) causing error (displays )
    */
        window.location.hash = '#slide0';
        setCurrentSlide(0);
    }, []);

    //* Get either the own user's collections, seperate user's collections, or example collections
    //* For the collections retrieved, get the thumbnails (or first post if no thumbnail is available)
    //* Set the mode to 'self', 'user', or 'example' respectively
    useEffect(() => {
        const fetchCollections = async () => {
          if (userId) { //* A userId is present in the URL
            const profile = await fetchUserData(userId);
            setUserProfile(profile);
            setMode('user');
            try {
                const userCollections = await getUserCollections(userId);
                const userThumbnails = await getUserCollectionThumbnails(userId);
                if(userCollections.length > 0) {
                    setCollections(userCollections);
                    setThumbnails(userThumbnails);
                } else {
                    setCollections([defaultCollection]);
                    setThumbnails([{thumbnailUrl: '', aspectRatio: '1:1'}]);
                }
            } catch (error) {
                console.error('Error fetching user collections:', error);
                setCollections([defaultCollection]);
            }

          } else if (isLoggedIn && loggedInUser) { //* The user is logged in, and there is no userId in the URL
            const profile = await fetchUserData(loggedInUser.uid);
            setUserProfile(profile);
            setMode('self');
            try {
                const userCollections = await getUserCollections(loggedInUser.uid);
                const userThumbnails = await getUserCollectionThumbnails(loggedInUser.uid);
                if(userCollections.length > 0){
                    setCollections(userCollections);
                    setThumbnails(userThumbnails);
                } else {
                    setCollections([defaultCollection]);
                    setThumbnails([{thumbnailUrl: '', aspectRatio: '1:1'}]);
                }
            } catch (error) {
                console.error('Error fetching user collections:', error);
                setCollections([defaultCollection]);
            }

          } else {  //* The user is not logged in, and there is no userId in the URL
            setCollections(exampleCollections);
            console.log('Displaying Example Collections');
          }
        };

        fetchCollections();
    }, [isLoggedIn, loggedInUser, userId]);


    return(
        <div className="w-full body-h flex justify-center">
            <div id="contact-bg" className='w-[90%] sm:w-4/5 lg:w-3/4 2xl:w-2/3 h-5/6 flex flex-col bg-[#e8dada] 
            rounded-lg shadow-lg px-6 py-4 mt-8 bg-opacity-75 items-center'>
            
                <div className="w-full h-min">
                    <div className='w-full h-min flex items-center justify-between'>
                        <h1 className='text-3xl xl:text-4xl font-bold'>User Bio</h1>
                        {isLoggedIn && (<Button className=' px-3 md:flex md:gap-1' onClick={() => setEditSettings(true)}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" id="settings" className='w-4 h-4'>
                                    <g data-name="10. Settings">
                                        <path fill="white" d="M22.217,13.28a.523.523,0,0,1-.248-.509c.02-.253.031-.511.031-.771s-.011-.518-.031-.773a.521.521,0,0,1,.248-.507,2.515,2.515,0,0,0,.92-3.431L21.647,4.71A2.517,2.517,0,0,0,18.211,3.8a.494.494,0,0,1-.535-.021,10.008,10.008,0,0,0-1.391-.8A.5.5,0,0,1,16,2.512,2.515,2.515,0,0,0,13.488,0H10.512A2.517,2.517,0,0,0,8,2.521a.5.5,0,0,1-.284.452,9.961,9.961,0,0,0-1.392.8.5.5,0,0,1-.541.018,2.513,2.513,0,0,0-3.431.919L.863,7.289a2.515,2.515,0,0,0,.92,3.431.523.523,0,0,1,.248.509C2.011,11.482,2,11.74,2,12s.011.518.031.773a.521.521,0,0,1-.248.507,2.515,2.515,0,0,0-.92,3.431l1.49,2.579a2.516,2.516,0,0,0,3.436.915.492.492,0,0,1,.535.021,10.008,10.008,0,0,0,1.391.8A.5.5,0,0,1,8,21.488,2.515,2.515,0,0,0,10.512,24h2.976A2.517,2.517,0,0,0,16,21.479a.5.5,0,0,1,.284-.452,9.961,9.961,0,0,0,1.392-.8.5.5,0,0,1,.541-.018,2.516,2.516,0,0,0,3.431-.919l1.489-2.578A2.515,2.515,0,0,0,22.217,13.28ZM20,12c0,.205-.009.408-.025.608a2.54,2.54,0,0,0,1.242,2.4.512.512,0,0,1,.187.7l-1.487,2.578a.516.516,0,0,1-.706.183,2.517,2.517,0,0,0-2.67.107,8.029,8.029,0,0,1-1.113.641A2.515,2.515,0,0,0,14,21.488a.512.512,0,0,1-.512.512H10.512A.514.514,0,0,1,10,21.479,2.51,2.51,0,0,0,8.571,19.22a8.077,8.077,0,0,1-1.112-.641,2.516,2.516,0,0,0-2.676-.1.513.513,0,0,1-.7-.187L2.6,15.712a.513.513,0,0,1,.187-.7,2.54,2.54,0,0,0,1.242-2.4C4.009,12.408,4,12.205,4,12s.009-.408.025-.608a2.54,2.54,0,0,0-1.242-2.4.512.512,0,0,1-.187-.7L4.083,5.711a.513.513,0,0,1,.706-.183,2.515,2.515,0,0,0,2.67-.107A8.029,8.029,0,0,1,8.572,4.78,2.515,2.515,0,0,0,10,2.512.512.512,0,0,1,10.512,2h2.976A.514.514,0,0,1,14,2.521,2.51,2.51,0,0,0,15.429,4.78a8.077,8.077,0,0,1,1.112.641,2.518,2.518,0,0,0,2.676.1.513.513,0,0,1,.7.187L21.4,8.288a.513.513,0,0,1-.187.7,2.54,2.54,0,0,0-1.242,2.4C19.991,11.592,20,11.8,20,12Z"></path>
                                        <path fill="white" d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"></path>
                                    </g>
                            </svg>
                            <div className='hidden text-xs md:inline'>Settings</div>
                        </Button>)}
                    </div>
                    <div className="h-0.5 rounded-lg bg-zinc-700 my-1"></div>
                </div>

                {editSettings ? (
                    <EditUserSettings 
                        loggedInUserId={loggedInUser.uid} 
                        userProfile={userProfile} 
                        cancelEditSettings={() => setEditSettings(false)} 
                    />
                ) : (
                    <>
                        {/* Profile */}
                        <div id="contact-profile" className="w-full h-full lg:w-4/5 2xl:w-3/4 flex flex-col gap-4 items-center mt-2 px-0">
                    
                            {/* Username section for mobile only */}
                            <div className="flex flex-col w-full sm:hidden">
                                <div className='w-full h-min flex items-center justify-between'>
                                    <h3 className="text-2xl/tight xl:text-3xl/tight 2xl:text-4xl/tight 
                                    font-bold text-gray-900">{(mode != 'example') ? userProfile.displayName : 'Jane Doe'}</h3>
                                    {/* Links for MOBILE */}
                                    <div id="contact-links" className="w-[42%] flex justify-around gap-3">
                                        {/* 
                                            Media links and SVGs: 
                                                - Should there be a section for users other collections?
                                        */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" aria-label="LinkedIn" viewBox="0 0 512 512" id="linkedin">
                                            <rect width="512" height="512" fill="#0077b5" rx="15%"></rect>
                                            <circle cx="142" cy="138" r="37"></circle>
                                            <path stroke="#fff" strokeWidth="66" d="M244 194v198M142 194v198"></path>
                                            <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32"></path>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 102 102" id="instagram">
                                            <defs>
                                                <radialGradient id="a" cx="6.601" cy="99.766" r="129.502" gradientUnits="userSpaceOnUse">
                                                <stop offset=".09" stopColor="#fa8f21"></stop>
                                                <stop offset=".78" stopColor="#d82d7e"></stop>
                                                </radialGradient>
                                                <radialGradient id="b" cx="70.652" cy="96.49" r="113.963" gradientUnits="userSpaceOnUse">
                                                <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0"></stop>
                                                <stop offset="1" stopColor="#8c3aaa"></stop>
                                                </radialGradient>
                                            </defs>
                                            <path fill="url(#a)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                            <path fill="url(#b)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                            <path fill="#fff" d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229" transform="translate(-422.637 -426.196)"></path>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="28" viewBox="0 0 448 313.6" id="youtube">
                                            <g transform="translate(-32 -99.2)">
                                                <g strokeWidth="2.404" transform="translate(314.594 428.651)scale(.41603)">
                                                <path fill="#fff" d="M -248.52492,-576.52087 32.650165,-414.99475 -248.52492,-253.4686 Z"></path>
                                                <path fill="#fe0000" d="m 373.64966,-675.23131 c -11.96482,-44.86836 -47.85953,-80.76301 -92.7279,-95.7192 -83.75426,-20.93853 -421.76258,-20.93853 -421.76258,-20.93853 0,0 -338.00826,0 -421.76265,20.93853 -44.8683,14.95619 -80.76302,50.85084 -92.7279,95.7192 -23.92983,83.75432 -23.92983,260.23656 -23.92983,260.23656 0,0 0,173.49097 23.92983,260.2365 11.96488,44.86836 47.8596,80.763051 92.7279,92.727916 83.75439,23.929827 421.76265,23.929827 421.76265,23.929827 0,0 338.00832,0 421.76258,-23.929827 44.86837,-11.964865 80.76308,-47.859556 92.7279,-92.727916 23.92984,-86.74553 23.92984,-260.2365 23.92984,-260.2365 0,0 0,-176.48224 -23.92984,-260.23656 z m -622.17457,421.76266 c 0,-323.05221 0,-323.05221 0,-323.05221 281.175075,161.52611 281.175075,161.52611 281.175075,161.52611 z"></path>
                                                </g>
                                            </g>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 512 512" id="twitter">
                                            <g clipPath="url(#clip0_84_15697)">
                                                <rect width="512" height="512" fill="#000" rx="60"></rect>
                                                <path fill="#fff" d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"></path>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_84_15697">
                                                <rect width="512" height="512" fill="#fff"></rect>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="text-xl/none xl:text-2xl/none 2xl:text-3xl/none 
                                    font-medium text-gray-800 mb-2">{(mode != 'example') ? '@' + userProfile.handle : '@user-handle'} 
                                </h4>
                            </div>

                            {/* Main Section: Flex Row */}
                            <div className="w-full flex items-stretch justify-center gap-4 xl:gap-8">
                                {/* Avatar */}
                                <div className="avatar">
                                    <div className="w-28 rounded">
                                        {(mode != 'example') ? (<img src={userProfile.photoURL} />) :
                                        (<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />)}
                                    </div>
                                </div>
                                
                                {/* User's Name and Bio */}
                                <div className="w-2/3 flex flex-col justify-between">
                                    <div className="hidden sm:flex sm:flex-col">
                                        <div className='flex justify-between items-center'>
                                            <h3 className="text-2xl/tight xl:text-3xl/tight 2xl:text-4xl/tight 
                                            font-bold text-gray-900">{(mode != 'example') ? userProfile.displayName : 'Jane Doe'}</h3>
                                            {/* Links */}
                                            <div id="contact-links" className="w-1/2 flex justify-around gap-4">
                                                {/* 
                                                    Media links and SVGs: 
                                                        - Should there be a section for users other collections?
                                                */}
                                                
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" aria-label="LinkedIn" viewBox="0 0 512 512" id="linkedin">
                                                    <rect width="512" height="512" fill="#0077b5" rx="15%"></rect>
                                                    <circle cx="142" cy="138" r="37"></circle>
                                                    <path stroke="#fff" strokeWidth="66" d="M244 194v198M142 194v198"></path>
                                                    <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32"></path>
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 102 102" id="instagram">
                                                    <defs>
                                                        <radialGradient id="a" cx="6.601" cy="99.766" r="129.502" gradientUnits="userSpaceOnUse">
                                                        <stop offset=".09" stopColor="#fa8f21"></stop>
                                                        <stop offset=".78" stopColor="#d82d7e"></stop>
                                                        </radialGradient>
                                                        <radialGradient id="b" cx="70.652" cy="96.49" r="113.963" gradientUnits="userSpaceOnUse">
                                                        <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0"></stop>
                                                        <stop offset="1" stopColor="#8c3aaa"></stop>
                                                        </radialGradient>
                                                    </defs>
                                                    <path fill="url(#a)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                                    <path fill="url(#b)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                                    <path fill="#fff" d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229" transform="translate(-422.637 -426.196)"></path>
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="34" viewBox="0 0 448 313.6" id="youtube">
                                                    <g transform="translate(-32 -99.2)">
                                                        <g strokeWidth="2.404" transform="translate(314.594 428.651)scale(.41603)">
                                                        <path fill="#fff" d="M -248.52492,-576.52087 32.650165,-414.99475 -248.52492,-253.4686 Z"></path>
                                                        <path fill="#fe0000" d="m 373.64966,-675.23131 c -11.96482,-44.86836 -47.85953,-80.76301 -92.7279,-95.7192 -83.75426,-20.93853 -421.76258,-20.93853 -421.76258,-20.93853 0,0 -338.00826,0 -421.76265,20.93853 -44.8683,14.95619 -80.76302,50.85084 -92.7279,95.7192 -23.92983,83.75432 -23.92983,260.23656 -23.92983,260.23656 0,0 0,173.49097 23.92983,260.2365 11.96488,44.86836 47.8596,80.763051 92.7279,92.727916 83.75439,23.929827 421.76265,23.929827 421.76265,23.929827 0,0 338.00832,0 421.76258,-23.929827 44.86837,-11.964865 80.76308,-47.859556 92.7279,-92.727916 23.92984,-86.74553 23.92984,-260.2365 23.92984,-260.2365 0,0 0,-176.48224 -23.92984,-260.23656 z m -622.17457,421.76266 c 0,-323.05221 0,-323.05221 0,-323.05221 281.175075,161.52611 281.175075,161.52611 281.175075,161.52611 z"></path>
                                                        </g>
                                                    </g>
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 512 512" id="twitter">
                                                    <g clipPath="url(#clip0_84_15697)">
                                                        <rect width="512" height="512" fill="#000" rx="60"></rect>
                                                        <path fill="#fff" d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"></path>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_84_15697">
                                                        <rect width="512" height="512" fill="#fff"></rect>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                
                                            </div>
                                        </div>

                                        <h4 className="text-xl/none xl:text-2xl/none 2xl:text-3xl/none 
                                        font-medium text-gray-800 mb-2">{(mode != 'example') ? '@' + userProfile.handle : '@user-handle'}</h4>
                                    </div>

                                    <p className="lg:text-lg xl:text-xl text-gray-700 text-justify mb-1">
                                        {
                                            (mode != 'example') ? userProfile.bio : 
                                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distinctio nesciunt quas non animi."
                                        }
                                    </p>
                                
                                </div>
                            </div>

                            {/* Additional information */}
                            <div className="w-full lg:w-5/6 2xl:w-4/5 flex justify-center px-6 md:px-8 lg:px-0">
                                <div className="lg:text-lg xl:text-xl text-gray-700 text-justify">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distincti nesciunt quas non animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distinctio nesciunt quas non animi. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </div>
                            </div>
                        </div>
                    
                <div id="more-collections" className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="w-full text-xl xl:text-2xl font-bold">{(mode != 'example') ? userProfile.displayName+'\'s Collections' : 'Jane\'s Collections'}</h1>
                    <div className="min-h-0.5 w-full rounded-lg bg-zinc-700 my-1"></div>

                    <div className='w-full flex flex-col items-center'>
                        {/* Collection Name + ViewPosts button */}
                        <div className='flex w-full gap-2 items-center justify-between'>
                            <div className='w-[12%] sm:w-1/5'/> {/* Spacer for centering */}       
                            
                            <div className='mt-2 text-lg lg:text-2xl font-mono font-bold underline underline-offset-4 text-zinc-900 select-none'>{collections[currentSlide].title}</div>
                            
                            <div className='flex w-[12%] sm:w-1/5 justify-end'>
                                <button
                                    onClick={() =>  viewCollection(currentSlide)}
                                    className='btn border-none h-min inline-flex items-center sm:gap-2 justify-around rounded-full px-2 min-h-7
                                    text-white hover:bg-slate-700'
                                >
                                    <svg 
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    >
                                        <path fill="white" d="M21.5 5.75C20.5335 5.75 19.75 6.5335 19.75 7.5L19.75 16.5C19.75 17.4665 20.5335 18.25 21.5 18.25H22C22.4142 18.25 22.75 18.5858 22.75 19 22.75 19.4142 22.4142 19.75 22 19.75H21.5C19.7051 19.75 18.25 18.2949 18.25 16.5L18.25 7.5C18.25 5.70507 19.7051 4.25 21.5 4.25H22C22.4142 4.25 22.75 4.58579 22.75 5 22.75 5.41421 22.4142 5.75 22 5.75H21.5zM1.25 5C1.25 4.58579 1.58579 4.25 2 4.25H2.5C4.29493 4.25 5.75 5.70507 5.75 7.5L5.75 16.5C5.75 18.2949 4.29493 19.75 2.5 19.75H2C1.58579 19.75 1.25 19.4142 1.25 19 1.25 18.5858 1.58579 18.25 2 18.25H2.5C3.4665 18.25 4.25 17.4665 4.25 16.5L4.25 7.5C4.25 6.5335 3.4665 5.75 2.5 5.75H2C1.58579 5.75 1.25 5.41421 1.25 5z">
                                        </path>
                                        <path fill="white" d="M11.448 4.25L12.552 4.25C13.4505 4.24997 14.1997 4.24995 14.7945 4.32991C15.4223 4.41432 15.9891 4.59999 16.4445 5.05546C16.9 5.51093 17.0857 6.07773 17.1701 6.70552C17.2501 7.30031 17.25 8.04953 17.25 8.94801V15.052C17.25 15.9505 17.2501 16.6997 17.1701 17.2945C17.0857 17.9223 16.9 18.4891 16.4445 18.9445C15.9891 19.4 15.4223 19.5857 14.7945 19.6701C14.1997 19.7501 13.4505 19.75 12.552 19.75H11.448C10.5495 19.75 9.8003 19.7501 9.20552 19.6701C8.57773 19.5857 8.01093 19.4 7.55546 18.9445C7.09999 18.4891 6.91432 17.9223 6.82991 17.2945C6.74995 16.6997 6.74997 15.9505 6.75 15.052L6.75 8.948C6.74997 8.04952 6.74995 7.3003 6.82991 6.70552C6.91432 6.07773 7.09999 5.51093 7.55546 5.05546C8.01093 4.59999 8.57773 4.41432 9.20552 4.32991C9.8003 4.24995 10.5495 4.24997 11.448 4.25ZM9.40539 5.81654C8.94393 5.87858 8.74644 5.9858 8.61612 6.11612C8.4858 6.24644 8.37858 6.44393 8.31654 6.90539C8.2516 7.38843 8.25 8.03599 8.25 9L8.25 15C8.25 15.964 8.2516 16.6116 8.31654 17.0946C8.37858 17.5561 8.4858 17.7536 8.61612 17.8839C8.74644 18.0142 8.94393 18.1214 9.40539 18.1835C9.88843 18.2484 10.536 18.25 11.5 18.25H12.5C13.464 18.25 14.1116 18.2484 14.5946 18.1835C15.0561 18.1214 15.2536 18.0142 15.3839 17.8839C15.5142 17.7536 15.6214 17.5561 15.6835 17.0946C15.7484 16.6116 15.75 15.964 15.75 15V9C15.75 8.03599 15.7484 7.38843 15.6835 6.90539C15.6214 6.44393 15.5142 6.24644 15.3839 6.11612C15.2536 5.9858 15.0561 5.87858 14.5946 5.81654C14.1116 5.7516 13.464 5.75 12.5 5.75H11.5C10.536 5.75 9.88843 5.7516 9.40539 5.81654Z">
                                        </path>
                                    </svg>
                                    <p className='hidden sm:inline'>
                                    View
                                    </p>
                                </button>
                            </div>
                        
                        </div>

                        <div className='flex justify-center gap-1 w-full items-center'>
                            <a href={`#slide${currentSlide == 0 ? (thumbnails.length - 1) : (currentSlide - 1)}`} className="btn border-none h-9 min-h-9 hover:bg-slate-700">❮</a> 

                            <div className={`carousel shadow-lg shadow-black/40 ${thumbnails[currentSlide].aspectRatio === '1:1' ? 'collection-mini' : 'carousel-img-wide'}`} 
                                style={{transition: 'width 0.3s 0.01s'}}>
                                {console.log(currentSlide)}
                                {thumbnails.map((thumbnail, index) => {
                                    return (
                                        <div id={`slide${index}`} className="carousel-item relative" key={index}
                                            style={{opacity: `${currentSlide == index ? '1' : '0'}`, transition: 'opacity 0.3s 0.01s'}}
                                        >    
                                            {thumbnail.thumbnailUrl ? (
                                            <img className={`${(thumbnail.aspectRatio == '16:9' && 'carousel-img-wide') || ('collection-mini')} 
                                                drop-shadow-2xl shadow-inner shadow-black`} src={thumbnail.thumbnailUrl} draggable="false"
                                            />
                                            ) : (
                                            <div className={`${(thumbnail.aspectRatio == '16:9' && 'carousel-img-wide') || ('collection-mini')} 
                                                drop-shadow-2xl shadow-black bg-gray-700`} draggable="false"
                                            />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <a href={`#slide${(currentSlide + 1) % (thumbnails.length)}`} className="btn border-none h-9 min-h-9 hover:bg-slate-700">❯</a>
                        </div>
                    </div>
                    
                </div>
                    </>
                )}
            </div>
        </div>
    );
}