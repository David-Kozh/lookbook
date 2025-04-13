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
    image: z.any()
        .refine(file => file instanceof File || file === undefined, {
            message: 'A file is required',
        })
        .refine(file => file === undefined || file.size <= 5 * 1024 * 1024, {
            message: 'File size must be 5MB or less',
        })
        .refine(file => file === undefined || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
            message: 'Only JPG or PNG files are allowed',
        })
        .optional(),
    aspectRatio: z.string(),
    description: z.string().optional(),
    content: z.any()    
        .refine(file => file instanceof File || file === undefined, {
            message: 'A file is required',
        })
        .refine(file => {
            if (file === undefined) return true;
            if (file.type.startsWith('audio/') && file.size <= 10 * 1024 * 1024) return true; // 10MB for audio
            if (file.type.startsWith('video/') && file.size <= 50 * 1024 * 1024) return true; // 50MB for video
            return false;
        }, {
            message: 'Audio files must be 10MB or less, and video files must be 50MB or less.',
        })
        .refine(file => file === undefined || ['audio/mp3', 'audio/wav', 'video/mp4', 'video/quicktime'].includes(file.type), {
            message: 'Only MP3, WAV, MP4, or MOV files are allowed.',
        }),
})

// ** Form for Creating Post
//? Should the current image be rendered rather than just a file input?
export default function EditPost({ loggedInUserId, collectionId, postIndex, cancelEdit }) {
    
    const [post, setPost] = useState({ 
        title: 'Loading...',
        description: '', 
        image: undefined, 
        aspectRatio: '', 
        content: undefined 
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
            content: undefined,     //! How should default file be handled?
        }
    });
    const { formState } = form;
      
    useEffect(() => {
        //* Reset form values when post state changes
        form.reset({
            title: post.title,
            description: post.description,
            image: undefined,               //?
            aspectRatio: post.aspectRatio,
            content: undefined,             //?
        });
    }, [post, form]);

    async function onSubmit(values) {
        console.log(values)
        
        // Determine the post type based on the content file's MIME type
        let postType = null;
        if (values.content instanceof File) {
            const mimeType = values.content.type;
            if (mimeType.startsWith('audio/')) {
                postType = 'audio';
            } else if (mimeType.startsWith('video/')) {
                postType = 'video';
            }
        } else {
            postType = 'default';
        }

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
        if (postType !== post.postType) {
            updatedData.postType = postType;
        }
        if (values.content) {
            updatedData.contentFile = values.content;
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
                    <FormItem className={`${
                        form.watch('image') ? 'opacity-100' : 'opacity-50'
                      } hover:opacity-100`}>
                        <div className="grid gap-1.5">
                        <FormLabel className={`${form.formState.errors.image && 'text-red-500'}`}>
                            New Image
                        </FormLabel>
                        <FormControl>
                            <Input id="image"
                            type="file"
                            className="file-input-ghost bg-input"
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

                {/* replace with radio group? */}
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
                <Controller name="content"
                control={form.control}
                render={({ field: { onChange, ref } }) => (
                    <FormItem className={`${
                        form.watch('content') ? 'opacity-100' : 'opacity-50'
                      } hover:opacity-100 w-[65%]`}>
                        <FormLabel>
                            Additional Content
                        </FormLabel>
                        <FormControl>
                            <Input id="content" 
                            type="file" 
                            className="file-input-ghost bg-input text-foreground"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    onChange(e.target.files[0]); // Store the selected file
                                }
                                }}
                            ref={ref}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                </div>
                
                <div className="w-full flex justify-between gap-20">
                    <Button type="button" className='mt-12 w-1/2 sm:w-min' onClick={()=> cancelEdit()}>Cancel</Button>
                    <Button type="submit" variant="secondary" className="mt-12 w-1/2 sm:w-min" disabled={!formState.isDirty}>Save Post</Button>
                </div>

            </form>
            </Form>
        </div>
    )
}