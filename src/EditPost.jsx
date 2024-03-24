import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from 'react-hook-form';
 
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
    image: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }).optional(),
    aspectRatio: z.string(),
    description: z.string().optional(),
    contentType: z.string().optional(),
    content: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }),
    // Other post fields...
})

// ** Form for Creating Post
// TODO: UPDATE File handling (Controller, Schema, etc)
// TODO: Implement updatePost() function from parent

export default function EditPost({ cancelEdit, post, updatePost }) {
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post.title,
            description: post.description,
            image: undefined,
            aspectRatio: post.aspectRatio,
            contentType: post.contentType,
            content: undefined,
        }
    });
    const contentType = form.watch('contentType');
      
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        console.log(values)
        
        // TODO: Additionally make sure the file extensions match the content type 
        // TODO: Check post.content so that posts with non-updated content are not dis-allowed
        if ((values.contentType === 'mp4' || values.contentType === 'mp3') && !(values.content instanceof File)) {
            form.setError('content', {
                type: 'manual',
                message: 'A file is required',
            });
            return;
        }
        var imageUrl = post.image;
        if(values.image){
          imageUrl = URL.createObjectURL(values.image);
          // TODO: Change to an upload to cloud storage
        }
        var contentUrl = post.content;
        if(values.content){
          contentUrl = URL.createObjectURL(values.content);
          // TODO: Change to an upload to cloud storage
        }
        
        //* Update post with the form input data
        updatePost({
            title: values.title,
            description: values.description,
            image: imageUrl, //! passing src url for development to "simulate" cloud storage
            aspectRatio: values.aspectRatio,
            contentType: values.contentType,
            content: contentUrl,
        })
        cancelEdit();
    }
      
    return (
        <div id='edit-post' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 text-2xl font-bold select-none text-zinc-800">Edit Post</div>
            <div className="w-full mt-1 ml-4 font-semibold text-sm text-zinc-600">
                Update your work here. Click save when you're done.
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-4/5 w-full px-2 mt-8">
                <FormField
                control={form.control}
                name="title"
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
                control={form.control}
                name="description"
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
                                if (e.target.files.length > 0) {
                                onChange(e.target.files[0]); // store file
                                }
                            }}
                            className='bg-slate-600 text-slate-100 sm:text-white'
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
                <FormField 
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                    <FormItem className='w-[35%]'>
                        <FormLabel>Aspect Ratio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-slate-100 mt-2 font-semibold">
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
                control={form.control}
                name="contentType"
                render={({ field }) => (
                    <FormItem className='w-[65%]'>
                        <FormLabel>Post Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full bg-slate-100 mt-2 font-semibold">
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
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <div className="grid gap-1.5">
                            <FormLabel className={`${(contentType === 'mp4' || contentType === 'mp3') ? '' : 'text-slate-500' }`}>
                                Additional Content
                            </FormLabel>
                            <FormControl>
                                <Input 
                                id="picture" 
                                type="file" 
                                className='bg-slate-600 text-slate-100 sm:text-white'
                                disabled={!(contentType === 'mp4' || contentType === 'mp3')}
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="w-full flex justify-between gap-20">
                    <Button type="button" className='mt-12 w-1/2 sm:w-min bg-zinc-800 hover:bg-zinc-700' onClick={()=> cancelEdit()}>Cancel</Button>
                    <Button type="submit" className="mt-12 w-1/2 sm:w-min">Save Post</Button>
                </div>

            </form>
        </Form>

        </div>
    )
}