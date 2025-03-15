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

import { updateCollection } from "./services/collectionService"

// ** Zod Schema for Form Validation
const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    desc: z.string().optional(),
    thumbnail: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }).optional(),
    displaySettings: z.object({
        font: z.string(),
        theme: z.string(),
        public: z.boolean(),
    }),
})

// Completed component for editing collection settings
export default function EditCollectionSettings({ loggedInUserId, collection, cancelEditSettings }) {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: collection.title,
            subtitle: collection.subtitle,
            thumbnail: undefined,
            displaySettings: collection.displaySettings
        }
    })
    
    function onSubmit(values) {
        console.log(values)
        
        var imageUrl = collection.thumbnail;
        if(values.thumbnail){
          imageUrl = '';//URL.createObjectURL(values.thumbnail);
          // TODO: Change to an update to the cloud storage
        }
        // TODO: Change to an update to the database
        updateCollection(
            loggedInUserId,
            collection.id,
            {
                title: values.title,
                subtitle: values.subtitle,
                thumbnail: imageUrl,
                displaySettings: values.displaySettings,
            })
        cancelEditSettings();
    }

    return (
        <div id='edit-collection-settings' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 text-2xl font-bold select-none text-zinc-800">Collection Settings</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mt-8 w-full md:w-5/6 lg:w-2/3 flex flex-col sm:items-center space-y-10">
                    
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
                                                if (e.target.files.length > 0) {
                                                onChange(e.target.files[0]); // store file
                                                }
                                            }}
                                            className='bg-slate-600 text-slate-100 sm:text-white'
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
                                            <SelectValue placeholder="Theme" />
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
                                        Font
                                    </FormLabel>
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Font" />
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
                    <div className="w-full flex justify-between h-[15%] items-center">
                        
                        <Button type="button" className='bg-zinc-800 hover:bg-zinc-700' onClick={()=> cancelEditSettings()}>Cancel</Button>
                        
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
        
        </div>
    )
}