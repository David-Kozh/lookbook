import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function BottomBar() {
    const [barTab, setBarTab] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { handle } = useParams();

    const handleClick = (tabName) => {
        setBarTab(tabName);
        if(tabName === 'home'){
            navigate('/');
        } else if(tabName === 'bio'){
            navigate(`/bio${handle ? `/${handle}` : ''}`);
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
        <div className="btm-nav btm-nav-md h-[4.5vh] bottom-bar sm:hidden text-white/70 bg-zinc-900 dark:bg-card font-mono leading-none">
            <button className={`${barTab === 'home' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('home')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>

            </button>
            
            <button className={`${barTab === 'bio' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('bio')}    
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" id="profile">
                    <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="2">
                        <g id="Dribbble-Light-Preview" fill="currentColor" transform="translate(-180 -2159)">
                            <g id="icons" transform="translate(56 160)">
                                <path id="profile-[#1341]" d="M134 2009c-2.217 0-4.019-1.794-4.019-4s1.802-4 4.019-4 4.019 1.794 4.019 4-1.802 4-4.019 4m3.776.673a5.978 5.978 0 0 0 2.182-5.603c-.397-2.623-2.589-4.722-5.236-5.028-3.652-.423-6.75 2.407-6.75 5.958 0 1.89.88 3.574 2.252 4.673-3.372 1.261-5.834 4.222-6.22 8.218a1.012 1.012 0 0 0 1.004 1.109.99.99 0 0 0 .993-.891c.403-4.463 3.836-7.109 7.999-7.109s7.596 2.646 7.999 7.109a.99.99 0 0 0 .993.891c.596 0 1.06-.518 1.003-1.109-.385-3.996-2.847-6.957-6.22-8.218"></path>
                            </g>
                        </g>
                    </g>
                </svg>

            </button>

            <button className={`${barTab === 'feed' ? 'active bg-transparent' : ''}`}
                onClick={() => handleClick('feed')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>

            </button>
            
        </div>
    );
}