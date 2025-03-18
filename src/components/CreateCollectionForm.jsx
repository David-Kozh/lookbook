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

//* Form rendered in CreateCollection.jsx
//* ✅ Ready for testing with firebase db and storage
export default function CreateCollectionForm({ selectedButton, currentIndex, setCurrentIndex, cancelCreate, openDialog, submitCollection, posts, removePost }) {
    const location = useLocation(); // URL location
    const [imageUrls, setImageUrls] = useState([]);

    //* Create a URL for each image file in the posts array, to be displayed in the carousel
    useEffect(() => {
        const urls = posts.map(post => {
          if (post.imageFile) {
            return URL.createObjectURL(post.imageFile);
          }
          return null;
        });
        setImageUrls(urls);
    
        // Clean up the URL objects when the component unmounts or posts change
        return () => {
          urls.forEach(url => {
            if (url) {
              URL.revokeObjectURL(url);
            }
          });
        };
      }, [posts]);

    //* Collection Form
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
    
    //* Submit Handler takes the data for the Collection, and calls the submitCollection function,
    //* which will process the final set of posts when the collection is submitted.
    function onSubmit(values) {
        console.log(values)

        //* Submit the collection
        if(posts.length > 0){ 
            submitCollection({
                title: values.title,
                subtitle: values.subtitle,
                thumbnail: values.thumbnail,
                displaySettings: values.displaySettings,
            }, posts);
            cancelCreate();
        }
    }

    useEffect(() => {
      const url = window.location.href;     // Get current URL
      const index = parseInt(url.split('#slide')[1], 10);   // Extract index from URL
  
      if(isNaN(index)){     // Update current index
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
    //* Set current index to 0 when the page loads.
    //  > Necessary since URL doesn't change when page is refreshed
    //  but selectedIndex state returns to default state causing error
        window.onload = () => {
          window.location.hash = '#slide0';
          setCurrentIndex(0);
        };
    }, []);
    
    //? TODO: 'carousel-img' : 'carousel-img-wide' - replaced by create-collection-carousel
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
                                    src={post.imageFile}
                                    draggable="false"
                                />
                            </div>
                        )
                    })}
                </div>
                ) : (
                    <div className="create-collection-carousel mx-6 bg-gray-800 text-white flex justify-center items-center">
                        <h1 className="mb-2 w-full text-center">No Posts Yet!</h1>
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