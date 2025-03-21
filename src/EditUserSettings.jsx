import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import ChangePassword from "./components/ChangePassword"
import { updateUser } from "./services/userService"

// ** Zod Schema for Form Validation
const formSchema = z.object({
    displayName: z.string().min(2, {
      message: "Display name must be at least 2 characters.",
    }),
    handle: z.string().min(2, {
        message: "Display name must be at least 2 characters.",
      }),
    bio: z.string().optional(),
    photo: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }).optional(),
    socialMediaLinks: z.object({
        linkedin: z.string().url().refine(url => url.includes('linkedin.com'), {
            message: "LinkedIn URL must contain 'linkedin.com'",
        }).or(z.literal('')).optional(),
        youtube: z.string().url().refine(url => url.includes('youtube.com'), {
            message: "YouTube URL must contain 'youtube.com'",
        }).or(z.literal('')).optional(),
        instagram: z.string().url().refine(url => url.includes('instagram.com'), {
            message: "Instagram URL must contain 'instagram.com'",
        }).or(z.literal('')).optional(),
        twitter: z.string().url().refine(url => url.includes('x.com'), {
            message: "X URL must contain 'x.com'",
        }).or(z.literal('')).optional(),
    }).optional(),
})

//* Component for editing user settings
//*     Rendered in the /bio page
//TODO  Delete User button
export default function EditUserSettings({ loggedInUserId, userProfile, cancelEditSettings }) {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: userProfile.displayName,
            handle: userProfile.handle,
            bio: userProfile.bio,
            photo: undefined, //? Should we display the current photo
            socialMediaLinks: {
                linkedin: userProfile.socialMediaLinks?.linkedin || '',
                youtube: userProfile.socialMediaLinks?.youtube || '',
                instagram: userProfile.socialMediaLinks?.instagram || '',
                twitter: userProfile.socialMediaLinks?.twitter || '',
            },
        }
    })
    
    async function onSubmit(values) {
        console.log(values)
        const updatedData = {}; //* Prune data of unchanged fields before updating

        if (values.displayName !== userProfile.displayName) {
            updatedData.displayName = values.displayName;
        }
        if (values.handle !== userProfile.handle) {
            updatedData.handle = values.handle;
        }
        if (values.bio !== userProfile.bio) {
            updatedData.bio = values.bio;
        }
        if (values.photo) {
            updatedData.photoFile = values.photo;
        }
        if (JSON.stringify(values.socialMediaLinks) !== JSON.stringify(userProfile.socialMediaLinks)) {
            updatedData.socialMediaLinks = values.socialMediaLinks;
        }
        
        if (Object.keys(updatedData).length > 0) {
            await updateUser(loggedInUserId, updatedData);
        }

        cancelEditSettings();
        window.location.reload();
    }

    return (
        <div id='edit-user-settings' className="w-full h-full flex flex-col items-center">
            <div className="w-full h-min">
                <div className="w-full flex justify-between items-center">
                    <div className="w-full mt-2 ml-1 text-2xl font-bold select-none text-zinc-800">User Settings</div>
                    <ChangePassword />
                </div>
                
                <div className="h-0.5 rounded-lg bg-zinc-700 my-1"></div>
            </div>
            
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mt-8 w-full md:w-5/6 lg:w-2/3 flex flex-col sm:items-center justify-between">
                    
                    <FormField name="displayName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex gap-4 items-center">
                                <FormLabel className='text-md'>Display Name</FormLabel>
                                <FormDescription className='mt-0.5'>
                                    Displayed on your profile.
                                </FormDescription>
                                </div>
                                <FormControl>
                                    <Input className='text-md' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField name="handle"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex gap-4 items-center">
                                <FormLabel className='text-md'>Handle</FormLabel>
                                <FormDescription className='mt-0.5'>
                                    Displayed on your profile.
                                </FormDescription>
                                </div>
                                <FormControl>
                                    <Input className='text-md' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField name="bio"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex gap-4 items-center">
                                <FormLabel className='text-md'>Bio</FormLabel>
                                <FormDescription className='mt-0.5'>
                                    A short description about yourself.
                                </FormDescription>
                                </div>
                                <FormControl>
                                    <Textarea className='text-md' {...field} rows={4} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-end gap-2 w-full">
                        <Controller name="photo"
                            control={form.control}
                            render={({ field: { onChange, ref } }) => (
                                <FormItem>
                                    <div className="grid gap-1.5">
                                        <FormLabel className='text-md'>
                                            Profile Photo
                                        </FormLabel>
                                        <FormControl>
                                        <Input 
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files.length > 0) {
                                                onChange(e.target.files[0]); // store file
                                                }
                                            }}
                                            className='bg-slate-600 text-slate-100'
                                            ref={ref}
                                        />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Social Media links */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button type="button" className="">Add Social Media Links</Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-4">
                                    <div className="grid gap-4">
                                        <FormField name="socialMediaLinks.linkedin"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>LinkedIn</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="LinkedIn URL" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField name="socialMediaLinks.youtube"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>YouTube</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="YouTube URL" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField name="socialMediaLinks.instagram"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Instagram</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Instagram URL" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField name="socialMediaLinks.twitter"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Twitter</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Twitter URL" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        
                    </div>
                    <div className="h-0.5 w-full rounded-lg bg-zinc-700 mb-1 mt-10"></div>
                    <div className="w-full flex justify-between h-[15%] items-center">
                        
                        <Button type="button" className='' onClick={()=> cancelEditSettings()}>Cancel</Button>
                        
                        <div className="w-full h-min mx-6 flex justify-around">
                        <Button type="button" className='bg-[#602c2c] hover:bg-[#cd3d3d] font-bold italic' onClick={()=> cancelEditSettings()}> Delete Account </Button>
                        </div>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        
        </div>
    )
}
