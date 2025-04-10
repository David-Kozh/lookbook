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
        if(tab === 'bio' || tab === 'posts' || tab === 'home' || tab === 'feed'){
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