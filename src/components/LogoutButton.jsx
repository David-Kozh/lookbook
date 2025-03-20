import React from 'react';
import { logout } from '../services/authService';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const message = await logout();
      console.log(message);
      // Perform any additional actions after logout, such as redirecting the user
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className='flex mr-2 sm:mr-4 sm:gap-2'>
        <button
            onClick={handleLogout}
            className="inline-block rounded-lg bg-slate-800/90 px-2 py-2 md:px-3 md:py-3 lg:px-5 
            text-xs sm:text-sm font-medium text-center text-white hover:text-slate-800
            border border-slate-800/80 transition hover:bg-transparent
            sm:hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] duration-200"
        >
            Log Out
        </button>
    </div>
  );
};

export default LogoutButton;