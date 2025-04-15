import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.any()        
    .refine(file => file === undefined || file instanceof File, {
      message: 'A file is required',
    })
    .refine(file => file === undefined || file.size <= 5 * 1024 * 1024, {
      message: 'File size must be 5MB or less',
    })
    .refine(file => file === undefined || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Only JPG or PNG files are allowed',
    }),
  aspectRatio: z.string(),
  content: z.any()        
    .refine(file => file instanceof File || file === undefined, {
      message: 'A file is required',
    })
    .refine(file => {
      if (file === undefined) return true;
      if (file.type.startsWith('audio/') && file.size <= 10 * 1024 * 1024) return true; // 10MB for audio
      if (file.type.startsWith('video/') && file.size <= 50 * 1024 * 1024) return true; // 50MB for video
      return false;
    }, {
      message: 'Audio files must be 10MB or less, and video files must be 50MB or less.',
    })
    .refine(file => file === undefined || ['audio/mp3', 'audio/wav', 'video/mp4', 'video/quicktime'].includes(file.type), {
      message: 'Only MP3, WAV, MP4, or MOV files are allowed.',
    }),
})

//* ✅ Ready for testing with firebase db and storage
//* This component is used in CreateCollection.jsx (parent component) 
export default function CreatePostForm({ addPost, dismiss }) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined,
      aspectRatio: '1:1',
      content: undefined,
      createdAt: new Date(),
    },
  });
  const { formState } = form;
      
  //* Submit handler passes the post to CreateCollection.jsx,
  //* which will process the final set of posts when the collection is submitted.
  //* This allows this post to be edited or deleted, before being uploaded, preserving resources
  function onSubmit(values) {
    if(!values.image) return;
    console.log('submitting form', values);

    // Determine the post type based on the content file's MIME type
    let postType = null;
    if (values.content instanceof File) {
      const mimeType = values.content.type;
      if (mimeType.startsWith('audio/')) {
        postType = 'audio';
      } else if (mimeType.startsWith('video/')) {
        postType = 'video';
      }
    } else {
      postType = 'default';
    }

    //* Create a new post object with the form input data
    const newPost = {
      title: values.title,
      description: values.description,
      imageFile: values.image,
      aspectRatio: values.aspectRatio,
      postType,
    };
    
    // Conditionally add contentFile if it exists
    if (values.content) {
      newPost.contentFile = values.content;
    };

    addPost(newPost);
    dismiss('create');
  }

  return(
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col space-y-8 px-1">
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

      <Controller name="image"
        control={form.control}
        render={({ field: { onChange, ref } }) => (
          <FormItem>
            <div className="grid gap-1.5">
              <FormLabel className={`${form.formState.errors.image && 'text-red-500'}`}>
                Image
              </FormLabel>
              <FormControl>
                <Input type="file"
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

      <div className="flex w-full gap-4">
        <FormField name="aspectRatio"
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-[35%]'>
            <FormLabel>Aspect Ratio</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              
              <SelectTrigger className="w-full bg-input font-semibold">
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
        <Controller name="content"
          control={form.control}
          render={({ field: { onChange, ref } }) => (
            <FormItem className={`${form.watch('image') ? 'opacity-50 hover:opacity-100' : ''} w-[65%]`}>
              <FormLabel className={`${form.watch('image') ? '' : 'opacity-50'}`}>
                Optional Video/Audio
              </FormLabel>
              <FormControl>
              <Input type="file"
                className="file-input-ghost"
                onChange={(e) => {
                  onChange(e.target.files[0]);
                }}
                disabled={!form.watch('image')}
                ref={ref}
              />
              </FormControl>
            </FormItem>
          )}
        />
      </div>



      <DialogFooter>
        <Button type="submit" variant="secondary" className="mt-8" disabled={!formState.isDirty}>Save Post</Button>
      </DialogFooter>
    </form>
  </Form>
  )
}