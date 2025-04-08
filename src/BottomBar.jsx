import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function BottomBar() {
    const [barTab, setBarTab] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, collectionId } = useParams();

    const handleClick = (tabName) => {
        setBarTab(tabName);
        if(tabName === 'home'){
            navigate('/home');
        } else if(tabName === 'bio'){
            navigate(`/bio${userId ? `/${userId}` : ''}`);
        } else if(tabName === 'posts'){
            navigate(`/posts${userId ? `/${userId}` : ''}${collectionId ? `/${collectionId}` : ''}`);
        } else if(tabName === 'feed'){
            navigate('/feed');
        }
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const tab = url.pathname.split('/')[1];
        if(tab === 'bio' || tab === 'posts' || tab === 'home'){
            setBarTab(tab);
        }
    }, [location]);

    return (
        <div className="btm-nav btm-nav-md bottom-bar sm:hidden text-white/70 bg-zinc-900 dark:bg-[#ffffff07] font-mono leading-none">
            <button 
                className={`${barTab === 'home' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('home')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                
                <span className="btm-nav-label">Home</span>
            
            </button>
            
            <button 
                className={`${barTab === 'bio' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('bio')}    
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <span className="btm-nav-label">Bio</span>
            
            </button>
            
            <button 
                className={`${barTab === 'posts' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('posts')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21.5 5.75C20.5335 5.75 19.75 6.5335 19.75 7.5L19.75 16.5C19.75 17.4665 20.5335 18.25 21.5 18.25H22C22.4142 18.25 22.75 18.5858 22.75 19 22.75 19.4142 22.4142 19.75 22 19.75H21.5C19.7051 19.75 18.25 18.2949 18.25 16.5L18.25 7.5C18.25 5.70507 19.7051 4.25 21.5 4.25H22C22.4142 4.25 22.75 4.58579 22.75 5 22.75 5.41421 22.4142 5.75 22 5.75H21.5zM1.25 5C1.25 4.58579 1.58579 4.25 2 4.25H2.5C4.29493 4.25 5.75 5.70507 5.75 7.5L5.75 16.5C5.75 18.2949 4.29493 19.75 2.5 19.75H2C1.58579 19.75 1.25 19.4142 1.25 19 1.25 18.5858 1.58579 18.25 2 18.25H2.5C3.4665 18.25 4.25 17.4665 4.25 16.5L4.25 7.5C4.25 6.5335 3.4665 5.75 2.5 5.75H2C1.58579 5.75 1.25 5.41421 1.25 5z">
                    </path>
                    <path fill="currentColor" d="M11.448 4.25L12.552 4.25C13.4505 4.24997 14.1997 4.24995 14.7945 4.32991C15.4223 4.41432 15.9891 4.59999 16.4445 5.05546C16.9 5.51093 17.0857 6.07773 17.1701 6.70552C17.2501 7.30031 17.25 8.04953 17.25 8.94801V15.052C17.25 15.9505 17.2501 16.6997 17.1701 17.2945C17.0857 17.9223 16.9 18.4891 16.4445 18.9445C15.9891 19.4 15.4223 19.5857 14.7945 19.6701C14.1997 19.7501 13.4505 19.75 12.552 19.75H11.448C10.5495 19.75 9.8003 19.7501 9.20552 19.6701C8.57773 19.5857 8.01093 19.4 7.55546 18.9445C7.09999 18.4891 6.91432 17.9223 6.82991 17.2945C6.74995 16.6997 6.74997 15.9505 6.75 15.052L6.75 8.948C6.74997 8.04952 6.74995 7.3003 6.82991 6.70552C6.91432 6.07773 7.09999 5.51093 7.55546 5.05546C8.01093 4.59999 8.57773 4.41432 9.20552 4.32991C9.8003 4.24995 10.5495 4.24997 11.448 4.25ZM9.40539 5.81654C8.94393 5.87858 8.74644 5.9858 8.61612 6.11612C8.4858 6.24644 8.37858 6.44393 8.31654 6.90539C8.2516 7.38843 8.25 8.03599 8.25 9L8.25 15C8.25 15.964 8.2516 16.6116 8.31654 17.0946C8.37858 17.5561 8.4858 17.7536 8.61612 17.8839C8.74644 18.0142 8.94393 18.1214 9.40539 18.1835C9.88843 18.2484 10.536 18.25 11.5 18.25H12.5C13.464 18.25 14.1116 18.2484 14.5946 18.1835C15.0561 18.1214 15.2536 18.0142 15.3839 17.8839C15.5142 17.7536 15.6214 17.5561 15.6835 17.0946C15.7484 16.6116 15.75 15.964 15.75 15V9C15.75 8.03599 15.7484 7.38843 15.6835 6.90539C15.6214 6.44393 15.5142 6.24644 15.3839 6.11612C15.2536 5.9858 15.0561 5.87858 14.5946 5.81654C14.1116 5.7516 13.464 5.75 12.5 5.75H11.5C10.536 5.75 9.88843 5.7516 9.40539 5.81654Z">
                    </path>
                </svg>
                
                <span className="btm-nav-label">Posts</span>
            
            </button>

            <button 
                className={`${barTab === 'feed' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('feed')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
                
                <span className="btm-nav-label">Feed</span>
            
            </button>
            
        </div>
    );
}