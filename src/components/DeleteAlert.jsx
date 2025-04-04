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
import { deletePost } from "@/services/postService";
import { deleteCollection } from "@/services/collectionService";
  
  //* Pass a 'ref' which is composed of {user.uid, collection.id} or {user.uid, collection.id, post.id}. 
  //* Then use the ref with the appropriate delete function, based on the 'itemType' prop
  export default function DeleteAlert({ 
    itemName, itemType, // for confirmation message
    handleClick, setSelectedIndex, selectedButton, 
    itemRef, // {loggedInUserId, collectionId, postId}
  }) {
    const { loggedInUserId, collectionId, postId } = itemRef;
    const handleCancel = () => {
      handleClick(null);
    }
    
    const handleContinue = () => {
      handleClick(null);

      window.location.hash = '#slide0';
      setSelectedIndex(0);

      if(itemType === 'collection'){
        //use collection delete function: user.uid and collection.id needed
        deleteCollection(loggedInUserId, collectionId);
      } else if(itemType === 'post' && postId){
        //use post delete function: user.uid, collection.id and post.id needed
        deletePost(loggedInUserId, collectionId, postId);
      };
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
              onClick={() => handleClick('delete')}
              className={`w-1/4 inline-flex items-center sm:gap-2 justify-around rounded-r-lg sm:rounded-md px-4 h-12
              ${selectedButton === 'delete' ? 'text-blue-500 bg-gray-200 shadow-sm' : 'text-white hover:bg-zinc-500 hover:text-blue-100'}`}
              disabled={itemName == ('No Collections Yet!' || 'No Posts Yet!')}
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
              <p className='hidden sm:inline'>
                  Delete
              </p>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will <strong className="text-destructive dark:text-red-500">permanently delete</strong> your <strong>'{itemName}' {itemType}.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-primary text-primary-foreground hover:text-card-foreground hover:bg-transparent border-primary' onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction className='bg-destructive' onClick={handleContinue}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  