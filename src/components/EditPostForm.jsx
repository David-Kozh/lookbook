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

  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  image: z.any().refine(file => file instanceof File || file === undefined, {
    message: 'A file is required',
  }).optional(),
  aspectRatio: z.string(),
  description: z.string().optional(),
  contentType: z.string(),
  content: z.any().refine(file => file instanceof File || file === undefined, {
    message: 'A file is required',
  }),

})

// TODO: Integrate with edit button in CreateCollection > CreateCollectionForm > LeftButtons
// TODO: When editing a post with additional content, must check post.content (line 70)
export default function EditPostForm({ post, updatePost, dismiss }) {

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      image: undefined,
      aspectRatio: post.aspectRatio,
      contentType: post.contentType,
      content: undefined,
    },
  });

  const contentTypeWatch = form.watch('contentType');
      
  function onSubmit(values) {
    console.log('submitting form');
    console.log(values);

    // TODO: Additionally make sure the file extensions match the content type 
    // TODO: Check post.content so that posts with non-updated content aren't marked as invalid
    if ((values.contentType === 'mp4' || values.contentType === 'mp3') && !(values.content instanceof File)) {
      form.setError('content', {
        type: 'manual',
        message: 'A file is required',
      });
      return;
    }

    //* Update post with the form input data
    updatePost({
      title: values.title,
      description: values.description,
      image: values.image, 
      aspectRatio: values.aspectRatio,
      contentType: values.contentType,
      content: values.content,
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
                <Input className='bg-slate-300' {...field} />
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
                <Input className='bg-slate-300' {...field} />
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

      <div className="flex w-full gap-4">
        <FormField name="aspectRatio"
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
        <FormField name="contentType"
        control={form.control}
        render={({ field }) => (
            <FormItem className='w-[65%]'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-slate-300 mt-2 font-semibold">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent className="font-semibold">
                    <SelectItem value="default">No Additional Content </SelectItem>
                    <SelectItem value="mp4">+ Video Content</SelectItem>
                    <SelectItem value="mp3">+ Audio Content</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
        />
      </div>

      <Controller name="content"
        control={form.control}
        render={({ field: { onChange, ref } }) => (
          <FormItem>
            <div className="grid gap-1.5">
              <FormLabel className={`${(contentTypeWatch === 'mp4' || contentTypeWatch === 'mp3') ? '' : 'text-slate-500' }`}>
                Additional Content
              </FormLabel>
              <FormControl>
              <Input type="file"
                onChange={(e) => {
                  onChange(e.target.files[0]); // store file
                }}
                className='bg-slate-600 text-slate-100 sm:text-white'
                disabled={!(contentTypeWatch === 'mp4' || contentTypeWatch === 'mp3')}
                ref={ref}
              />
              </FormControl>
            </div>
            <FormMessage />
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