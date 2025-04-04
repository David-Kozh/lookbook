import React from 'react';
import { logout } from '../services/authService';

const LogoutButton = () => {

  const handleLogout = async () => {
    try {
      const message = await logout();
      console.log(message);
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button
    onClick={handleLogout}
    className="bg-secondary text-secondary-foreground inline-block rounded-lg p-2 
    hover:text-foreground border border-secondary hover:border-foreground transition hover:bg-transparent
    sm:hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 96 96" id="exit" className='ml-0.5'>
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="5" d="M64 35.7059V16C64 12.6863 61.3137 10 58 10H19C15.6863 10 13 12.6863 13 16V80C13 83.3137 15.6863 86 19 86H58C61.3137 86 64 83.3137 64 80V61.9706M77 58L83.818 51.182C85.5754 49.4246 85.5754 46.5754 83.818 44.818L77 38M74 48H47"></path>
      </svg>
    </button>
  );
};

export default LogoutButton;