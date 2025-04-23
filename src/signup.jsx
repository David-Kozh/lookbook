import React from "react";
import { useState, useEffect } from 'react';
import Logo from './components/Firefly lookbook logo 2.png'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "./components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { signup } from "./services/authService"
import { updateUser } from "./services/userService"

const signUpSchema = z.object({
  displayName: z.string().min(2, { message: "Display Name must be at least 2 characters." }),
  handle: z.string()
    .min(2, { message: "Handle must be at least 2 characters." })
    .max(30, { message: "Handle must be 30 characters or less." })
    .regex(/^[a-zA-Z0-9-_]+$/, { message: "Handle can only contain letters, numbers, hyphens, and underscores." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  passwordConfirmation: z.string().min(1, "Password confirmation is required"),
  marketingAccept: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      path: ["passwordConfirmation"],
      message: "Passwords do not match",
    });
  }
});

// TODO: Firebase integration
//? Draft a privacy policy and terms and conditions
export default function SignUp() {
  const navigate = useNavigate();
  const [isHandleValid, setIsHandleValid] = useState(true);
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      handle: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      marketingAccept: false,
    },
  });

  useEffect(() => {
    const checkHandle = async () => {
      if (form.watch("handle") !== userProfile.handle) {
        const isUnique = await isHandleUnique(form.watch("handle"));
        setIsHandleValid(isUnique);
      } else {
        setIsHandleValid(true); // Reset if the handle hasn't changed
      }
    };
  
    checkHandle();
  }, [form.watch("handle")]);

  const onSubmit = async (data) => {
    try {
      const userData = {}
      if(data.displayName) {
        userData.displayName = data.displayName
      }
      if(data.handle) {
        if(!isHandleValid) {
          console.error("Handle is not unique");
          return;
        }
        userData.handle = data.handle
      }
      if(data.marketingAccept) {
        userData.marketingAccept = data.marketingAccept
      }
      
      const user = await signup(data.email, data.password);
      await updateUser(user.uid, userData);
      console.log("User signed up successfully:", user);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }

  };


return (
<section className="bg-card dark h-screen">
  <div className="lg:grid min-h-screen lg:grid-cols-12">
    <section className="relative flex h-[12dvh] items-end lg:col-span-5 lg:h-full xl:col-span-6">

      <img alt="Logo"
        src={Logo}
        className="absolute inset-0 h-full w-full object-cover lg:h-[100%]"
      />

    </section>

    <main className="flex h-max items-center justify-center px-6 py-4 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
      <div className="max-w-xl lg:max-w-3xl">
        <div className="relative block lg:hidden">

          <h1 className="text-lg sm:text-2xl font-bold text-card-foreground md:text-3xl">
            Welcome to LookBook 🗂️
          </h1>

          <p className="hidden sm:inline mt-2 sm:text-sm leading-relaxed text-card-foreground opacity-75">
            Sign up now and start sharing your creative works!
          </p>
        </div>

        <div className="hidden lg:block">
          <h1 className="mt-2 text-2xl font-bold text-card-foreground sm:text-3xl md:text-4xl">
            Welcome to LookBook 🗂️
          </h1>

          <p className="py-4 leading-relaxed text-card-foreground opacity-75">
            Sign up now and start sharing your creative works!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 sm:mt-5 grid grid-cols-6 gap-[1.2dvh] lg:gap-8">
            {/* Display Name */}
            <FormField
              name="displayName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel className="text-xs sm:text-sm" >Display Name</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Handle */}
            <FormField name="handle"
              className="mt-auto"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel className="text-xs sm:text-sm" >Handle</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} />
                  </FormControl>
                  <FormMessage>
                    {!isHandleValid && "This handle is already in use. Please choose a different one."}
                  </FormMessage>
                </FormItem>
              )}
            />            
            
            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 text-card-foreground/75">
                  <FormLabel className="text-xs sm:text-sm" >Email</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel className="text-xs sm:text-sm" >Password</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Confirmation */}
            <FormField
              name="passwordConfirmation"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel className="text-xs sm:text-sm" >Password Confirmation</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marketing Accept */}
            <FormField
              name="marketingAccept"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel className="flex items-center gap-2">
                    <Checkbox {...field} />
                    <span className="text-xs sm:text-sm text-card-foreground opacity-75">
                      I want to receive emails about product updates and company announcements.
                    </span>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-6 mt-3">
              <p className="text-xs sm:text-sm text-card-foreground/75">
                By creating an account, you agree to our
                <a href="#" className="text-card-foreground underline mx-1.5">terms and conditions</a>
                and
                <a href="#" className="text-card-foreground underline ml-1.5">privacy policy</a>.
              </p>
            </div>

            {/* Submit Button */}
            <div className="col-span-6 flex items-center gap-4 mt-3">
              <Button type="submit"
                className="border border-blue-600 bg-blue-600 px-5 sm:px-12 py-5 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              >
                Create Account
              </Button>
              <p className="text-sm text-card-foreground/75 mt-0">
                Already have an account?
                <a href="/login" className="ml-2 text-card-foreground underline">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  </div>
</section>
  );
}