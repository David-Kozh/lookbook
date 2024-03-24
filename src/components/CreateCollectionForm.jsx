"use client"
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
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
import LeftButtonGroup from "./LeftButtons";
import RightButtonGroup from "./RightButtons";

// ** Form for Creating Collection

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    desc: z.string().optional(),
    thumbnail: z.any().refine(file => file instanceof File, {
        message: 'A file is required',
    }).optional(),
    displaySettings: z.object({
        font: z.string(),
        theme: z.string(),
        public: z.boolean(),
    }),
})

// ** Completed Form ✅ for Creating Collection (with validation)

export default function CreateCollectionForm({ selectedButton, currentIndex, setCurrentIndex, cancelCreate, openDialog, submitCollection, posts, removePost }) {
    const location = useLocation(); // URL location

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            thumbnail: undefined,
            displaySettings: {
                font: "sans",
                theme: "light",
                public: true,
            },
        }
    })
    
    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        console.log(values)
        
        var imgUrl = undefined;
        if(values.thumbnail){
            imgUrl = URL.createObjectURL(values.thumbnail);
        }

        // TODO: Must check that the posts array is not empty
        //* Submit the collection
        submitCollection({
            title: values.title,
            subtitle: values.subtitle,
            thumbnail: imgUrl,
            displaySettings: values.displaySettings,
            posts: posts,
        });
        cancelCreate();
    }

    useEffect(() => {
      // Get the current URL
      const url = window.location.href;
  
      // Extract the index from the URL
      const index = parseInt(url.split('#slide')[1], 10);
  
      // Update the current index
      if(isNaN(index)){
        window.location.hash = '#slide0';
        setCurrentIndex(0);
        console.log("Index is NaN");
      }
      else{
        setCurrentIndex(index);
      }
      console.log("selected carousel item changed to:", index);
    }, [location]);

    useEffect(() => { 
    // Set the current index to 0 when the page loads
    // This is necessary because the URL does not change when the page is refreshed
    // but the selectedIndex state does change when the page is refreshed (to default state) causing error (displays )
        window.onload = () => {
          window.location.hash = '#slide0';
          setCurrentIndex(0);
        };
    }, []);
    
    //TODO: 'carousel-img' : 'carousel-img-wide' - replaced by create-collection-carousel
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mt-4 w-full md:w-5/6 lg:w-2/3 flex flex-col sm:items-center justify-between px-2 pb-2">
            
            <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="w-full">
                        <div className="flex gap-4 items-center">
                        <FormLabel>Title</FormLabel>
                        <FormDescription>
                            Displayed on image track.
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
                name="subtitle"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="w-full">
                        <div className="flex gap-4 items-center">
                        <FormLabel>Subtitle</FormLabel>
                        <FormDescription>
                            Displayed under title. Can be left blank.
                        </FormDescription>
                        </div>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div id="create-collection-carousel" className="w-full flex justify-between sm:justify-center">
                
                <div className="w-[15%] flex items-center justify-center">
                    <LeftButtonGroup 
                        selectedButton={selectedButton}
                        selectedItemName={posts.length > 0 ? posts[currentIndex].title : null} 
                        openDialog={openDialog}
                        removePost={removePost} 
                    />
                </div>

                {posts.length > 0 ? (
                    <div className={`carousel shadow-lg shadow-black/40 ${posts[currentIndex].aspectRatio === '1:1' ? 'carousel-img' : 'carousel-img-wide'} create-collection-carousel`} 
                    style={{transition: 'width 0.3s 0.01s'}}>
                    {console.log(currentIndex, posts.length)}
                    {posts.map((post, index) => {
                        return (
                            <div id={`slide${index}`} className="carousel-item relative" key={index}
                                style={{opacity: `${currentIndex == index ? '1' : '0'}`,
                                    transition: 'opacity 0.3s 0.01s'}}
                            >    
                                <img
                                    className={`${(post.aspectRatio == '16:9' && 'carousel-img-wide') || ('carousel-img')} 
                                        drop-shadow-2xl shadow-inner shadow-black create-collection-carousel`}
                                    src={post.image}
                                    draggable="false"
                                />
                            </div>
                        )
                    })}
                </div>
                ) : (
                    <div className="create-collection-carousel mx-6 bg-gray-800 text-white flex justify-center items-center">
                        <h1 className="mb-2 w-full text-center">No posts yet!</h1>
                    </div>
                )
                }
                <div className="w-[14%] flex items-center justify-center ">
                    <RightButtonGroup selectedIndex={currentIndex} postsLength={posts.length}/>
                </div>
            </div>

            <div className="flex justify-between items-end gap-2 w-full">
                <Controller
                    name="thumbnail"
                    control={form.control}
                    render={({ field: { onChange, ref } }) => (
                        <FormItem>
                            <div className="grid gap-1.5">
                                <FormLabel>
                                    Thumbnail
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="displaySettings.theme"
                    control={form.control}
                    render={({ field }) => (
                        <div className="grid gap-1.5">
                        <FormLabel>
                            Theme
                        </FormLabel>
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Light" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        </div>
                    )}
                />
                <FormField
                    name="displaySettings.font"
                    control={form.control}
                    render={({ field }) => (
                        <div className="grid gap-1.5">
                        <FormLabel>
                            Theme
                        </FormLabel>
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Sans" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sans" className='font-sans'>Sans</SelectItem>
                                <SelectItem value="mono" className='font-mono'>Mono</SelectItem>
                                <SelectItem value="serif" className='font-serif'>Serif</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        </div>
                    )}
                />
            </div>
            <div className="w-full flex justify-between h-min items-center my-2">
                
                <Button type="button" className='bg-zinc-800 hover:bg-zinc-700' onClick={()=> cancelCreate()}>Cancel</Button>
                
                <div className="w-full h-min mx-6 flex justify-end">
                <FormField
                        name="displaySettings.public"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className='flex gap-1 items-center h-min mb-1.5'>
                                    <FormLabel className='mt-1.5'>
                                        Public
                                    </FormLabel>
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className='ml-2'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                />
                </div>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    </Form>
    );
}