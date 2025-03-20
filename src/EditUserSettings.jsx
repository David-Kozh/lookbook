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
import { updateUser } from "./services/userService"

// ** Zod Schema for Form Validation
const formSchema = z.object({
    displayName: z.string().min(2, {
      message: "Display name must be at least 2 characters.",
    }),
    bio: z.string().optional(),
    photo: z.any().refine(file => file instanceof File || file === undefined, {
        message: 'A file is required',
    }).optional(),
    publicProfile: z.boolean(),
})

export default function EditUserSettings({ loggedInUserId, userProfile, cancelEditSettings }) {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: userProfile.displayName,
            bio: userProfile.bio,
            photo: undefined,
            publicProfile: userProfile.publicProfile
        }
    })
    
    async function onSubmit(values) {
        console.log(values)
        
        await updateUser(
            loggedInUserId,
            {
                displayName: values.displayName,
                bio: values.bio,
                photoFile: values.photo,
                publicProfile: values.publicProfile,
            }
        );
        cancelEditSettings();
    }

    return (
        <div id='edit-user-settings' className="w-full h-full flex flex-col items-center">
            <div className="w-full mt-2 ml-2 text-2xl font-bold select-none text-zinc-800">User Settings</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mt-8 w-full md:w-5/6 lg:w-2/3 flex flex-col sm:items-center space-y-10">
                    
                    <FormField name="displayName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <div className="flex gap-4 items-center">
                                <FormLabel>Display Name</FormLabel>
                                <FormDescription>
                                    Displayed on your profile.
                                </FormDescription>
                                </div>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Bio</FormLabel>
                                <FormDescription>
                                    A short description about yourself.
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
                        <Controller name="photo"
                            control={form.control}
                            render={({ field: { onChange, ref } }) => (
                                <FormItem>
                                    <div className="grid gap-1.5">
                                        <FormLabel>
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
                                            className='bg-slate-600 text-slate-100 sm:text-white'
                                            ref={ref}
                                        />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full flex justify-between h-[15%] items-center">
                        
                        <Button type="button" className='bg-zinc-800 hover:bg-zinc-700' onClick={()=> cancelEditSettings()}>Cancel</Button>
                        
                        <div className="w-full h-min mx-6 flex justify-end">
                        <FormField
                            name="publicProfile"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex gap-1 items-center h-min mb-1.5'>
                                        <FormLabel className='mt-1.5'>
                                            Public Profile
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
