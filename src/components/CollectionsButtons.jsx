import React, { useState } from 'react';
import DeleteAlert from './DeleteAlert';

const ButtonGroup = ({ 
  onButtonClick, selectedIndex, setSelectedIndex, numSlides, selectedItemName, itemType, itemRef, emptyFlag
}) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleClick = (buttonName) => {
    
    if (selectedItemName == ('No Collections Yet!' || 'No Posts Yet!') && buttonName !== 'create') {
      //* Prevent buttons from changing state when they can't be used (can't edit or delete the blank items)
      //* Keeps the buttons from getting stuck in a highlighted state after they fail to do anything
      console.log('No valid item selected');
    } else if(itemType == 'collection' && numSlides >= 10 && (buttonName == 'create')) {
      console.log('Max collections reached');
      setSelectedButton(null);
    } else if(itemType == 'post' && numSlides >= 10 && (buttonName == 'create')) { //* allows for different max limits, unlike disabled/className fields of the create-button
      console.log('Max posts reached');
      setSelectedButton(null);
    } else {
      setSelectedButton(buttonName);
      
      if (onButtonClick) {
        onButtonClick(buttonName);
      }
    }
  };

  return (
    <div className="h-min inline-flex rounded-lg border border-zinc-600 bg-zinc-600 
      p-1 sm:gap-2 text-xs sm:text-sm shadow-lg shadow-black/30 collections-btns-mobile">
      
      <button onClick={() => handleClick('create')}
        className={`w-1/4 inline-flex items-center justify-around sm:gap-2 rounded-l-lg sm:rounded-md px-3 sm:px-4 h-12 
        ${selectedButton === 'create' ? 'text-blue-500 bg-gray-200 shadow-sm' :
          numSlides < 10 ? 'text-white hover:bg-zinc-500 hover:text-blue-100' : 'text-white opacity-50'}`}
        disabled={numSlides >= 10} // Disable the button if numSlides is 10 or more
      >
        <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 67.733 67.733" 
        strokeWidth="0"
        fill='none'
        className="h-4 w-4"
        >
          <path d="M18.094 231.519c-8.73 0-15.841 7.112-15.841 15.842v31.545c0 8.73 7.11 15.842 15.841 15.842h31.545c8.73 0 15.842-7.112 15.842-15.842V247.36c0-8.73-7.112-15.842-15.842-15.842zm0 5.293h31.545c5.89 0 10.55 4.659 10.55 10.549v31.545c0 5.89-4.66 10.548-10.55 10.548H18.094c-5.89 0-10.549-4.658-10.549-10.548V247.36c0-5.89 4.659-10.549 10.549-10.549zm16.395 8.068a2.646 2.646 0 0 0-2.608 2.682v12.752h-12.75a2.646 2.646 0 1 0 0 5.29h12.75v12.75a2.647 2.647 0 1 0 5.293 0v-12.75h12.75a2.646 2.646 0 1 0 0-5.29h-12.75v-12.752a2.646 2.646 0 0 0-2.685-2.682z" 
          fill='currentColor'
          transform="translate(0 -229.267)" 
          />
        </svg>
        <p className='hidden sm:inline'>
          Create
        </p>
      </button>

      <button onClick={() => handleClick('edit')}
        className={`w-1/4 inline-flex items-center sm:gap-2 justify-around rounded-r-lg sm:rounded-md px-4 h-12 mr-2 sm:mr-0
        ${selectedButton === 'edit' ? 'text-blue-500 bg-gray-200 shadow-sm' :
          !emptyFlag ? 'text-white hover:bg-zinc-500 hover:text-blue-100' : 'text-white opacity-50'}`}
        disabled={emptyFlag} // Disable the button if emptyFlag is true
      >
        <svg xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
        >
          <path strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
        <p className='hidden sm:inline'>
          Edit
        </p>
      </button>

      {<div className="flex justify-between items-center rounded-r-lg rounded-l-lg bg-slate-700 gap-0.5 h-12">
        <a href={`#slide${selectedIndex == 0 ? (numSlides - 1) : (selectedIndex - 1)}`} className="btn border-none h-12 min-h-10 rounded-none rounded-l-lg">❮</a> 
        <a href={`#slide${(selectedIndex + 1) % (numSlides)}`} className="btn rounded-none h-12 min-h-10 border-none rounded-r-lg">❯</a>
      </div>}

      <button onClick={() => handleClick('view')}
        className={`w-1/4 inline-flex items-center sm:gap-2 justify-around rounded-l-lg sm:rounded-md px-4 h-12 ml-2 sm:ml-0
        ${selectedButton === 'view' ? 'text-blue-500 bg-gray-200 shadow-sm' : 
          !emptyFlag ? 'text-white hover:bg-zinc-500 hover:text-blue-100' : 'text-white opacity-50'}`}
        disabled={emptyFlag} // Disable the button if emptyFlag is true
      >
        <svg xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="M21.5 5.75C20.5335 5.75 19.75 6.5335 19.75 7.5L19.75 16.5C19.75 17.4665 20.5335 18.25 21.5 18.25H22C22.4142 18.25 22.75 18.5858 22.75 19 22.75 19.4142 22.4142 19.75 22 19.75H21.5C19.7051 19.75 18.25 18.2949 18.25 16.5L18.25 7.5C18.25 5.70507 19.7051 4.25 21.5 4.25H22C22.4142 4.25 22.75 4.58579 22.75 5 22.75 5.41421 22.4142 5.75 22 5.75H21.5zM1.25 5C1.25 4.58579 1.58579 4.25 2 4.25H2.5C4.29493 4.25 5.75 5.70507 5.75 7.5L5.75 16.5C5.75 18.2949 4.29493 19.75 2.5 19.75H2C1.58579 19.75 1.25 19.4142 1.25 19 1.25 18.5858 1.58579 18.25 2 18.25H2.5C3.4665 18.25 4.25 17.4665 4.25 16.5L4.25 7.5C4.25 6.5335 3.4665 5.75 2.5 5.75H2C1.58579 5.75 1.25 5.41421 1.25 5z">
            </path>
            <path fill="currentColor" d="M11.448 4.25L12.552 4.25C13.4505 4.24997 14.1997 4.24995 14.7945 4.32991C15.4223 4.41432 15.9891 4.59999 16.4445 5.05546C16.9 5.51093 17.0857 6.07773 17.1701 6.70552C17.2501 7.30031 17.25 8.04953 17.25 8.94801V15.052C17.25 15.9505 17.2501 16.6997 17.1701 17.2945C17.0857 17.9223 16.9 18.4891 16.4445 18.9445C15.9891 19.4 15.4223 19.5857 14.7945 19.6701C14.1997 19.7501 13.4505 19.75 12.552 19.75H11.448C10.5495 19.75 9.8003 19.7501 9.20552 19.6701C8.57773 19.5857 8.01093 19.4 7.55546 18.9445C7.09999 18.4891 6.91432 17.9223 6.82991 17.2945C6.74995 16.6997 6.74997 15.9505 6.75 15.052L6.75 8.948C6.74997 8.04952 6.74995 7.3003 6.82991 6.70552C6.91432 6.07773 7.09999 5.51093 7.55546 5.05546C8.01093 4.59999 8.57773 4.41432 9.20552 4.32991C9.8003 4.24995 10.5495 4.24997 11.448 4.25ZM9.40539 5.81654C8.94393 5.87858 8.74644 5.9858 8.61612 6.11612C8.4858 6.24644 8.37858 6.44393 8.31654 6.90539C8.2516 7.38843 8.25 8.03599 8.25 9L8.25 15C8.25 15.964 8.2516 16.6116 8.31654 17.0946C8.37858 17.5561 8.4858 17.7536 8.61612 17.8839C8.74644 18.0142 8.94393 18.1214 9.40539 18.1835C9.88843 18.2484 10.536 18.25 11.5 18.25H12.5C13.464 18.25 14.1116 18.2484 14.5946 18.1835C15.0561 18.1214 15.2536 18.0142 15.3839 17.8839C15.5142 17.7536 15.6214 17.5561 15.6835 17.0946C15.7484 16.6116 15.75 15.964 15.75 15V9C15.75 8.03599 15.7484 7.38843 15.6835 6.90539C15.6214 6.44393 15.5142 6.24644 15.3839 6.11612C15.2536 5.9858 15.0561 5.87858 14.5946 5.81654C14.1116 5.7516 13.464 5.75 12.5 5.75H11.5C10.536 5.75 9.88843 5.7516 9.40539 5.81654Z">
            </path>
        </svg>
        <p className='hidden sm:inline'>
          View
        </p>
      </button>

      {/* Delete Modal */}
      <DeleteAlert itemName={selectedItemName} handleClick={handleClick} selectedButton={selectedButton} setSelectedIndex={setSelectedIndex} itemType={itemType} itemRef={itemRef} emptyFlag={emptyFlag}/>
      
    </div>
  );
};

export default ButtonGroup;