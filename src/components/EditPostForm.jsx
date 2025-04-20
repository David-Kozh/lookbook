import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
      message: 'Only JPG or PNG files are supported',
    })
    .optional(),
  description: z.string()
    .max(250, { message: "Description must be 250 characters or less." })
    .optional(),
  content: z.any()
    .refine(file => file instanceof File || file === undefined, {
      message: 'A file is required',
    })
    .refine(file => {
      if (file === undefined) return true;
      if (file.type.startsWith('audio/') && file.size <= 20 * 1024 * 1024) return true; // 10MB for audio
      if (file.type.startsWith('video/') && file.size <= 80 * 1024 * 1024) return true; // 50MB for video
      return false;
    }, {
      message: 'Audio files must be 20MB or less, and video files must be 80MB or less.',
    })
    .refine(file => file === undefined || ['audio/mp3', 'audio/wav', 'video/mp4', 'video/quicktime'].includes(file.type), {
      message: 'Only MP3, WAV, MP4, or MOV files are supported.',
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
      content: undefined,
    },
  });
  const { formState } = form;
      
  async function onSubmit(values) {
    console.log('submitting form');
    console.log(values);

    // Dynamically calculate aspect ratio
    let aspectRatio = null;
    if (values.image) {
      const img = new Image();
      const reader = new FileReader();

      const aspectRatioPromise = new Promise((resolve) => {
        reader.onload = (event) => {
          img.src = event.target.result;
        };
        img.onload = () => {
          resolve(img.width / img.height);
        };
      });

      reader.readAsDataURL(values.image);
      aspectRatio = await aspectRatioPromise;
    }

    //* Update post with the form input data
    updatePost({
      title: values.title,
      description: values.description,
      imageFile: values.image, 
      aspectRatio,
      postType: values.content?.type.startsWith('audio/') ? 'audio' : values.content?.type.startsWith('video/') ? 'video' : 'default',
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
            <FormLabel>Description</FormLabel>
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
              <div className="flex gap-1.5 items-center">
                <FormLabel className={`${error ? 'text-red-500' : ''}`}>
                    New Image
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" id="info" width={22} height={22} >
                        <path fill='currentColor' d="M50.5 84.6c18.8 0 34.1-15.3 34.1-34.1S69.3 16.4 50.5 16.4 16.4 31.7 16.4 50.5s15.3 34.1 34.1 34.1zm0-63.4c16.1 0 29.3 13.1 29.3 29.3S66.6 79.8 50.5 79.8 21.2 66.6 21.2 50.5s13.2-29.3 29.3-29.3z"></path>
                        <path fill='currentColor' d="M44.8 65.5c-1.3 0-2.4 1.1-2.4 2.4 0 1.3 1.1 2.4 2.4 2.4h15.8c1.3 0 2.4-1.1 2.4-2.4 0-1.3-1.1-2.4-2.4-2.4h-5.5V44.3c0-1.3-1.1-2.4-2.4-2.4h-7.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.5v18.8h-5.5z"></path>
                        <circle fill='currentColor' cx="49.4" cy="34" r="3.9"></circle>
                      </svg>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="text-sm text-card-foreground">
                        Must be 1:1 or 16:9 aspect ratio.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input type="file"
                  className={`file-input-ghost ${
                    error ? 'border-red-500' : ''
                  }`}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      const img = new Image();
      
                      reader.onload = (event) => {
                        img.src = event.target.result;
                      };
      
                      img.onload = () => {
                        const width = img.width;
                        const height = img.height;
                        const aspectRatio = width / height;
      
                        // Allowed aspect ratios
                        const allowedAspectRatios = [1, 16 / 9]; // 1:1, 16:9
      
                        if (!allowedAspectRatios.some((ratio) => Math.abs(ratio - aspectRatio) < 0.01)) {
                          form.setError("image", {
                            type: "manual",
                            message: "Invalid aspect ratio. Only 1:1 or 16:9 images are allowed.",
                          });
                          onChange(null); // Clear the field
                        } else {
                          form.clearErrors("image");
                          onChange(file); // Accept the file
                        }
                      };
      
                      reader.readAsDataURL(file);
                    } else {
                      onChange(null); // Clear the field if no file is selected
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

      <Controller name="content"
        control={form.control}
        render={({ field: { onChange, ref }, fieldState: { error } }) => (
          <FormItem className={`${(form.watch('image') || post.imageFile !== undefined) ? 'opacity-50 hover:opacity-100' : ''}`}>
            <div className="flex gap-1.5 items-center">
              <FormLabel>
                Additional Media
              </FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" id="info" width={22} height={22}>
                      <path fill='currentColor' d="M50.5 84.6c18.8 0 34.1-15.3 34.1-34.1S69.3 16.4 50.5 16.4 16.4 31.7 16.4 50.5s15.3 34.1 34.1 34.1zm0-63.4c16.1 0 29.3 13.1 29.3 29.3S66.6 79.8 50.5 79.8 21.2 66.6 21.2 50.5s13.2-29.3 29.3-29.3z"></path>
                      <path fill='currentColor' d="M44.8 65.5c-1.3 0-2.4 1.1-2.4 2.4 0 1.3 1.1 2.4 2.4 2.4h15.8c1.3 0 2.4-1.1 2.4-2.4 0-1.3-1.1-2.4-2.4-2.4h-5.5V44.3c0-1.3-1.1-2.4-2.4-2.4h-7.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.5v18.8h-5.5z"></path>
                      <circle fill='currentColor' cx="49.4" cy="34" r="3.9"></circle>
                    </svg>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p className="text-sm text-card-foreground">
                      Optional audio or video file. Video will be cropped <br/>if aspect ratio doesn't match the image.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input type="file"
                onChange={(e) => {
                  onChange(e.target.files[0]);
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

      <DialogFooter>
        <Button type="submit" variant="secondary" className="mt-8" disabled={!formState.isDirty}>Save Post</Button>
      </DialogFooter>

    </form>
  </Form>
  )
}