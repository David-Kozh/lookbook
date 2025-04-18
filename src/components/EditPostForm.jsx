import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';


// Default Values not supported for file inputs
// Will require consideration to implement cloud storage
const formSchema = z.object({
  title: z.string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(50, { message: "Title must be 50 characters or less." }),
  image: z.any()
    .refine(file => file instanceof File || file === undefined, {
      message: 'A file is required',
    })
    .refine(file => file === undefined || file.size <= 8 * 1024 * 1024, {
      message: 'File size must be 8MB or less',
    })
    .refine(file => file === undefined || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Only JPG or PNG files are allowed',
    })
    .optional(),
  aspectRatio: z.string(),
  description: z.string()
    .max(250, { message: "Description must be 250 characters or less." })
    .optional(),
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

//? TODO: Integrate with edit button in CreateCollection > CreateCollectionForm > LeftButtons
//? TODO: When editing a post with additional content, must check post.content (line 70)
export default function EditPostForm({ post, updatePost, dismiss }) {

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      image: undefined,
      aspectRatio: post.aspectRatio,
      content: undefined,
    },
  });
  const { formState } = form;
      
  function onSubmit(values) {
    console.log('submitting form');
    console.log(values);

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

    //* Update post with the form input data
    updatePost({
      title: values.title,
      description: values.description,
      imageFile: values.image, 
      aspectRatio: values.aspectRatio,
      postType,
      contentFile: values.content,
    })
    dismiss('edit');
  }

  return(
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col space-y-8 px-1"
    >
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
        render={({ field: { onChange, ref }, fieldState: { error } }) => (
          <FormItem>
            <div className="grid gap-1.5">
              <FormLabel >
                New Image
              </FormLabel>
              <FormControl>
                <Input type="file"
                  className={`file-input-ghost ${
                    error ? 'border-red-500' : ''
                  }`}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      onChange(e.target.files[0]); // store file
                    }
                  }}
                  ref={ref}
                />
              </FormControl>
              {post.imageFile && (
                <p className="text-sm text-zinc-500 mt-1">
                  Current Image: {post.imageFile.name || 'Uploaded Image'}
                </p>
              )}
            </div>
            <FormMessage>{error?.message}</FormMessage>
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
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <FormItem className={`${(form.watch('image') || post.imageFile !== undefined) ? 'opacity-50 hover:opacity-100' : ''} w-[65%]`}>
                <FormLabel className={`${(form.watch('image') || post.imageFile !== undefined) ? '' : 'opacity-50'}`}>
                  Optional Video/Audio
                </FormLabel>
                <FormControl>
                <Input type="file"
                  onChange={(e) => {
                    onChange(e.target.files[0]); // store file
                  }}
                  className={`file-input-ghost ${
                    error ? 'border-red-500' : ''
                  }`}
                  accept="audio/*,video/*"
                  disabled={!form.watch('image') && post.imageFile === undefined}
                  ref={ref}
                />
                </FormControl>
                {post.contentFile && (
                  <p className="text-sm text-zinc-500 mt-1">
                    Current Content: {post.contentFile.name || 'Uploaded Content'}
                  </p>
                )}
              <FormMessage>{error?.message}</FormMessage>
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