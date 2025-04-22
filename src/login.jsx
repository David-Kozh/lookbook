import { signInWithGoogle, signInWithGithub } from './services/authService';
import { useNavigate } from 'react-router-dom';
import Logo from './components/Firefly lookbook logo 2.png';
import { useState, useEffect } from 'react';
import { login } from './services/authService';

//TODO Implement email/password login firebase function
export default function Login({isLoggedIn}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('User signed in with Google:', user);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            const user = await signInWithGithub();
            console.log('User signed in with GitHub:', user);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            console.log('Navigating to home...');
            navigate('/');
        }
    }, [isLoggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        setError(null); // Clear any previous errors
    
        try {
          const user = await login(email, password);
          console.log("User signed in:", user);
        } catch (error) {
          console.error("Error signing in:", error.message);
          setError("Invalid email or password. Please try again.");
        }
    };

return (
<section className="relative flex flex-wrap h-[100%] items-center px-6 py-6 sm:px-8 lg:px-10 xl:px-28">
    
    <a href="/" className="relative flex items-center h-[20%] lg:h-[70%] w-full lg:w-1/2 lg:pr-4">
        <img alt="logo"
            src={Logo}
            className="h-full w-full object-cover rounded-lg"
        />
    </a>

    <div className="flex flex-col justify-evenly bg-card dark rounded-lg h-[70%] w-full mb-8 lg:mb-0 px-4 py-6 sm:px-6 sm:py-14 lg:w-1/2 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-lg text-center">
            <h1 className="text-zinc-300 text-3xl font-bold sm:text-4xl tracking-wide">LookBook</h1>

            <p className="my-3 text-xs lg:text-base text-zinc-300 font-mono px-1">
                Aesthetic and professional portfolios, <span className="font-semibold">no sign up needed</span>. Login to share your wonderful creative works with the world!
            </p>
        </div>

        <div className='flex justify-evenly gap-2'>
            <button className="flex gap-2 items-center rounded-lg bg-[#433e9f] px-4 py-4 font-medium text-white 
                hover:bg-[#5e5d83] focus:outline-none focus:ring
                hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                onClick={handleGoogleSignIn}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                <span className='font-mono tracking-tight text-xs' style={{ wordSpacing: '-1px' }}>Log in with Google</span>
            </button>
            
            <button className="flex gap-2 items-center rounded-lg bg-[#433e9f] px-4 py-4 text-white 
                hover:bg-[#5e5d83] focus:outline-none focus:ring font-medium
                hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                onClick={handleGithubSignIn}
            >
                <svg width="24" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#061323"/></svg>
                <span className='font-mono text-xs tracking-tight' style={{ wordSpacing: '-1px' }}>Log in with GitHub</span>
            </button>
        </div>

        <form onSubmit={handleLogin} className="mx-auto my-4 w-[97%] sm:w-[75%] lg:w-[95%] space-y-4">
        {/* Email Input Box */}
        <div>
            <label htmlFor="email" className="sr-only">Email</label>

            <div className="relative">
            <input type="email"
                id="email"
                className="w-full rounded-lg text-gray-400 p-4 pe-12 text-xs tracking-wider shadow-sm font-mono"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
                </svg>
            </span>
            </div>
        </div>
        
        {/* Password Input Box */}
        <div>
            <label htmlFor="password" className="sr-only">Password</label>

            <div className="relative">
            <input type="password"
                id="password"
                className="w-full rounded-lg text-gray-400 p-4 pe-12 text-xs font-mono tracking-wide shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                </svg>
            </span>
            </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between">
            <p className="flex flex-col text-xs font-mono text-zinc-300 ml-2 mt-4">
                No Google/Github account?
            <a className="underline" href="/signup">Sign up with email</a>
            </p>

            <button type="submit"
                className="inline-block rounded-lg bg-[#433e9f] hover:bg-[#5e5d83] px-5 py-3 mt-4 text-xs font-medium text-white font-mono"
            >
                Log in
            </button>
        </div>
        </form>
    </div>

</section>
    );
}