import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from 'react';
import CreatePostForm from './components/CreatePostForm';
import EditPostForm from './components/EditPostForm';
import CreateCollectionForm from "./components/CreateCollectionForm";
import { createCollection } from "./services/collectionService";
import { createPost } from './services/postService';

//! TODO/Current task: Implementing Cloud Storage here, so that Posts can be properly uploaded to DB with media content URLs
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
        console.log('post added (CreateCollection)');
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
    const submitCollection = async (collection, postsArray) => {
        //* Replacing with firestore
        ////addCollection({ ...collection, postsArray: posts });
        const collectionId = await createCollection(loggedInUserId, collection);
        
        //TODO  Iterate over the posts array and upload videos and images to storage
        //TODO  !Check that postsArray structure matches createPost function in postService.js
        // Iterate over the posts array and create each post
        for (const el of postsArray) {
            //TODO  Use Cloud storage for post.image and optionally post.content
            await createPost(loggedInUserId, collectionId, el);
        }
    };

    useEffect(() => {   //* Reset selected button when the dialogs are closed
        if ((selectedBtn === 'create' || selectedBtn === 'edit') && !isCreateDialogOpen && !isEditDialogOpen) {
            setSelectedBtn(null);
        }
    }, [isCreateDialogOpen, isEditDialogOpen]);

    return (
        <div id='create-collection-menu' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 text-2xl font-bold select-none text-zinc-800">New Collection</div>
            <CreateCollectionForm cancelCreate={cancelCreate} openDialog={handleOpenDialog} submitCollection={submitCollection} posts={posts} 
                selectedButton={selectedBtn} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} removePost={removePost}
            />
            
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