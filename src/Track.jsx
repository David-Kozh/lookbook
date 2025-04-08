import { useRef, useState, useEffect, useContext } from 'react';
import { SelectedImgContext } from './contexts/SelectedImageContext';
import { Link } from 'react-router-dom';
import './Track.css';
import LikeButton from './components/LikeButton.jsx';

function ImageTrack({ isLoggedIn, posts, collectionInfo, handleLike, userToView }) {
  const mouseDownAtRef = useRef(0); // x position of the mouse when it is/was clicked
  const percentageRef = useRef(0);  // Percentage track has been slid. Updated on mouseUp to include the last drag (+= deltaPercentageRef.current)
  const deltaPercentageRef = useRef(0); //  Value of current drag (for handleMouseMove). Reset to 0 on mouseDown
  const isDraggingRef = useRef(false);  // Boolean Flag for whether the track is currently being dragged
  const [selectedImageInfo, setSelectedImageInfo] = useState({ title: '', description: '' }); // Image info to be displayed
  const isAnimating = useRef(false);      // Boolean Flag for whether the track is currently animating
  const isAnimatingOpen = useRef(false);  // Boolean Flag for whether a post is currently being opened
  const isPostOpenRef = useRef(false);    // Boolean Flag for whether a post is currently open
  const selectedImageRef = useRef(null);  // ref to the selected image index
  const handleResizeRef = useRef(null);   // ref to the handleResize function
  const [isVerticalOrientation, setIsVerticalOrientation] = useState(false); // Boolean Flag for whether the selected image is in vertical orientation

  // Index of the selected image. Null if no image is selected. Stored as a useState in the root component.
  const { selectedImage, setSelectedImage, setCloseSelectedImage } = useContext(SelectedImgContext);  

  //* Event Handling Functions
  const handleMouseDown = (e) => {
    if(selectedImage != null){
      return; // Don't allow dragging when an image is expanded
    }
    mouseDownAtRef.current = e.clientX; // Set initial x position and reset the variables for dragging
    deltaPercentageRef.current = 0; 
    isDraggingRef.current = false;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    console.log("Mouse down info: \nMax Delta: ", window.innerWidth / 2, "\nMouse Down At: ", mouseDownAtRef.current, "\nPercentage: ", percentageRef.current)
  };

  const handleMouseMove = (e) => {  //* Handle dragging of track
    if(isPostOpenRef.current == true){ return; } // Don't allow dragging when an image is expanded //? Redundant check

    //* Calculate % track has been slid, and check if its been slid enough to be considered dragging
    const mouseDelta = parseFloat(mouseDownAtRef.current) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    deltaPercentageRef.current = ((mouseDelta / maxDelta) * -100);
    if(Math.abs(mouseDelta) > 5) {
      console.log("dragging");
    } else return;

    //* Check if percentages are out of bounds. If so, set to the max/min value and return.
    if(deltaPercentageRef.current + percentageRef.current <= -100){ 
      console.log("slid all the way left", deltaPercentageRef.current + percentageRef.current); //* Track is slid all the way left
      deltaPercentageRef.current = 0;
      percentageRef.current = -100;
      mouseDownAtRef.current = e.clientX; // update mouseDownAt to the current mouse position so the next move to the right can be accepted.
      return;
    }
    
    if(deltaPercentageRef.current + percentageRef.current >= 0) { //* Track is slid all the way right
      console.log("slid all the way right", deltaPercentageRef.current + percentageRef.current); 
      deltaPercentageRef.current = 0;
      percentageRef.current = 0;
      mouseDownAtRef.current = e.clientX; // update mouseDownAt to the current mouse position so the next move to the left can be accepted.
      return;
    }

    //*  Update/Animate the track position;
    //? Store the animations in an array so they can be cancelled if an image is expanded
    isAnimating.current = true;
    const track = document.getElementById("image-track");
    track.animate({
      transform: `translate(${(deltaPercentageRef.current + percentageRef.current)}%, -50%)`
    }, {
      duration: 750, fill: "forwards"
    });
    console.log("percentage: ", -1 * (deltaPercentageRef.current + percentageRef.current),  "window width: ", window.innerWidth);
    
    //* Image Parallax Effect
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
    
    // This timeout plus the timeout for calling expandSelectedImage should add up to the duration of the sliding animation //?
    setTimeout(() => {//* Will cause bug if timeout ends before animations are complete
      isAnimating.current = false;
    }, 750); 
    console.log("Mouse up info: \nMax Delta: ", window.innerWidth / 2, "\nMouse Up at: ", mouseDownAtRef.current, "\nPercentage: ", percentageRef.current);
  };

  const handleClick = (index) => {  //* Handles clicks on posts
    // If an image is already expanded, close it. Otherwise, expand the clicked image.
    if (selectedImage !== null) {
      closeSelectedImage(selectedImage);
    } else {
      setSelectedImageInfo({ title: posts[index].title, description: posts[index].description });
      expandSelectedImage(index); // Note: removed this from setTimeout (200ms). Unsure why it was here
    }
  };

  //* Animation Functions
  const expandSelectedImage = async (index) => {  //* Expands Posts
    if(isAnimating.current){ // Prevent opening a post while sliding the track
      console.log("still animating - cant open post");
      return;
    } else if(isAnimatingOpen.current == true){  // Prevent opening a post while another is open/opening
      console.log('isAnimatingOpen');
      return;
    } else if(isPostOpenRef.current == true){
      console.log('Post Already Open');
      return;
    }
    console.log('Open post with index: ', index);
    
    //* Update the flags, as well as the selectedImage context & ref.
    isAnimatingOpen.current = true;   
    isPostOpenRef.current = true; 
    setSelectedImage(index);          
    selectedImageRef.current = index;
    updateTitleOpacity(0); // Hide the title
    const aspectRatio = getAspectRatio();          

    //* Expand selected images using index and hide others
    const images = document.querySelectorAll('.image');
    var imageDimensions = { width: 0, height: 0 };
    images.forEach((image, i) => {
      if (i !== index) {
        if (i < index) {      // Images to the left of the selected image
          image.animate({
            transform: ['translateX(-500%)']
          }, {duration: 500, fill: 'forwards', easing: 'ease-in-out'});
        } else {              // Images to the right of the selected image
          image.animate({
            transform: ['translateX(500%)']
          }, {duration: 500, fill: 'forwards', easing: 'ease-in-out'});
        }
      } else {                //* Animate the selected image
        imageDimensions = selectedImageDimensions(index);
        setTimeout(() => {    // Reveal the whole image after other images are gone
          image.animate({
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`
          }, {duration: 550, fill: 'forwards', easing: 'ease-in-out'});
        }, 10);

        setTimeout(() => {    //* Wait for image to be revealed, then translate
          if(posts[i].aspectRatio == '16:9' || (aspectRatio < 1) ){
            let rect = image.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            const targetX = (window.innerWidth / 2);
            const targetY = (window.innerHeight * 0.33);
            const deltaX = targetX - centerX;
            const deltaY = targetY - centerY;
            image.animate({
              transform: [`translate( ${deltaX}px, ${deltaY}px)`]
            }, {duration: 600, fill: 'forwards', easing: 'ease-in-out'});
          }
          else{ 
            const targetX = (window.innerWidth / 2) - (window.innerWidth * 0.02); // Center minus 2% of screen width
            const currentX = image.getBoundingClientRect().right; // Get the current position of the image
            const deltaX = targetX - currentX;
            image.animate({
            transform: ['translateX(' + deltaX + 'px)']
            }, {duration: 600, fill: 'forwards', easing: 'ease-in-out'});
            console.log(targetX, currentX, deltaX);
          }
        }, 600);
      }
    });
    
    //* Animate the image info after other animations are complete
    setTimeout(() => {
      var imageInfoElements = document.querySelectorAll('.image-info');
      if(posts[index].aspectRatio == '16:9' || (aspectRatio < 1) ){
        imageInfoElements = document.querySelectorAll('.image-info-wide');
      }
      if (imageInfoElements) {
        imageInfoElements.forEach((element) => {
          if(posts[index].aspectRatio == '16:9' || (aspectRatio < 1)){
            element.style.width = `${imageDimensions.width}px`;
          }
          else {
            element.style.height = `${imageDimensions.height}px`; //* Height of the 1:1 image-info when in row-view with image
            element.style.width = `${imageDimensions.width}px`;
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
    }, 1000);

    setTimeout(() => { //* Show media if applicable
      showMedia(index);
      isAnimatingOpen.current = false;  // Animations are complete
    }, 1500);
    
  };

  const closeSelectedImage = (index) => { //* Closes posts. index is the value of selectedImage when function was called.
    if(isAnimatingOpen.current == true){
      console.log('Cannot close post while animating open');
      return;
    }
    console.log('Closing selected post with index: ', index, selectedImage);

    // Fade out & remove image info
    var imageInfoElements = document.querySelectorAll('.image-info');
    if(posts[index].aspectRatio == '16:9' || isVerticalOrientation){
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
    }, 300);  
    

    // Remove video if it exists
    //! Bug? Doesnt remove audio?
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
          }, {duration: 600, fill: 'forwards', easing: 'ease-in-out'});
        } else {          // Images to the right of the selected image
          image.animate({
            transform: ['translateX(0%)']
          }, {duration: 600, fill: 'forwards', easing: 'ease-in-out'});
        }
      } else {            // Animate the selected image
        if(posts[i].aspectRatio == '16:9'){
          image.animate({
            transform: ['translateX(0%)'],
            width: "71vmin",
            height: "56vmin"
          }, {duration: 550, fill: 'forwards', easing: 'ease-in-out'});
        }
        else if(posts[i].aspectRatio == '1:1'){
          image.animate({
            transform: ['translateX(0%)'],
            width: "40vmin",
            height: "56vmin"
          }, {duration: 550, fill: 'forwards', easing: 'ease-in-out'});
        }
      }
    });
    
    // Post Closed - Bring back title
    //? causing bug where title reappears
    isPostOpenRef.current = false;
    updateTitleOpacity(
      (100 * ((10 + (deltaPercentageRef.current + percentageRef.current)) / 10)),
      750
    );

  };

  //* Helper Functions
  const updateTitleOpacity = (manualOpacityPercent, durationOverride) => { //* Updates the App Title opacity
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

  const selectedImageDimensions = (index) => {  //* Returns dimensions for a selected image based on the aspect ratio and available space
    var ImgDim = { width: 0, height: 0 };
    if(posts[index].aspectRatio == '1:1' && (getAspectRatio() >= 1)){
      if(((window.innerWidth / 2) - (window.innerWidth / 10)) < (window.innerHeight - (window.innerHeight/5))){
        ImgDim.width = (window.innerWidth / 2) - (window.innerWidth / 10);
        ImgDim.height = ImgDim.width;
      } else{
        ImgDim.height = window.innerHeight - (window.innerHeight/5);
        ImgDim.width = ImgDim.height;
      }
    } else if(posts[index].aspectRatio == '16:9'){
      const maxWidth = window.innerWidth - (window.innerWidth / 10);   // 5% padding on each side
      const maxHeight = window.innerHeight/2;         // Top 50% of screen
      if(maxWidth/maxHeight > 16/9){
        ImgDim.width = maxHeight * (16/9);
        ImgDim.height = maxHeight;
      } else if(maxWidth/maxHeight < 16/9){
        ImgDim.width = maxWidth;
        ImgDim.height = maxWidth * (9/16);
      } else{
        ImgDim.width = maxWidth;
        ImgDim.height = maxHeight;
      }
    } else { //* 1:1 aspect ratio, VerticalOrientation
      const maxWidth = window.innerWidth - (window.innerWidth / 10);   // 5% padding on each side
      const maxHeight = window.innerHeight/2 - (window.innerHeight / 50);         // Top 50% of screen (-2% padding)
      if(maxWidth/maxHeight > 1){
        ImgDim.width = maxHeight;
        ImgDim.height = maxHeight;
      } else if(maxWidth/maxHeight < 1){
        ImgDim.width = maxWidth;
        ImgDim.height = maxWidth;
      } else{
        ImgDim.width = maxWidth;
        ImgDim.height = maxHeight;
      }
    }
    return ImgDim;
  };

  const showMedia = (index) => {  //* Show media for post if applicable, called by expandSelectedImage()
    const images = document.querySelectorAll('.image');
    if(posts[index].contentType == 'mp4'){ //* Video
      console.log('mp4 element');
        const videoElement = document.createElement('video'); // Create a video element //** Caution: enclosing delay removed (400ms)
        videoElement.src = posts[index].content;              // Use posts content file
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
    else if(posts[index].contentType == 'mp3'){ //* Audio
      console.log('mp3 element');
      const audioElement = document.createElement('audio'); // Create an audio element
      audioElement.src = posts[index].content; // Use posts content file
      audioElement.controls = true; // Audio controls
      audioElement.controlsList = 'nodownload';
      audioElement.style.width = '25vw';
      audioElement.classList.add('mt-8');

      //* Find the image info element and append the audio element to it
      const imageInfoElement = document.querySelector('.info-panel'); //! Need to update to new class names TODO
      if (imageInfoElement) {
        console.log('Found image info element');
        imageInfoElement.appendChild(audioElement);
        audioElement.style.width = '80%';
      }
    }
  };

  //* Resize Event Functions
  handleResizeRef.current = async () => {  //* Handle resizing of window while image is expanded
    // TODO: Apply to mp4 elements
    if(selectedImageRef.current == null) return;
    const imageDimensions = selectedImageDimensions(selectedImageRef.current);
    const images = document.querySelectorAll('.image');
    const aspectRatio = getAspectRatio();
    console.log('Window was resized ' + aspectRatio, isVerticalOrientation);
    images.forEach((image, i) => {
      if(i == selectedImageRef.current){
        image.animate({
          width: `${imageDimensions.width}px`,
          height: `${imageDimensions.height}px`
        }, {duration: 0, fill: 'forwards', easing: 'ease-in-out'});
        
        // Get the current transform values for centering
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
          if(posts[i].aspectRatio == '16:9' || (aspectRatio < 1)){ //* Center the image in the top half of the screen
            let rect = image.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            const targetX = (window.innerWidth / 2);
            const targetY = (window.innerHeight * 0.33);
            const deltaX = targetX - centerX;
            const deltaY = targetY - centerY;
            image.animate({
              transform: [`translate( ${e + deltaX}px, ${f + deltaY}px)`]
            }, {duration: 0, fill: 'forwards', easing: 'ease-in-out'});

          } else if(aspectRatio >= 1){ //* Center the 1:1 image in the left half of the screen, 10% from the left
            let rect = image.getBoundingClientRect();
            const targetX = (window.innerWidth / 2) - (window.innerWidth * 0.02); // Center minus 2% of screen width
            const currentX = rect.right; // Use the right edge of the image
            const deltaX = targetX - currentX;
            const targetY = window.innerHeight / 2;
            const currentY = rect.top + (rect.height / 2);
            const deltaY =  targetY - currentY;
            image.animate({ //* Transform 1:1 image
              transform: [`translate( ${e + deltaX}px, ${f + deltaY}px)`]
            }, {duration: 0, fill: 'forwards', easing: 'ease-in-out'});

          }
        }, 50);
        //* Update image info dimensions
        setTimeout(() => {
          var imageInfoElements = document.querySelectorAll('.image-info');
          if(posts[i].aspectRatio == '16:9' || (aspectRatio < 1)){
            imageInfoElements = document.querySelectorAll('.image-info-wide');
          }
          if (imageInfoElements) {
            imageInfoElements.forEach((element) => {
              if(posts[i].aspectRatio == '16:9' || (aspectRatio < 1)){ // Vertical orientation, else Horizontal
                element.style.width = `${imageDimensions.width}px`;
                console.log('updated info width: ', imageDimensions.width);
                element.style.opacity = '1';  // Show the image info
              } else {
                element.style.height = `${imageDimensions.height}px`; //* Height of the 1:1 image-info when in row-view with image
                console.log('updated info height: ', imageDimensions.height);
                element.style.opacity = '1';  // Show the image info (because changing between orientations resets css classes --> opacity to default of 0)
              }
            });
          }
          //* Update the video element if it exists
          const videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.style.width = `${imageDimensions.width}px`;
            videoElement.style.height = `${imageDimensions.height}px`;
            console.log('updated video dimensions');
            // Update video location to cover image
            videoElement.style.top = `${image.getBoundingClientRect().top}px`;
            videoElement.style.left = `${image.getBoundingClientRect().left}px`;
          }

        }, 100);
      }
    });
  };

  const getAspectRatio = () => window.innerWidth / window.innerHeight;

  const updateOrientation = () => { //* Update the orientation based on the aspect ratio
    const aspectRatio = getAspectRatio();
    setIsVerticalOrientation(aspectRatio < 1);
    console.log('Is vertical: ', (aspectRatio < 1), '\nAspect Ratio: ', aspectRatio, '\nManual AR: ', window.innerWidth / window.innerHeight);
  };

  useEffect(() => { //* Set function in the context so it can be called from the root component
    setCloseSelectedImage(() => closeSelectedImage);
  }, [selectedImage]);

  useEffect(() => { //* Mount the mousedown event listener
    const track = document.getElementById("image-track");
    track.addEventListener('mousedown', handleMouseDown);
    return () => {
      track.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => { //* Mount the resize event listener
    updateOrientation(); // Initial check
    let resizeTimeout;
    const handleResize = () => { //* "Debounce" the resize event: Wait for 1s after the last resize event before calling handleResizeRef.current
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => { 
        if (handleResizeRef.current) {
          updateOrientation();
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

  useEffect(() => { //* Cleanup lingering media elements when the component unmounts
    return () => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.parentNode.removeChild(videoElement);
      }
  
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.parentNode.removeChild(audioElement);
      }
    };
  }, []);

  return (
    <div className='w-full h-full'>
      <div id="image-track">
        {posts.map((post, index) => ( 
          (post.aspectRatio == '16:9') ? (
            <img key={index}
            className='image img-wide drop-shadow-2xl shadow-inner shadow-black'
            src={post.image}
            draggable="false"
            onClick={() => handleClick(index)}
            />
          ) : (post.aspectRatio == '1:1') && (
            <img key={index}
            className='image img-md drop-shadow-2xl shadow-inner shadow-black'
            src={post.image}
            draggable="false"
            onClick={() => handleClick(index)}
            />
          )
        ))}
      </div>
      
      {/* App ProfileName and Subheading */}
      <div className='title-panel ml-5 sm:ml-10 lg:ml-20 flex flex-col justify-center'>
        <h1 style={{textDecoration: 'underline'}} className='text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-mono my-2'> {collectionInfo?.title || 'LookBook'} </h1>
        <h2 className='text-lg sm:text-2xl lg:text-4xl font-mono md:my-2'>   {collectionInfo?.subtitle !== undefined && collectionInfo?.subtitle !== null
          ? collectionInfo.subtitle
          : 'Aesthetic and Professional Portfolios'} 
        </h2>
      </div>

      {/* Image Info */}
      {selectedImage !== null ? (
      <div className={`${((posts[selectedImage].aspectRatio == '1:1') && !isVerticalOrientation) ? 'info-container-col info-container' : 'info-container-col'}`}>

        <div className={`${((posts[selectedImage].aspectRatio == '1:1') && !isVerticalOrientation) ? 'img-panel-wide img-panel' : 'img-panel-wide'}`}/>

          {/* Vertically Stacked Orientation */}
          {((posts[selectedImage].aspectRatio == '16:9') || isVerticalOrientation) &&  
          (<div key="vertical" className='info-panel-wide flex flex-col items-center justify-start p-4'>
            <div className='bg-card text-card-foreground image-info-wide px-6 py-4 mx-3 rounded-xl flex flex-col justify-around'>
              <div className='flex flex-row justify-between items-center'>
                <h1 className='h-max font-mono font-bold text-lg mb-2'>
                  {selectedImageInfo.title}
                </h1>
                {/* Like Button */}
                {isLoggedIn && (
                  <LikeButton
                    isLiked={posts[selectedImage].isLiked}
                    onLike={() => handleLike(posts[selectedImage].id)}
                  />
                )}
              </div>
                
              <p className='info-text w-full h-min font-mono text-base break-words'>{selectedImageInfo.description}</p>
            </div>
          </div>)}

          {/* Side by Side Orientation */}
          {((posts[selectedImage].aspectRatio == '1:1') && !isVerticalOrientation) &&  
          (<div key="horizontal" className='info-panel flex pl-[2%] pr-[4%]'>
            <div className='bg-card text-card-foreground image-info px-10 py-4 rounded-xl flex flex-col justify-around'>
              <div className='flex flex-row justify-between items-center'>
                <h1 className='h-[15%] font-mono font-bold text-lg mb-2'>
                  {selectedImageInfo.title}
                </h1>

                {/* Like Button */}
                {isLoggedIn && (
                  <LikeButton
                    isLiked={posts[selectedImage].isLiked}
                    onLike={() => handleLike(posts[selectedImage].id)}
                  />
                )}
              </div>
              <p className='info-text w-full h-[80%] text-base font-mono break-words'>{selectedImageInfo.description}</p>
            </div>
          </div>)}
        
      </div>)
      : (
        <div className="flex w-full h-[15%] justify-center items-center sm:pt-[5%] select-none font-mono">
          {userToView ?
            userToView === 'example' ? (
              <span>
                By{' '}
                <Link to={`/bio`} className="underline">
                  Jane Doe
                </Link>
              </span>
            ) : (
              <span>
                By{' '}
                <Link to={`/bio/${userToView.id}`} className="underline">
                  {userToView.displayName}
                </Link>
              </span>
            )
          : null}
        </div>
      )}
  
    </div>
  );
}

export default ImageTrack;