import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import CreatePostForm from './components/CreatePostForm';
import EditPostForm from './components/EditPostForm';
import CreateCollectionForm from "./components/CreateCollectionForm";
import { createCollection } from "./services/collectionService";
import { createPost } from './services/postService';

//* This component is rendered in UserDashboard.jsx
//* ✅ Ready for testing with firebase db and storage
export default function CreateCollection({ loggedInUserId, cancelCreate }) {
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedBtn, setSelectedBtn] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    //* Fucntions to hand opening/closing of the create and edit post modals
    const handleOpenDialog = (dialogName) => {
        if (dialogName === 'create') {
            setCreateDialogOpen(true);
            setSelectedBtn('create');
        } else if (dialogName === 'edit') {
            setEditDialogOpen(true);
            setSelectedBtn('edit');
        }
        console.log('dialog open');
    };
    const handleCloseDialog = (dialogName) => {
        if (dialogName === 'create') {
            setCreateDialogOpen(false);
        } else if (dialogName === 'edit') {
            setEditDialogOpen(false);
        }
        setSelectedBtn(null);
    };

    //* Functions to manage local collection.postsArray that is currently being created
    const addPost = (post) => {
        setPosts([...posts, post]);
        console.log('post added locally (CreateCollection)');
    };
    const updatePost = (post) => {
        const newPosts = [...posts];
        newPosts[currentIndex] = post;
        setPosts(newPosts);
    };
    const removePost = () => {
        const newPosts = [...posts];
        newPosts.splice(currentIndex, 1);
        setPosts(newPosts);
    }

    //* Submit the local collection to the database, with its postsArray
    //* Passed to CreateCollectionForm.jsx
    const submitCollection = async (collection, postsArray) => {
        try {
            // Create the collection and get its ID
            const collectionId = await createCollection(loggedInUserId, collection);
            
            // Iterate over the posts array and create each post
            for (const post of postsArray) {
                if (post) { // Check if post is not null or undefined
                    console.log('Relevant params:', loggedInUserId, collectionId, post);
                    await createPost(loggedInUserId, collectionId, post);
                } else {
                    console.warn('Encountered null or undefined post:', post);
                }
            }
            console.log('Collection and its posts created successfully');
        } catch (error) {
            console.error('Error creating collection or its posts:', error.message);
        }
    };

    useEffect(() => {   //* Reset selected button when the dialogs are closed
        if ((selectedBtn === 'create' || selectedBtn === 'edit') && !isCreateDialogOpen && !isEditDialogOpen) {
            setSelectedBtn(null);
        }
    }, [isCreateDialogOpen, isEditDialogOpen]);

    return (
        <div id='create-collection-menu' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 mb-1 ml-2 text-2xl md:text-3xl font-bold select-none" style={{height: "5%"}}>New Collection</div>
            <div className="h-0.5 w-full rounded-full bg-card-foreground dark:opacity-50 my-2"></div>

            <CreateCollectionForm cancelCreate={cancelCreate} openDialog={handleOpenDialog} submitCollection={submitCollection} posts={posts} 
                selectedButton={selectedBtn} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} removePost={removePost}
            />
            {/* 
                Dialogs for creating and editing posts are opened by the LeftButtonGroup in CreateCollectionForm.jsx (above)
            */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-[425px] sm:max-w-lg lg:max-w-2xl">
                    <DialogHeader className="text-left">
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription className="ml-0.5">
                            Upload your work here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator className="bg-black"/>

                    <CreatePostForm addPost={addPost} dismiss={handleCloseDialog} />

                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-[425px] sm:max-w-lg lg:max-w-2xl">
                    <DialogHeader className="text-left">
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription className="ml-0.5">
                            Update your work here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator className="bg-black"/>

                    <EditPostForm updatePost={updatePost} post={posts.length > 0 ? posts[currentIndex] : null} dismiss={handleCloseDialog} />       
                
                </DialogContent>
            </Dialog>
        </div>
    )
}