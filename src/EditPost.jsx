import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { updatePost, getPosts } from "./services/postService.js"


// ** Zod Schema for Form Validation
const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    image: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }).optional(),
    aspectRatio: z.string(),
    description: z.string().optional(),
    postType: z.string().optional(),
    content: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }),
})

// ** Form for Creating Post
//? Should the current image be rendered rather than just a file input?
export default function EditPost({ loggedInUserId, collectionId, postIndex, cancelEdit }) {
    
    const [post, setPost] = useState({ 
        title: 'Loading...',
        description: '', 
        image: '', 
        aspectRatio: '', 
        postType: '', 
        content: '' 
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {    
                const posts = await getPosts(loggedInUserId, collectionId);
                setPost(posts[postIndex]);
            } catch (error) {
                console.error('Error fetching collection\'s posts:', error.message);
            }
        };
        fetchPost();

    }, [loggedInUserId, collectionId, postIndex]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post.title,
            description: post.description,
            image: undefined,       //! How should default file be handled?
            aspectRatio: post.aspectRatio,
            postType: post.postType,
            content: undefined,     //! How should default file be handled?
        }
    });
    const postTypeWatch = form.watch('postType');
      
    useEffect(() => {
        //* Reset form values when post state changes
        form.reset({
            title: post.title,
            description: post.description,
            image: undefined,               //?
            aspectRatio: post.aspectRatio,
            postType: post.postType,
            content: undefined,             //?
        });
    }, [post, form]);

    async function onSubmit(values) {
        console.log(values)
        
        const updatedData = {}; //* Prune data of unchanged fields before updating
        if (values.title !== post.title) {
            updatedData.title = values.title;
        }
        if (values.description !== post.description) {
            updatedData.description = values.description;
        }
        if (values.image) {
            updatedData.imageFile = values.image;
        }
        if (values.aspectRatio !== post.aspectRatio) {
            updatedData.aspectRatio = values.aspectRatio;
        }
        if (values.postType !== post.postType) {
            updatedData.postType = values.postType;
        }
        if (values.content) {
            updatedData.contentFile = values.content;
        }

        // TODO: Additionally make sure the file extensions match the content type 
        if ((values.postType === 'mp4' || values.postType === 'mp3') && !(values.content instanceof File)) {
            form.setError('content', {
                type: 'manual',
                message: 'A file is required',
            });
            return;
        }
        
        //* Update post with the form input data
        try{
            await updatePost(
                loggedInUserId, 
                collectionId, 
                post.id, 
                updatedData
            );
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
        cancelEdit();
    }
      
    return (
        <div id='edit-post' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 mb-2 text-3xl xl:text-4xl font-bold select-none">Edit Post</div>
            <div className="h-0.5 w-full rounded-full bg-card-foreground dark:opacity-50 my-1"></div>
            <div className="w-full mt-1 ml-4 font-semibold text-sm text-card-foreground/70">
                Update your work here. Click save when you're done.
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-4/5 w-full px-2 mt-6">
                <FormField name="title"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="w-full mt-2">
                    <div className="flex gap-4 items-center">
                    <FormLabel>Title</FormLabel>
                    <FormDescription>
                        Displayed when post is selected.
                    </FormDescription>
                    </div>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField name="description"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="w-full">
                    <div className="flex gap-4 items-center">
                    <FormLabel>Caption</FormLabel>
                    <FormDescription>
                        Can be left blank.
                    </FormDescription>
                    </div>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Controller name="image"
                    control={form.control}
                    render={({ field: { onChange, ref } }) => (
                    <FormItem>
                        <div className="grid gap-1.5">
                        <FormLabel className={`${form.formState.errors.image && 'text-red-500'}`}>
                            Image
                        </FormLabel>
                        <FormControl>
                            <Input id="image"
                            type="file"
                            className="file-input-ghost bg-input text-foreground"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                onChange(e.target.files[0]); // store file
                                }
                            }}
                            ref={ref}
                            />
                        </FormControl>
                        </div>
                        <FormMessage/>
                    </FormItem>
                    )}
                />

                {/* replace with radio group */}
                <div className="flex w-full gap-4 my-4">
                <FormField name="aspectRatio"
                control={form.control}
                render={({ field }) => (
                    <FormItem className='w-[35%]'>
                        <FormLabel>Aspect Ratio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-input text-foreground mt-2 font-semibold">
                            <SelectValue placeholder="1:1" />
                        </SelectTrigger>
                        <SelectContent className="font-semibold">
                            <SelectItem value="1:1">1:1</SelectItem>
                            <SelectItem value="16:9">16:9</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField name="postType"
                control={form.control}
                render={({ field }) => (
                    <FormItem className='w-[65%]'>
                        <FormLabel>Post Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full mt-2 font-semibold bg-input text-foreground">
                            <SelectValue placeholder="No Content" />
                        </SelectTrigger>
                        <SelectContent className="font-semibold">
                            <SelectItem value="default"> No Content </SelectItem>
                            <SelectItem value="mp4">+ Video Content</SelectItem>
                            <SelectItem value="mp3">+ Audio Content</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
                </div>
                <Controller name="content"
                control={form.control}
                render={({ field: { onChange, ref } }) => (
                    <FormItem>
                        <div className="grid gap-1.5">
                            <FormLabel className={`${(postTypeWatch === 'mp4' || postTypeWatch === 'mp3') ? '' : 'opacity-50' }`}>
                                Additional Content
                            </FormLabel>
                            <FormControl>
                                <Input id="content" 
                                type="file" 
                                className="file-input-ghost bg-input text-foreground"
                                disabled={!(postTypeWatch === 'mp4' || postTypeWatch === 'mp3')}
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                      onChange(e.target.files[0]); // Store the selected file
                                    }
                                  }}
                                  ref={ref}
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="w-full flex justify-between gap-20">
                    <Button type="button" className='mt-12 w-1/2 sm:w-min' onClick={()=> cancelEdit()}>Cancel</Button>
                    <Button type="submit" variant="secondary" className="mt-12 w-1/2 sm:w-min">Save Post</Button>
                </div>

            </form>
            </Form>
        </div>
    )
}