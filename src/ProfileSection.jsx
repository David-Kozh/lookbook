import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Data required:
//  - User image, name, bio, and links
//  - User's collections
//  - Currently open collection id (so it can be skipped in the MoreCollections section. Possibly for More Info header as well)
// ? Should additional info section be associated with the collection?
// TODO: More Collections Section
// TODO: Display Profile and More Collections section in 2 columns on larger screens

export default function ProfileSection({ userCollections }) {
    const location = useLocation(); // URL location
    const navigate = useNavigate();
    // Grabs the first post from each collection as a default thumbnail
    const posts = userCollections.map(collection => collection.postsArray[0]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const viewCollection = (index) => {
        setTimeout(() => {
            navigate('/posts');
        }, 10);
    }

    useEffect(() => {
        // Get the current URL
        const url = window.location.href;
        
        // Extract the index from the URL
        const index = parseInt(url.split('#slide')[1], 10);
    
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

    return(
        <div className="w-full body-h flex justify-center">
            <div id="contact-bg" className='w-[90%] sm:w-4/5 lg:w-3/4 2xl:w-2/3 h-5/6 flex flex-col bg-slate-200 
            rounded-lg shadow-lg px-6 py-4 mt-8 bg-opacity-75 items-center'>
            
                <div className="w-full h-min">
                    <h1 className='text-3xl xl:text-4xl 2xl:text-5xl font-bold'>User Bio</h1>
                    <div className="h-0.5 rounded-lg bg-zinc-700 my-1"></div>
                </div>

                {/* Profile */}
                <div id="contact-profile" className="w-full h-full lg:w-4/5 2xl:w-3/4 flex flex-col gap-4 items-center mt-2 px-0">
                    
                    {/* Username section for mobile only */}
                    <div className="flex flex-col w-full sm:hidden">
                        <div className='w-full h-min flex items-center justify-between'>
                            <h3 className="text-2xl/tight xl:text-3xl/tight 2xl:text-4xl/tight 
                            font-bold text-gray-900">Jane Doe</h3>
                            {/* Links */}
                            <div id="contact-links" className="w-1/3 flex justify-center">
                                {/* 
                                    Media links and SVGs: 
                                        - Should there be a section for users other collections?
                                */}
                                <div className="text-sm font-bold md:text-base text-black w-full flex justify-between">
                                    <p>IG</p>
                                    <p>YT</p>
                                    <p>X</p>
                                </div>
                            </div>
                        </div>
                        <h4 className="text-xl/none xl:text-2xl/none 2xl:text-3xl/none 
                        font-medium text-gray-800 mb-2">@user-handle</h4>
                    </div>

                    {/* Main Section: Flex Row */}
                    <div className="w-full flex items-stretch justify-center gap-4 xl:gap-8">
                        {/* Avatar */}
                        <div className="avatar">
                            <div className="w-28 rounded">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>

                        {/* User's Name and Bio */}
                        <div className="w-2/3 flex flex-col justify-between">

                            <div className="hidden sm:flex sm:flex-col">
                                <div className='flex justify-between items-center'>
                                    <h3 className="text-2xl/tight xl:text-3xl/tight 2xl:text-4xl/tight 
                                    font-bold text-gray-900">Jane Doe</h3>
                                    {/* Links */}
                                    <div id="contact-links" className="w-1/3 flex justify-center">
                                        {/* 
                                            Media links and SVGs: 
                                                - Should there be a section for users other collections?
                                        */}
                                        <div className="text-sm md:text-base font-bold text-black w-full flex justify-between">
                                            <p>IG</p>
                                            <p>YT</p>
                                            <p>X</p>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-xl/none xl:text-2xl/none 2xl:text-3xl/none 
                                font-medium text-gray-800 mb-2">@user-handle</h4>
                            </div>

                            <p className="lg:text-lg xl:text-xl text-gray-700 text-justify mb-1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distinctio nesciunt quas non animi.
                            </p>
                        
                        </div>
                    </div>

                    {/* Additional information */}
                    <div className="w-full sm:w-5/6 lg:w-4/5 2xl:w-3/4 flex justify-center sm:pl-2">
                        <div className="lg:text-lg xl:text-xl text-gray-700 text-justify">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distinctio nesciunt quas non animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates voluptas distinctio nesciunt quas non animi.
                        </div>
                    </div>
                </div>

                <div id="more-collections" className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="w-full text-xl font-bold">More Collections</h1>
                    <div className="min-h-0.5 w-full rounded-lg bg-zinc-700 my-1"></div>

                    <div className='w-full flex flex-col items-center'>
                        
                        {/* Collection Name + ViewPosts button */}
                        <div className='flex w-full gap-2 items-center justify-between'>
                            <div className='w-[12%] sm:w-1/5'/> {/* Spacer for centering */}       
                            
                            <div className='mt-2 text-lg lg:text-2xl font-mono font-bold underline underline-offset-4 text-zinc-900 select-none'>{userCollections[currentIndex].title}</div>
                            
                            <div className='flex w-[12%] sm:w-1/5 justify-end'>
                                <button
                                    onClick={() =>  viewCollection(0)}
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
                            <a href={`#slide${currentIndex == 0 ? (posts.length - 1) : (currentIndex - 1)}`} className="btn border-none h-9 min-h-9 hover:bg-slate-700">❮</a> 

                            <div className={`carousel shadow-lg shadow-black/40 ${posts[currentIndex].aspectRatio === '1:1' ? 'collection-mini' : 'carousel-img-wide'}`} 
                                style={{transition: 'width 0.3s 0.01s'}}>
                                {console.log(currentIndex)}
                                {posts.map((post, index) => {
                                    return (
                                        <div id={`slide${index}`} className="carousel-item relative" key={index}
                                            style={{opacity: `${currentIndex == index ? '1' : '0'}`,
                                                transition: 'opacity 0.3s 0.01s'}}
                                        >    
                                            <img
                                                className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('collection-mini')} 
                                                    drop-shadow-2xl shadow-inner shadow-black`}
                                                src={post.image}
                                                draggable="false"
                                            />
                                        </div>
                                    )
                                })}
                            </div>

                            <a href={`#slide${(currentIndex + 1) % (posts.length)}`} className="btn border-none h-9 min-h-9 hover:bg-slate-700">❯</a>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    );
}