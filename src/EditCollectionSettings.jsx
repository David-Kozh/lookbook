import { useState, useEffect } from 'react'
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
import { encodeCollectionTitle } from "@/services/collectionService"

// ** Zod Schema for Form Validation
const formSchema = z.object({
    title: z.string()
        .min(2, { message: "Title must be at least 2 characters." })
        .max(50, { message: "Title must be 50 characters or less." })
        .regex(/^[a-zA-Z0-9\s-_]+$/, { message: "Title can only contain letters, numbers, spaces, hyphens, and underscores." }),
    subtitle: z.string().optional(),
    thumbnail: z.any()
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
    displaySettings: z.object({
        font: z.string(),
        theme: z.string(),
        public: z.boolean(),
    }),
})

//TODO Check use of image files in the thumbnail field
//* ✅ Ready for testing with firebase db and storage
export default function EditCollectionSettings({ loggedInUserId, collection, cancelEditSettings, userCollections }) {
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: collection.title,
            subtitle: collection.subtitle,
            thumbnail: undefined,
            displaySettings: {
                font: collection.displaySettings?.font || 'sans',
                theme: collection.displaySettings?.theme || 'light',
                public: collection.displaySettings?.public || false,
            },
        }
    });

    const { formState } = form;
    const [isTitleValid, setIsTitleValid] = useState(true);

    useEffect(() => {
        const checkTitle = async () => {
            const encodedTitle = encodeCollectionTitle(form.watch("title"));
            const isUnique = !userCollections.some(
                (collection) => encodeCollectionTitle(collection.title) === encodedTitle
            );
            setIsTitleValid(isUnique);
        };
    
        if (form.watch("title")) {
            checkTitle();
        }
    }, [form.watch("title")]);
    
    async function onSubmit(values) {
        if(!isTitleValid) {
            console.log('Title is not valid');
            return;
        }
        console.log(values);
        const updatedData = {}; //* Prune data of unchanged fields before updating

        if (values.title !== collection.title) {
            updatedData.title = values.title;
        }
        if (values.subtitle !== collection.subtitle) {
            updatedData.subtitle = values.subtitle;
        }
        if (values.thumbnail) {
            updatedData.thumbnailFile = values.thumbnail;
        }
        if (values.displaySettings.font !== collection.displaySettings.font) {
            updatedData.displaySettings = { ...updatedData.displaySettings, font: values.displaySettings.font };
        }
        if (values.displaySettings.theme !== collection.displaySettings.theme) {
            updatedData.displaySettings = { ...updatedData.displaySettings, theme: values.displaySettings.theme };
        }
        if (values.displaySettings.public !== collection.displaySettings.public) {
            updatedData.displaySettings = { ...updatedData.displaySettings, public: values.displaySettings.public };
        }
        
        if (Object.keys(updatedData).length > 0) {
            await updateCollection(
                loggedInUserId,
                collection.id,
                updatedData
            );
            cancelEditSettings();
            window.location.reload();
        } else {
            console.log('No changes detected');
        }
    }

    return (
        <div id='edit-collection-settings' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-1 mb-2 text-xl sm:text-2xl xl:text-4xl font-bold select-none">Collection Settings</div>
            <div className="h-0.5 w-full rounded-full bg-card-foreground dark:opacity-50 my-1"></div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mt-8 w-full md:w-5/6 lg:w-2/3 flex flex-col sm:items-center space-y-10">
                    
                    <FormField name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex gap-4 items-center">
                                    <FormLabel>Title</FormLabel>
                                    <FormDescription>
                                        Displays next to posts.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage>
                                    {!isTitleValid && "This title is already in use. Please choose a different one."}
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField name="subtitle"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full opacity-60 hover:opacity-100">
                                <div className="flex gap-4 items-center">
                                    <FormLabel>Subtitle</FormLabel>
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

                    <Controller name="thumbnail"
                        control={form.control}
                        render={({ field: { onChange, ref } }) => (
                            <FormItem className={`${
                                form.watch('thumbnail') ? 'opacity-100' : 'opacity-60'
                              } hover:opacity-100 w-full`}>
                                <div className="grid gap-1.5">
                                    <div className="flex gap-4 items-center">
                                        <FormLabel>
                                            Thumbnail
                                        </FormLabel>
                                        <FormDescription>
                                            First post image used if not provided.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                    <Input type="file"
                                        onChange={(e) => {
                                            if (e.target.files.length > 0) {
                                            onChange(e.target.files[0]); // store file
                                            }
                                        }}
                                        className="file-input-ghost"
                                        ref={ref}
                                    />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between items-end w-full">
                        <FormField name="displaySettings.theme"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-1.5">
                                    <FormLabel>
                                        Theme
                                    </FormLabel>
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-[100px] bg-input">
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
                        <FormField name="displaySettings.font"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-1.5">
                                    <FormLabel>
                                        Font
                                    </FormLabel>
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-[100px] bg-input">
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
                        <FormField name="displaySettings.public"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex gap-3 items-start m-3'>
                                        <FormLabel className='mt-2'>
                                            Public
                                        </FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex justify-between h-[15%] items-center">
                        
                        <Button type="button" onClick={()=> cancelEditSettings()}>Cancel</Button>
                        <Button type="submit" variant="secondary" disabled={!formState.isDirty}>Submit</Button>
                    </div>
                </form>
            </Form>
        
        </div>
    )
}