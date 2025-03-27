import * as React from 'react'
import logo from './components/logo.png';
import logoNew from './components/Firefly lookbook logo 2.png';

//* LandingPage component for unauthenticated users
function Home() {
  return (
    <div className='w-full body-h flex justify-center'>
      <section className='h-[85%] w-[90%]'>
        <div className="mx-auto max-w-screen-2xl px-4 py-4 md:py-16 sm:px-6 lg:px-8 h-full font-sans flex flex-col justify-center">
          <div className="grid grid-cols-1 h-content lg:grid-cols-2">
            <div className="relative z-10 lg:py-16">
              <div className="relative h-72 sm:h-80 lg:h-full">
                <img
                  alt="Logo"
                  src={logoNew}
                  className="absolute inset-0 h-full w-full object-cover shadow-lg lg:shadow-2xl shadow-black/10 lg:shadow-black/30"
                />
              </div>
            </div>

            <div className="relative flex items-center bg-[#203e63] shadow-xl shadow-black/30">
              <span
                className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-[#203e63]"
              ></span>

              <div className="p-8 sm:p-16 xl:p-24">
                <h2 className="bg-gradient-to-r from-[#D5AE7E] to-[#D47E7A] bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl 2xl:text-6xl tracking-wide">
                  LookBook 
                </h2>
                <span className="mt-4 relative flex justify-center">
                  <div
                    className="absolute rounded-l-full inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-white via-white to-transparent opacity-75"
                  ></div>
                </span>
                <div className="mt-6 text-gray-200 font-medium 2xl:text-lg font-mono">
                &nbsp;&nbsp;&nbsp;&nbsp;A simple and sleek platform for creatives to showcase their work to the world. Perfect for photographers, programmers, illustrators, designers, and musicians. 
                  <div className='mt-6'>&nbsp;&nbsp;&nbsp;&nbsp;➣ Skip the sign up and log in instantly with Google or Github! </div>
                </div>
                
                {/* Buttons for Sign Up and Log In (empty divs are for spacing) */}
                <div className='w-full flex justify-between gap-6'>
                  <a
                    href="/signup"
                    className="hidden mt-14 rounded-md px-8 py-5 text-sm font-semibold text-white 
                    hover:bg-[#9E9BDE] focus:outline-none focus:ring bg-gradient-to-r from-[#6855f7] to-[#2950bcd8]
                    hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  >
                    Sign Up
                  </a>
                  <a href="/login"
                    className="mt-14 px-8 py-5 inline-block rounded-lg bg-[#6855f7] focus:outline-none focus:ring 
                    text-sm font-semibold text-center text-white transition hover:shadow-[2px_3px_0px_0px_rgba(0,0,0)] 
                    duration-200 bg-gradient-to-r from-[#2950bcd8] to-[#984cdfc9]
                    hover:bg-[#ffffff]">
                    Log In
                  </a>
                  <div></div>
                  <div></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unused, alternate layout */}
      <section className="bg-gray-900 text-white hidden">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
          >
            LookBook
            <span className="sm:block"> a simple and sleek platform for creatives to showcase their work. </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
            numquam ea!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              href="#"
            >
              Get Started
            </a>

            <a
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      </section>
  </div>
  )
}
export default Home;