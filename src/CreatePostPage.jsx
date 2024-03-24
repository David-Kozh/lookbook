import { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
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


// ** Zod Schema for Form Validation
const formSchema = z.object({

    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    image: z.any().refine(file => file instanceof File, {
        message: 'A file is required',
    }),
    aspectRatio: z.string(),
    description: z.string().optional(),
    contentType: z.string(),
    content: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }),
    
})

// ** Completed Form ✅ for Creating Post (with validation)
// ** Next Stage : Backend Integration
// TODO: Implement cloud storage for images and content
// TODO: Implement database storage for collections

export default function CreatePost({ cancelCreate, addPost }) {
  
    const form = useForm({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            image: null,
            aspectRatio: '1:1',
            contentType: 'default',
            content: undefined,
        },
    });

    const contentTypeWatch = form.watch('contentType');
    
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        console.log(values)
        
        // TODO: Additionally make sure the file extensions match the content type 
        if ((values.contentType === 'mp4' || values.contentType === 'mp3') && !(values.content instanceof File)) {
            form.setError('content', {
                type: 'manual',
                message: 'A file is required',
            });
            return;
        }

        //! Create url for image (so it can be displayed in development)
        //! In production, urls will be created with cloud storage in the backend, and then stored in the database
        const imageUrl = URL.createObjectURL(values.image);
        const contentUrl = values.content ? URL.createObjectURL(values.content) : undefined;

        // Create a new post with the form input data
        addPost({
            title: values.title,
            description: values.description,
            image: imageUrl, //! passing src url for development to "simulate" cloud storage
            aspectRatio: values.aspectRatio,
            contentType: values.contentType,
            content: contentUrl,
        })
        cancelCreate();
    }
    
    return (
        <div id='create-post' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 text-2xl font-bold select-none text-zinc-800">New Post</div>
            <div className="w-full ml-4 mt-1 font-semibold text-sm text-zinc-600">
                Upload your work here. Click save when you're done.
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-4/5 w-full mt-8 px-2">
                <FormField
                name="title"
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
                <FormField
                name="description"
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
                <Controller
                name="image"
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
                                    onChange={(e) => {
                                      onChange(e.target.files[0]); // store file
                                    }}
                                    className='bg-slate-600 text-white'
                                    ref={ref}
                                />
                            </FormControl>
                        </div>
                        {form.formState.errors.image && <FormMessage>{form.formState.errors.image.message}</FormMessage>}
                    </FormItem>
                )}
                />

                {/* replace with radio group */}
                <div className="flex w-full gap-4 my-4">
                <FormField 
                name="aspectRatio"
                control={form.control}
                render={({ field }) => (
                    <FormItem className='w-[35%]'>
                        <FormLabel>
                            Aspect Ratio
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-slate-200 mt-2 font-semibold">
                            <SelectValue placeholder="Aspect Ratio" />
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
                <FormField 
                name="contentType"
                control={form.control}
                render={({ field }) => (
                    <FormItem className='w-[60%]'>
                        <FormLabel>
                            Post Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-slate-200 mt-2 font-semibold">
                            <SelectValue placeholder="Content Type" />
                        </SelectTrigger>
                        <SelectContent className="font-semibold">
                            <SelectItem value="default">Default - no additional content </SelectItem>
                            <SelectItem value="mp4">Additional video content</SelectItem>
                            <SelectItem value="mp3">Additional audio content</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
                </div>

                <Controller
                name="content"
                control={form.control}
                render={({ field: { onChange, ref } }) => (
                    <FormItem>
                        <div className="grid gap-1.5">
                            <FormLabel className={`${(contentTypeWatch === 'mp4' || contentTypeWatch === 'mp3') ? '' : 'text-slate-500' }`}>
                                Additional Content
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    type="file"
                                    onChange={(e) => {
                                      onChange(e.target.files[0]); // store file
                                    }}
                                    className='bg-slate-600 text-white'
                                    disabled={!(contentTypeWatch === 'mp4' || contentTypeWatch === 'mp3')}
                                    ref={ref}
                                />
                            </FormControl>
                        </div>
                        {form.formState.errors.content && <FormMessage>{form.formState.errors.content.message}</FormMessage>}
                    </FormItem>
                )}
                />
                <div className="w-full flex justify-between gap-20">
                    <Button type="button" className='mt-12 w-1/2 sm:w-min bg-zinc-800 hover:bg-zinc-700' onClick={()=> cancelCreate()}>Cancel</Button>
                    <Button type="submit" className="mt-12 w-1/2 sm:w-min">Save Post</Button>
                </div>

            </form>
        </Form>

        </div>
    )
}