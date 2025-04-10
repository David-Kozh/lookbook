import { useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils.js";

//* Component created by editing ParallaxScroll from ui.aceternity.com
//* Added explicit column structure for images to fix display error 
// (Error: a single image would be displayed in the wrong position when number of columns changed in grid).
export const ParallaxScroll = ({
  images,
  className,
  onClick,
  demoFlag = false 
}) => {
  const gridRef = useRef(null);
  const [numColumns, setNumColumns] = useState(3); // Default to 3 columns

  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });
  
  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Dynamically determine the number of columns based on screen size
  useEffect(() => {
    const updateNumColumns = () => {
      if (window.innerWidth >= 1024) {
        setNumColumns(3); // Large screens (lg:grid-cols-3)
      } else if (window.innerWidth >= 768) {
        setNumColumns(2); // Medium screens (md:grid-cols-2)
      } else {
        setNumColumns(1); // Small screens (grid-cols-1)
      }
    };

    updateNumColumns(); // Set initial value
    window.addEventListener("resize", updateNumColumns); // Update on resize
    return () => window.removeEventListener("resize", updateNumColumns);
  }, []);

  // Dynamically distribute images into the correct number of columns
  const columns = useMemo(() => {
    const newColumns = Array.from({ length: numColumns }, () => []);
    images.forEach((image, index) => {
      newColumns[index % numColumns].push(image);
    });
    return newColumns;
  }, [images, numColumns]);

  return (
    <div
      className={cn("h-full items-start overflow-y-auto w-full parallax-scroll-container", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-20 px-10"
      >
        {columns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col gap-10 select-none">
            {column.map((image, idx) => (
              <motion.div
                key={`col-${columnIndex}-img-${idx}`}
                onClick={
                  !demoFlag && onClick  // Check that this is not demo component
                    ? () => onClick(image.userId, image.collectionId) // Pass userId and collectionId if not in demo mode, to navigate to collection
                    : undefined
                }
                style={{
                  y:
                    columnIndex === 0
                      ? translateFirst
                      : columnIndex === 1
                      ? translateSecond
                      : translateThird,
                }}
              >
                <img
                  src={image.thumbnailUrl}
                  className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};