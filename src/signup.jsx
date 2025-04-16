import React from "react";
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
      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error);
    }

  };


return (
<section className="bg-card dark">
  <div className="lg:grid min-h-screen lg:grid-cols-12">
    <section className="relative flex h-56 items-end lg:col-span-5 lg:h-full xl:col-span-6">

      <img alt="Logo"
        src={Logo}
        className="absolute inset-0 h-full w-full object-cover lg:h-[100%]"
      />

    </section>

    <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
      <div className="max-w-xl lg:max-w-3xl">
        <div className="relative -mt-16 block lg:hidden">
          <a className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
            href="/home"
          >
            <span className="sr-only">Link to Home</span>
            <svg className="h-8 sm:h-10"
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                fill="currentColor"
              />
            </svg>
          </a>

          <h1 className="mt-2 text-2xl font-bold text-card-foreground sm:text-3xl md:text-4xl">
            Welcome to LookBook 🗂️
          </h1>

          <p className="mt-2 leading-relaxed text-card-foreground opacity-75">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 grid grid-cols-6 gap-5 lg:gap-8">
            {/* Display Name */}
            <FormField
              name="displayName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input className="h-min" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Handle */}
            <FormField
              name="handle"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-6 sm:col-span-3 text-card-foreground/75">
                  <FormLabel>Handle</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Password Confirmation</FormLabel>
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
                    <span className="text-sm text-card-foreground opacity-75">
                      I want to receive emails about product updates and company announcements.
                    </span>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-6">
              <p className="text-sm text-card-foreground/75">
                By creating an account, you agree to our
                <a href="#" className="text-card-foreground underline mx-1.5">terms and conditions</a>
                and
                <a href="#" className="text-card-foreground underline ml-1.5">privacy policy</a>.
              </p>
            </div>

            {/* Submit Button */}
            <div className="col-span-6 flex items-center gap-4 mt-2">
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