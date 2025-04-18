import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Only used on posts within the CreateCollectionForm.jsx
const LeftButtonGroup = ({ selectedButton, selectedItemName, openDialog, removePost, maxPostsFlag }) => {

  const handleClick = (buttonName) => {
    if(buttonName === 'create') {
      openDialog('create');
    }
    if(buttonName === 'edit') {
      openDialog('edit');
    }
  };

  const handleContinue = () => {
    removePost();
  };

  return (
  <div className="flex flex-col rounded-xl border border-zinc-600 bg-zinc-600 
    p-1 text-xs sm:text-sm shadow-lg shadow-black/30 h-2/3"
  >
    <button
      type='button'
      onClick={() => handleClick('create')}
      className={`h-1/3 flex items-center justify-center rounded-t-lg px-4 
        ${selectedButton === 'create' ? 'text-blue-500 bg-gray-200 shadow-sm' 
        : !maxPostsFlag ? 'hover:bg-zinc-500 hover:text-blue-100 text-white' : 'text-zinc-400'}`}
      disabled={maxPostsFlag} // Disable the button when maxPostsFlag is true
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 67.733 67.733" 
        strokeWidth="0"
        fill='none'
        className="h-4 w-4"
      >
        <path 
          d="M18.094 231.519c-8.73 0-15.841 7.112-15.841 15.842v31.545c0 8.73 7.11 15.842 15.841 15.842h31.545c8.73 0 15.842-7.112 15.842-15.842V247.36c0-8.73-7.112-15.842-15.842-15.842zm0 5.293h31.545c5.89 0 10.55 4.659 10.55 10.549v31.545c0 5.89-4.66 10.548-10.55 10.548H18.094c-5.89 0-10.549-4.658-10.549-10.548V247.36c0-5.89 4.659-10.549 10.549-10.549zm16.395 8.068a2.646 2.646 0 0 0-2.608 2.682v12.752h-12.75a2.646 2.646 0 1 0 0 5.29h12.75v12.75a2.647 2.647 0 1 0 5.293 0v-12.75h12.75a2.646 2.646 0 1 0 0-5.29h-12.75v-12.752a2.646 2.646 0 0 0-2.685-2.682z" 
          fill='currentColor'
          transform="translate(0 -229.267)" 
        />
      </svg>
    </button>

    <button
      type='button'
      onClick={() => handleClick('edit')}
      className={`h-1/3 flex items-center justify-center px-4 text-white
        ${selectedButton === 'edit' ? 'text-blue-500 bg-gray-200 shadow-sm' 
        : selectedItemName !== null ? 'hover:bg-zinc-500 hover:text-blue-100' : 'text-zinc-400'}`}
      disabled={selectedItemName == null} // Disable the button when selectedItem is null
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>


    {/* Delete Modal */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type='button'
          onClick={() => handleClick('delete')}
          className={`h-1/3 inline-flex items-center sm:gap-2 justify-around rounded-b-lg px-4 text-white
            ${selectedButton === 'delete' ? 'text-blue-500 bg-gray-200 shadow-sm' 
            : selectedItemName !== null ? 'hover:bg-zinc-500 hover:text-blue-100' : 'text-zinc-400'}`}
          disabled={selectedItemName == null} // Disable the button when selectedItem is null
        >
          <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
          >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
          </svg>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete '{selectedItemName}'.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </div>
  );
};

export default LeftButtonGroup;