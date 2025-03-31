import React, { useEffect, useState } from 'react';
import { logout } from '../services/authService';

const LogoutButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from localStorage or default to false
    return localStorage.getItem('theme') === 'dark';
  });

  const handleLogout = async () => {
    try {
      const message = await logout();
      console.log(message);
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      setIsDarkMode(false);
      localStorage.setItem('theme', 'light'); // Save preference
    } else {
      htmlElement.classList.add('dark');
      setIsDarkMode(true);
      localStorage.setItem('theme', 'dark'); // Save preference
    }
  };

  useEffect(() => {
    const htmlElement = document.documentElement;

    // Apply the saved theme from localStorage on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Observe changes to the <html> classList
    const observer = new MutationObserver(() => {
      // Dynamically update the state when the dark class changes
      setIsDarkMode(htmlElement.classList.contains('dark'));
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className='flex mr-2 sm:mr-4 gap-2'>
      <a onClick={toggleDarkMode}
        className="cursor-pointer bg-background p-2 sm:p-2 lg:px-5 
          text-foreground hover:bg-white/30 rounded-xl
          transition duration-150 flex items-center justify-center"
      >
        {isDarkMode ? (
          // Filled moon for dark mode
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
          <path strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
          />
          </svg>
        ) : (
          // Hollow moon for light mode
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
          <path strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
          />
          </svg>
        )}
      </a>
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
    </div>
  );
};

export default LogoutButton;