import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { DialogFooter } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

// ** Completed Form ✅ for Creating Post in a Dialog (with validation)
// ** Next Stage : Backend Integration
// TODO: Implement cloud storage for images and content
// TODO: Implement database storage for collections

export default function CreatePostForm({ addPost, dismiss }) {

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
    console.log('submitting form');
    console.log(values);

    // TODO: Additionally make sure the file extensions match the content type 
    if ((values.contentType === 'mp4' || values.contentType === 'mp3') && !(values.content instanceof File)) {
      form.setError('content', {
          type: 'manual',
          message: 'A file is required',
      });
      return;
    }

    // TODO: Change to an upload to cloud storage
    const imageUrl = URL.createObjectURL(values.image);
    const contentUrl = values.content ? URL.createObjectURL(values.content) : undefined;
    
    //* Create a new post with the form input data
    addPost({
      title: values.title,
      description: values.description,
      image: imageUrl, //! passing src url for development to "simulate" cloud storage
      aspectRatio: values.aspectRatio,
      contentType: values.contentType,
      content: contentUrl,
    })
    dismiss('create');
  }

  return(
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col space-y-8 px-1"
    >
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
                <Input className='bg-slate-300' {...field} />
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
            <FormLabel>Caption</FormLabel>
            <FormDescription>
              Can be left blank.
            </FormDescription>
            </div>
            <FormControl>
                <Input className='bg-slate-300' {...field} />
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
                  className='bg-slate-600 text-slate-100 sm:text-white'
                  ref={ref}
                />
              </FormControl>
            </div>
            {form.formState.errors.image && <FormMessage>{form.formState.errors.image.message}</FormMessage>}
          </FormItem>
        )}
      />

      {/* replace with radio group? */}
      <div className="flex w-full gap-4">
        <FormField 
        name="aspectRatio"
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-[35%]'>
            <Select onValueChange={field.onChange} defaultValue={field.value}>

              <SelectTrigger className="w-full bg-slate-300 mt-2 font-semibold">
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
            <FormItem className='w-[65%]'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-slate-300 mt-2 font-semibold">
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

      <DialogFooter>
        <Button type="submit" className="mt-8">Save Post</Button>
      </DialogFooter>

    </form>
  </Form>
  )
}