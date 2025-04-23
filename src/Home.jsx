import * as React from 'react';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import logoNew from './components/Firefly lookbook logo 2.png';

//* LandingPage component for unauthenticated users
function Home() {
  return (
    <div className='w-full h-content flex justify-center'>
      <section className='h-full w-full'>
        <div className="h-full mx-auto max-w-screen-2xl px-4 py-4 md:py-16 sm:px-6 lg:px-8 font-sans flex flex-col justify-center">
          
          <div className="grid grid-cols-1 h-full lg:grid-cols-2">
            
            <div id='elem1' className="home-logo relative z-10 lg:h-full">
              <div className="relative home-logo lg:h-full">
                <img alt="Logo"
                  src={logoNew}
                  className="absolute inset-0 h-full w-full object-cover shadow-lg lg:shadow-2xl shadow-black/10 lg:shadow-black/30 select-none"
                />
              </div>
            </div>

            <div id='elem2' className="home-body lg:h-full relative flex items-center bg-secondary shadow-xl shadow-black/30">
              <span
                className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-secondary"
              ></span>

              <div className="px-6 py-[4vh] sm:p-10 lg:pl-12 h-full flex flex-col justify-evenly">
                <div className='w-full flex flex-col justify-center'>
                  <h2 className="bg-gradient-to-r from-[#D5AE7E] to-[#D47E7A] dark:from-rose-500 dark:to-rose-700 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl lg:text-5xl tracking-wide">
                    LookBook 
                  </h2>
                  <span className="mt-2 lg:my-3 relative flex justify-center">
                    <div
                      className="absolute rounded-l-full inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-white via-white to-transparent opacity-75"
                    ></div>
                  </span>
                </div>
                  
                <div className="mt-4 ml-4 text-gray-300 text-xs sm:text-sm md:text-base xl:text-lg font-mono">
                ➣ An elegant landing page platform for creatives. Showcase photos with optional descriptions, audio and video. Perfect for photographers, videographers, musicians and more.
                <div className='mt-6 text-gray-300 font-mono flex text-xs sm:text-sm md:text-base xl:text-lg'>➣ Skip signing up and log in with Google or Github -- or explore our example profile and feed!</div>
                </div>
                
                {/* Buttons for Sign Up and Log In (empty divs are for spacing) */}
                <div className='w-full flex justify-between gap-6 items-center my-6 lg:mb-2'>
                  <a href="/login"
                    className=" p-3 flex gap-2 items-center rounded-lg bg-[#604ee4] focus:outline-none focus:ring 
                     text-white transition hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)]
                    duration-200 bg-gradient-to-r from-[#2950bcb0] to-[#984cdfb0] 
                    dark:from-rose-500 dark:to-rose-700 hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="login" fill='currentColor' className="w-6 h-6 md:w-8 md:h-8">
                    <g>
                        <path d="M14.47,13.47a.75.75,0,0,0,0,1.06.75.75,0,0,0,1.06,0l2-2a.78.78,0,0,0,.16-.24.73.73,0,0,0,0-.58.78.78,0,0,0-.16-.24l-2-2a.75.75,0,0,0-1.06,1.06l.72.72H3a.75.75,0,0,0,0,1.5H15.19Z"></path>
                        <path d="M20.08,2.25H9.92A1.72,1.72,0,0,0,8.25,4V7a.75.75,0,0,0,1.5,0V4c0-.15.09-.25.17-.25H20.08c.08,0,.17.1.17.25V20c0,.15-.09.25-.17.25H9.92c-.08,0-.17-.1-.17-.25V17a.75.75,0,0,0-1.5,0v3a1.72,1.72,0,0,0,1.67,1.75H20.08A1.72,1.72,0,0,0,21.75,20V4A1.72,1.72,0,0,0,20.08,2.25Z"></path>
                    </g>
                    </svg>
                    <p className='text-xs sm:text-sm md:text-base lg:text-lg font-mono font-semibold text-center mr-0.5' >Login</p>
                  </a>

                  <ContainerTextFlip
                    words={["programmers", "animators", "illustrators", "actors", "designers"]}
                    interval={3000}
                  />

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
  </div>
  )
}
export default Home;