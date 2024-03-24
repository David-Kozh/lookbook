import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar( {selectedImage, setSelectedImage, posts, closeSelectedImage} ) { // Top bar to be rendered in any page

  return (
      <nav className="nav-h font-mono text-lg text-center w-3/5 select-none gap-12 md:gap-16 lg:gap-20">
        
        <Link 
          reloadDocument to="/home" 
          className="w-1/3 text-zinc-600 hover:text-black hover:underline underline-offset-8"
        >
          Home
        </Link>

        <Link
          to="/bio"
          className="w-1/3 text-zinc-600 hover:text-black hover:underline underline-offset-8"
          onClick={() => closeSelectedImage(selectedImage)}
        >
          Bio
        </Link>

        <Link 
          to="/posts" 
          className="w-1/3 text-zinc-600 hover:text-black hover:underline underline-offset-8"
          onClick={() => closeSelectedImage(selectedImage)}
        >
          Posts
          {/* Breadcrumb */}
          {(selectedImage != null) && (window.innerWidth >= 1024) && (
          <div className='absolute inline-flex align-middle opacity-0 breadcrumb-opacity'> 
            <svg
              className="inline-block mx-5 h-5 w-5 mt-1"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                fill="#3D3D3D"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className='inline-blow font-mono text-lg italic'>"{posts[selectedImage].title}"</p>
          </div>
        )}
        </Link>

      </nav>
  );
}

export default Navbar;