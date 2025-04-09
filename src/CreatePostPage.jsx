import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { createPost } from "./services/postService";

//* Zod Schema for Form Validation
const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    image: z.any().refine(file => file instanceof File, {
        message: 'A file is required',
    }),
    aspectRatio: z.string(),
    description: z.string().optional(),
    postType: z.string(),
    content: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }),
    
})

//* ✅ Ready for testing with firebase db and storage
//* This component is rendered in UserDashboard.jsx
//* > Rendered when the user clicks the "Create" button in the EditCollection component
//* > Used to create a new post in the collection, then return user to EditCollection
export default function CreatePostPage({ cancelCreate, collectionId, loggedInUserId }) {
    const form = useForm({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            image: null,
            aspectRatio: '1:1',
            postType: 'default',
            content: undefined,
        },
    });
    const { formState } = form;
    const postTypeWatch = form.watch('postType');
    
    //* Submit handler calls db and cloud storage
    async function onSubmit(values) {
        // TODO: Additionally make sure the file extensions match the content type 
        if ((values.postType === 'mp4' || values.postType === 'mp3') && !(values.content instanceof File)) {
            form.setError('content', {
                type: 'manual',
                message: 'A file is required',
            });
            return;
        }
        
        const updatedData = {}; //* Prune data of unchanged fields before updating

        if (values.title) updatedData.title = values.title;
        if (values.description) updatedData.description = values.description;
        if (values.image) updatedData.imageFile = values.image;
        if (values.aspectRatio) updatedData.aspectRatio = values.aspectRatio;
        if (values.postType) updatedData.postType = values.postType;
        if (values.content) updatedData.contentFile = values.content;
        
        if(updatedData) {   //* Create a new post with the form input data, through postService.js
            try {
                await createPost(loggedInUserId, collectionId, updatedData)
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
        cancelCreate(); // Close the form (returns the user to EditCollection)
    }
    
    return (
        <div id='create-post' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 mb-2 text-2xl font-bold select-none">New Post</div>
            <div className="h-0.5 w-full rounded-full bg-card-foreground dark:opacity-50 my-1"></div>
            <div className="w-full ml-4 mt-1 font-semibold text-sm text-card-foreground/70">
                Upload your work here. Click save when you're done.
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-4/5 w-full mt-6 px-2">
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
                            <FormLabel>
                                Caption
                            </FormLabel>
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
                                <Input 
                                    type="file"
                                    className="file-input-ghost"
                                    onChange={(e) => {
                                      onChange(e.target.files[0]); // store file
                                    }}
                                    ref={ref}
                                />
                            </FormControl>
                        </div>
                        {form.formState.errors.image && <FormMessage>{form.formState.errors.image.message}</FormMessage>}
                    </FormItem>
                )}
                />

                <div className="flex w-full gap-4 my-4">
                <FormField name="aspectRatio"
                control={form.control}
                render={({ field }) => (
                    <FormItem className='w-[35%]'>
                        <FormLabel>
                            Aspect Ratio
                        </FormLabel>
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
                    <FormItem className='w-[60%]'>
                        <FormLabel>
                            Post Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-input text-foreground mt-2 font-semibold">
                            <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent className="font-semibold">
                            <SelectItem value="default">No Content </SelectItem>
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
                            <FormLabel className={`${(postTypeWatch === 'mp4' || postTypeWatch === 'mp3') ? '' : 'text-slate-500' }`}>
                                Additional Content
                            </FormLabel>
                            <FormControl>
                                <Input type="file"
                                    className="file-input-ghost"
                                    onChange={(e) => {
                                      onChange(e.target.files[0]); 
                                    }}
                                    disabled={!(postTypeWatch === 'mp4' || postTypeWatch === 'mp3')}
                                    ref={ref}
                                />
                            </FormControl>
                        </div>
                        {form.formState.errors.content && <FormMessage>{form.formState.errors.content.message}</FormMessage>}
                    </FormItem>
                )}
                />
                <div className="w-full flex justify-between gap-20">
                    <Button type="button" className='mt-12 w-1/2 sm:w-min' onClick={()=> cancelCreate()}>Cancel</Button>
                    <Button type="submit" variant="secondary" className="mt-12 w-1/2 sm:w-min" disabled={!formState.isDirty}>Save Post</Button>
                </div>
            </form>
        </Form>
        </div>
    )
}