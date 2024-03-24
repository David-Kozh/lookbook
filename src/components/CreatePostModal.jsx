import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react';
import CreatePostForm from './CreatePostForm';


//! DEPRECATED COMPONENT
// ** displayType: 'create-collection' | 'edit-collection' (Essentially display location).
// If displayType is 'create-collection', display button for creating a new collection
// If displayType is 'edit-collection', display button for editing a collection

export default function CreatePostModal({ selectedButton, handleClick, displayType, setPosts }) {
  // 1. Define a state variable to control the visibility of the dialog.
  const [isOpen, setIsOpen] = useState(true);

  
  return (
    <Dialog isOpen={isOpen}>
      <DialogTrigger asChild>
        {(displayType === 'create-collection' &&
        <button
            type='button'
            onClick={() => handleClick('create')}
            className={`h-1/3 flex items-center justify-center rounded-t-lg px-4 
            ${selectedButton === 'create' ? 'text-blue-500 bg-gray-200 shadow-sm' : 'text-white hover:bg-zinc-500 hover:text-blue-100'}`}
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
        ) || (displayType === 'edit-collection' &&
        <Button
            className={`w-1/4 inline-flex items-center justify-around sm:gap-2 rounded-l-lg sm:rounded-md px-3 sm:px-4 h-12 
            ${selectedButton === 'create' ? 'text-blue-500 bg-gray-200 shadow-sm' : 'text-white hover:bg-zinc-500 hover:text-blue-100'}`}
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
            <p className='hidden sm:inline'>
                Create X
            </p>
        </Button>)}
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-lg lg:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription className="ml-0.5">
            Upload your work here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-black"/>

        <CreatePostForm/>        

      </DialogContent>
    </Dialog>
  )
}
