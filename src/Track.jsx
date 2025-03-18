import { useRef, useState, useEffect, useContext } from 'react';
import { SelectedImgContext } from './contexts/SelectedImageContext';
import './Track.css';

function ImageTrack({ posts }) {
  const mouseDownAtRef = useRef(0); // x position of the mouse when it is/was clicked
  const percentageRef = useRef(0);  // Percentage track has been slid. Updated on mouseUp to include the last drag (+= deltaPercentageRef.current)
  const deltaPercentageRef = useRef(0); //  Value of current drag (for handleMouseMove). Reset to 0 on mouseDown
  const isDraggingRef = useRef(false);
  const [selectedImageInfo, setSelectedImageInfo] = useState({ title: '', description: '' }); // Image info to be displayed
  const isAnimating = useRef(false);      // Flag for whether the track is currently animating
  const isAnimatingOpen = useRef(false);  // Flag for whether a post is currently being opened
  const isPostOpenRef = useRef(false);    // Flag for whether a post is currently open
  
  // ref to the selected image index
  const selectedImageRef = useRef(null);

  // This is the index of the selected image. Null if no image is selected. Stored as a useState in the root component.
  const { selectedImage, setSelectedImage, setCloseSelectedImage } = useContext(SelectedImgContext);  

  const handleMouseDown = (e) => {  // Use this for closing posts and handleClick for opening posts
    if(selectedImage !== null){
      return; // Don't allow dragging when an image is expanded
    }
    console.log("mouse down: ", e.clientX); 
    mouseDownAtRef.current = e.clientX;
    deltaPercentageRef.current = 0;
    isDraggingRef.current = false; // Reset the flag
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    console.log("Mouse down info: \nMax Delta: ", window.innerWidth / 2, "\nMouse Down At: ", mouseDownAtRef.current, "\nPercentage: ", deltaPercentageRef.current + percentageRef.current)
  };

  const handleMouseMove = (e) => {
    // Don't allow dragging when an image is expanded
    if(isPostOpenRef.current == true){
      return;
    }

    // Calculate % track has been slid
    const mouseDelta = parseFloat(mouseDownAtRef.current) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    deltaPercentageRef.current = ((mouseDelta / maxDelta) * -100);

    {// Check if the mouse has moved enough to be considered a drag
    if(Math.abs(mouseDelta) > 5) {
      console.log("dragging");
    } else return;
    }

    // Check if percentages are out within the bounds. If so, set to the max/min value and return.
    // Track is slid all the way left
    if(deltaPercentageRef.current + percentageRef.current <= -100){
      console.log("slid all the way left", deltaPercentageRef.current + percentageRef.current); 
      deltaPercentageRef.current = 0;
      percentageRef.current = -100;
      mouseDownAtRef.current = e.clientX; // update mouseDownAt to the current mouse position so the next move to the right can be accepted.
      return;
    }
    // Track is slid all the way right
    if(deltaPercentageRef.current + percentageRef.current >= 0) {
      console.log("slid all the way right", deltaPercentageRef.current + percentageRef.current); 
      deltaPercentageRef.current = 0;
      percentageRef.current = 0;
      mouseDownAtRef.current = e.clientX; //  update mouseDownAt to the current mouse position so the next move to the left can be accepted.
      return;
    }

    //  Update/Animate the track position;
    //? Store the animations in an array so they can be cancelled if an image is expanded
    isAnimating.current = true;
    const track = document.getElementById("image-track");
    track.animate({
      transform: `translate(${(deltaPercentageRef.current + percentageRef.current)}%, -50%)`
    }, {
      duration: 750, fill: "forwards"
    });
    console.log("percentage: ", -1 * (deltaPercentageRef.current + percentageRef.current),  "window width: ", window.innerWidth);
    
    // Image Parallax Effect
    if(deltaPercentageRef.current + percentageRef.current < 0) {
      const images = track.querySelectorAll(".image");
      images.forEach((image) => {
        image.animate({
          objectPosition: `${100 + (deltaPercentageRef.current + percentageRef.current)}% center`
        }, {
          duration: 750, fill: "forwards"
        });
      });
    }
    updateTitleOpacity();
  };
  
  const handleMouseUp = () => {
    // Update percentage by adding change in percentage.
    percentageRef.current += deltaPercentageRef.current;  
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    
    // Delay setting isAnimating.current to false by the duration of the animation
    // This timeout plus the timeout for calling expandSelectedImage should add up to the duration of the sliding animation
    // MIGHT BE SETTING TO FALSE UNEXPECTEDLY AND CAUSING BUG
    setTimeout(() => {
      isAnimating.current = false;
    }, 750); 
    
    console.log("Mouse up info: \nMax Delta: ", window.innerWidth / 2, "\nMouse Up at: ", mouseDownAtRef.current, "\nPercentage: ", percentageRef.current);
  };

  const handleClick = (index) => {  // Usage: Handles clicks on posts
    // If an image is already expanded, close it. Otherwise, expand the clicked image.
    if (selectedImage !== null) {
      closeSelectedImage(selectedImage);
    }
    else {
      setSelectedImageInfo({ title: posts[index].title, description: posts[index].description });
      expandSelectedImage(index); // Note: removed this from setTimeout (200ms). Unsure why it was here
    }
  };

  const expandSelectedImage = async (index) => {  // Usage: Expands Posts
    if(isAnimating.current){ // Prevent opening a post while sliding the track
      console.log("still animating - cant open post");
      return;
    } 
    if(isAnimatingOpen.current == true){  // Prevent opening a post while another is open/opening
      console.log('isAnimatingOpen');
      return;
    }
    else if(isPostOpenRef.current == true){
      console.log('Post Already Open');
      return;
    }
    console.log('Open post with index: ', index);
    
    // Update the flags, as well as the selectedImage context & ref.
    isAnimatingOpen.current = true;   
    isPostOpenRef.current = true; 
    setSelectedImage(index);          
    selectedImageRef.current = index;
     
    updateTitleOpacity(0); // Hide the title           

    // Expand selected images using index and hide others
    const images = document.querySelectorAll('.image');
    var imageDimensions = { width: 0, height: 0 };
    images.forEach((image, i) => {
      if (i !== index) {
        if (i < index) {      // Images to the left of the selected image
          image.animate({
            transform: ['translateX(-500%)']
          }, {duration: 700, fill: 'forwards', easing: 'ease-in-out'});
        } else {              // Images to the right of the selected image
          image.animate({
            transform: ['translateX(500%)']
          }, {duration: 700, fill: 'forwards', easing: 'ease-in-out'});
        }
      } else {                // Animate the selected image
        imageDimensions = selectedImageDimensions(index);
        setTimeout(() => {    // Reveal the whole image after other images are gone
          image.animate({
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`
          }, {duration: 500, fill: 'forwards', easing: 'ease-in-out'});
        }, 200);

        setTimeout(() => {    // Wait for image to be revealed, then translate
          if(posts[i].aspectRatio == '16:9'  || window.innerWidth < 768 ){
            let rect = image.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            const targetX = (window.innerWidth / 2);
            const targetY = (window.innerHeight * 0.35);
            const deltaX = targetX - centerX;
            const deltaY = targetY - centerY;
            image.animate({
              transform: [`translate( ${deltaX}px, ${deltaY}px)`]
            }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
          }
          else{ 
            const targetX = window.innerWidth * 0.1;              // Calculate the target position (10% from the left)
            const currentX = image.getBoundingClientRect().left; // Get the current position of the image
            const deltaX = targetX - currentX;
            image.animate({
            transform: ['translateX(' + deltaX + 'px)']
            }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
            console.log(targetX, currentX, deltaX);
          }
        }, 800);
      }
    });
    
    // Animate the image info after other animations are complete
    setTimeout(() => {
      var imageInfoElements = document.querySelectorAll('.image-info');
      var verticalOrientationFlag = false;
      if(posts[index].aspectRatio == '16:9' || window.innerWidth < 768){
        imageInfoElements = document.querySelectorAll('.image-info-wide');
        verticalOrientationFlag = true;
      }
      if (imageInfoElements) {
        imageInfoElements.forEach((element) => {
          if(verticalOrientationFlag){
            element.style.width = `${imageDimensions.width}px`;
          }
          else {
            element.style.height = `${imageDimensions.height}px`;
            const rect = element.getBoundingClientRect();
            const currentCenterY = rect.top + rect.height / 2;
          }
          element.animate({
            opacity: "1",
          }, {
            duration: 150,
            fill: 'forwards',
            easing: 'ease-in-out'
          });
          console.log('animated image info')
        });
      }

      showMedia(index); // Show media if applicable

      isAnimatingOpen.current = false;  // Once last animation are complete, set isAnimatingOpen to false

    }, 1600);
    
  };

  const closeSelectedImage = (index) => { // Usage: Closes posts. index is the value of selectedImage when function was called.
    if(isAnimatingOpen.current == true){
      console.log('Cannot close post while animating open');
      return;
    }
    console.log('Closing selected post with index: ', index, selectedImage);

    // Fade out & remove image info
    var imageInfoElements = document.querySelectorAll('.image-info');
    if(posts[index].aspectRatio == '16:9' || window.innerWidth < 768){
      imageInfoElements = document.querySelectorAll('.image-info-wide');
    }
    if (imageInfoElements) {
      imageInfoElements.forEach((element) => {
        element.animate({
          opacity: "0",
        }, {
          duration: 500,
          fill: 'forwards',
          easing: 'ease-in-out'
        });
      });
    }
    setTimeout(() => { 
      setSelectedImage(null);
      selectedImageRef.current = null;
      setSelectedImageInfo({ title: '', description: '' });
    }, 200);  
    

    // Remove video if it exists
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.parentNode.removeChild(videoElement);
    }

    // Animate Images back to their positions
    const images = document.querySelectorAll('.image');
    images.forEach((image, i) => {
      if (i !== index) {
        if (i < index) {  // Images to the left of the selected image
          image.animate({
            transform: ['translateX(0%)']
          }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
        } else {          // Images to the right of the selected image
          image.animate({
            transform: ['translateX(0%)']
          }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
        }
      } else {            // Animate the selected image
        if(posts[i].aspectRatio == '16:9'){
          image.animate({
            transform: ['translateX(0%)'],
            width: "71vmin",
            height: "56vmin"
          }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
        }
        else if(posts[i].aspectRatio == '1:1'){
          image.animate({
            transform: ['translateX(0%)'],
            width: "40vmin",
            height: "56vmin"
          }, {duration: 750, fill: 'forwards', easing: 'ease-in-out'});
        }
      }
    });
    
    // Post Closed - Bring back title
    isPostOpenRef.current = false;
    updateTitleOpacity(
      (100 * ((10 + (deltaPercentageRef.current + percentageRef.current)) / 10)),
      750
    );

  };

  const updateTitleOpacity = (manualOpacityPercent, durationOverride) => { // Usage: Updates the App Title opacity
    const title = document.querySelector('.title-panel');
    var  opacityPercent = 100 * ((10 + Math.trunc(deltaPercentageRef.current + percentageRef.current)) / 10);
    var duration = 150;
    if (manualOpacityPercent !== undefined) {
      opacityPercent = manualOpacityPercent;
    }
    if (durationOverride > duration) {
      duration = durationOverride;
    }

    if (title) {
      title.animate({
        opacity: `${opacityPercent}%`,
      }, {
        duration: duration,
        fill: 'forwards',
        easing: 'ease-in-out'
      });
    }
  };

  const selectedImageDimensions = (index) => {  // Usage: Returns dimensions for a selected image based on the aspect ratio and available space
    var ImgDim = { width: 0, height: 0 };
    if(posts[index].aspectRatio == '1:1' && window.innerWidth >= 768){
      if(((window.innerWidth / 2) - (window.innerWidth / 10)) < (window.innerHeight - (window.innerHeight/5))){
        ImgDim.width = (window.innerWidth / 2) - (window.innerWidth / 10);
        ImgDim.height = ImgDim.width;
      }
      else{
        ImgDim.height = window.innerHeight - (window.innerHeight/5);
        ImgDim.width = ImgDim.height;
      }
    }
    else if(posts[index].aspectRatio == '16:9'){
      const maxWidth = window.innerWidth - (window.innerWidth / 10);   // 5% padding on each side
      const maxHeight = window.innerHeight/2;         // Top 50% of screen
      if(maxWidth/maxHeight > 16/9){
        ImgDim.width = maxHeight * (16/9);
        ImgDim.height = maxHeight;
      }
      else if(maxWidth/maxHeight < 16/9){
        ImgDim.width = maxWidth;
        ImgDim.height = maxWidth * (9/16);
      }
      else{
        ImgDim.width = maxWidth;
        ImgDim.height = maxHeight;
      }
    }
    else { // 1:1 aspect ratio. Mobile view (window.innerWidth < 768)
      const maxWidth = window.innerWidth - (window.innerWidth / 10);   // 5% padding on each side
      const maxHeight = window.innerHeight/2;         // Top 50% of screen
      if(maxWidth/maxHeight > 1){
        ImgDim.width = maxHeight;
        ImgDim.height = maxHeight;
      }
      else if(maxWidth/maxHeight < 1){
        ImgDim.width = maxWidth;
        ImgDim.height = maxWidth;
      }
      else{
        ImgDim.width = maxWidth;
        ImgDim.height = maxHeight;
      }
    }

    return ImgDim;
  };

  const showMedia = (index) => {  // Usage: Show media for expanded post if applicable
    const images = document.querySelectorAll('.image');
    if(posts[index].contentType == 'mp4'){ 
      console.log('mp4 element');
        const videoElement = document.createElement('video'); // Create a video element //** Caution: enclosing delay removed (400ms)
        videoElement.src = posts[index].content;              // Use the imported mp4 file directly
        videoElement.controls = true;                         // Add controls so the user can play the video
        videoElement.style.width = `${images[index].offsetWidth}px`;  // Set the dimensions of the video to match the image
        videoElement.style.height = `${images[index].offsetHeight}px`;
        videoElement.style.objectFit = 'cover';
        videoElement.style.position = 'absolute';
        videoElement.controlsList = 'nodownload';
        videoElement.style.top = `${images[index].getBoundingClientRect().top}px`;
        videoElement.style.left = `${images[index].getBoundingClientRect().left}px`;
        videoElement.style.zIndex = '10';
        videoElement.classList.add('fade-in');    // Fade-in video element
        document.body.appendChild(videoElement);  // Append the video element to the body
    }
    else if(posts[index].contentType == 'mp3'){
      console.log('mp3 element');
      const audioElement = document.createElement('audio'); // Create an audio element
      audioElement.src = posts[index].content; // Use the imported mp3 file directly
      audioElement.controls = true; // Add controls so the user can play the audio
      audioElement.controlsList = 'nodownload';
      audioElement.style.width = '25vw';
      audioElement.classList.add('mt-8');

      // Find the image info element and append the audio element to it
      const imageInfoElement = document.querySelector('.info-panel');
      if (imageInfoElement) {
        console.log('Found image info element');
        imageInfoElement.appendChild(audioElement);
        audioElement.style.width = '80%';
      }
    }
  };

  const handleResizeRef = useRef(null);

  handleResizeRef.current = async () => {  // WIP: Handle resizing of window while image is expanded
    //! BUG: 
    //!   Resize works going from col view -> row view but not the other way around (1:1 selected image)
    //!   Does not work at all for 1:1 images displayed in a column (but does work for 16:9 images in a column)
    // TODO: Apply to mp4 elements
    
    if(selectedImageRef.current != null){
      const imageDimensions = selectedImageDimensions(selectedImageRef.current);
      const images = document.querySelectorAll('.image');
      console.log('Window was resized ' + selectedImageRef.current);
      images.forEach((image, i) => {
        if(i == selectedImageRef.current){
          image.animate({
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`
          }, {duration: 100, fill: 'forwards', easing: 'ease-in-out'});
          
          let style = window.getComputedStyle(image);
          let transform = style.getPropertyValue('transform');
          
          let e = 0; let f = 0;
          if (transform && transform !== 'none') {
            let values = transform.split('(')[1].split(')')[0].split(', ');
            e = parseFloat(values[4]);
            f = parseFloat(values[5]);

            console.log('e:', e, 'f:', f);
          } else {
            console.log('No transform applied - invalid transform property of selected image');
          }

          setTimeout(() => {    // Wait for image to be resized, then center in space
            if(posts[i].aspectRatio == '16:9'){
              let rect = image.getBoundingClientRect();
              let centerX = rect.left + rect.width / 2;
              let centerY = rect.top + rect.height / 2;
              const targetX = (window.innerWidth / 2);
              const targetY = (window.innerHeight * 0.35);
              const deltaX = targetX - centerX;
              const deltaY = targetY - centerY;

              image.animate({
                transform: [`translate( ${e + deltaX}px, ${f + deltaY}px)`]
              }, {duration: 100, fill: 'forwards', easing: 'ease-in-out'});
              console.log(targetX, centerX, deltaX);
              console.log(targetY, centerY, deltaY);
            }
            else{ 
              const targetX = window.innerWidth * 0.1;              // Calculate the target position (10% from the left)
              const currentX = image.getBoundingClientRect().left; // Get the current position of the image
              const deltaX = targetX - currentX;
              image.animate({
              transform: ['translateX(' + (e + deltaX) + 'px)']
              }, {duration: 100, fill: 'forwards', easing: 'ease-in-out'});
              console.log(targetX, currentX, deltaX);
            }
          }, 200);
        
          // TODO: Animate the image info after other animations are complete, so that image info height or width matches with image

        }
      });
    }
  };

  useEffect(() => {
    setCloseSelectedImage(() => closeSelectedImage);
  }, [selectedImage]);

  useEffect(() => {
    const track = document.getElementById("image-track");
    
    // Attach the event listener when the component mounts
    track.addEventListener('mousedown', handleMouseDown);
    // Return a cleanup function that removes the event listener when the component unmounts
    return () => {
      track.removeEventListener('mousedown', handleMouseDown);
    };
  }, []); // Pass an empty dependency array to run the effect only on mount and unmount

  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (handleResizeRef.current) {
          handleResizeRef.current();
        }
      }, 1000);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []); 

  return (
    <>
      <div id="image-track">
        {posts.map((post, index) => ( 
          (post.aspectRatio == '16:9') ? (
            <img
            key={index}
            className='image img-wide drop-shadow-2xl shadow-inner shadow-black'
            src={post.image}
            draggable="false"
            onClick={() => handleClick(index)}
            />
          ) :       
          (post.aspectRatio == '1:1') && (
            <img
            key={index}
            className='image img-md drop-shadow-2xl shadow-inner shadow-black'
            src={post.image}
            draggable="false"
            onClick={() => handleClick(index)}
            />
          )
        ))}
      </div>
      
      {/* App ProfileName and Subheading */}
      <div className='title-panel ml-5 md:ml-20 flex flex-col justify-center'>
        <h1 style={{textDecoration: 'underline'}} className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl ml-3 sm:ml-5 md:ml-10 font-mono my-2'> LookBook </h1>
        <h2 className='text-lg sm:text-2xl lg:text-4xl font-mono ml-3 sm:ml-5 md:ml-10 md:my-2'> Aesthetic and Professional Portfolios </h2>
      </div>

      {/* Image Info */}
      {selectedImage !== null && (
      <div className={`${posts[selectedImage].aspectRatio == '1:1' ? 'info-container-col info-container' : 'info-container-col'}`}>

        <div className={`${posts[selectedImage].aspectRatio == '1:1' ? 'img-panel-wide img-panel' : 'img-panel-wide'}`}/>

        <div className={`${posts[selectedImage].aspectRatio == '1:1' ? 'info-panel-wide info-panel flex flex-col items-center' : 'info-panel-wide'}`}>
          {/* Vertically Stacked Orientation */}
          {((posts[selectedImage].aspectRatio == '16:9') || (window.innerWidth < 768)) &&  
          (<>
            <div className='image-info-wide px-6 py-4 mt-2 mx-3 text-xl xl:text-2xl rounded-xl bg-[#2d4f79] bg-opacity-40 '>
              <h1 className='font-mono'>
                {selectedImageInfo.title}
              </h1>
              <p className='info-text'>{selectedImageInfo.description}</p>
            </div>
          </>)}

          {/* Side by Side Orientation */}
          {((posts[selectedImage].aspectRatio == '1:1') && (window.innerWidth >= 768)) &&  
          (<>
            <div className='image-info-wide image-info font-sans pt-4 rounded-xl mb-20 text-xl lg:text-2xl xl:text-3xl bg-[#2d4f79] bg-opacity-40'>
              <h1 className='lg:text-4xl h-[10%] ml-4 font-mono font-bold'>
                {selectedImageInfo.title}
              </h1>
              <p className='info-text font-mono w-full h-[90%] break-words pl-6 pr-4'>{selectedImageInfo.description}</p>
            </div>
          </>)}
        </div>

      </div>)}

    </>
  );
}

export default ImageTrack;