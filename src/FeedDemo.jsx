import { useState, useEffect } from "react";
import { ParallaxScroll } from "./components/ui/parallax-scroll";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import Image1 from './media/Image1.jpg';
import Image2 from './media/Image2.jpg';
import Image3 from './media/Image3.jpg';
import Image4 from './media/Image4.jpg';
import Image5 from './media/Image5.jpg';
/*
"https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
"https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
"https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
"https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
*/
const demoThumbnails = [
    Image1, 
    Image2, 
    Image3, 
    Image4, 
    Image5
];
const demoPosts = [
    Image5, 
    Image4, 
    Image3, 
    Image2, 
    Image1
];
//TODO: 
// Make all demo images link to demo posts
// Change demo images to example posts when selectedFeed changed

export function ParallaxScrollDemo() {
    const [selectedFeed, setSelectedFeed] = useState("Following"); // Track selected feed
    const navigate = useNavigate();

    const handleDemoClick = () => {
      navigate("/posts"); // Navigate to /posts when an image is clicked
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="flex w-[92%] h-[5%] justify-between items-center bg-card rounded-xl">
                <p className="text-card-foreground font-mono ml-4 text-lg select-none">{selectedFeed == 'Following' ? 'Recent from Followed Users' : 'Liked Posts'}</p>
                <Select 
                    defaultValue="Following"
                    onValueChange={(value) => setSelectedFeed(value)} // Update selected feed
                >
                <SelectTrigger className="w-[24%] max-w-32 h-min bg-input text-card-foreground mr-2 sm:mr-4 font-mono text-xs md:text-sm">
                    <SelectValue placeholder="Following"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className='text-xs font-mono' value="Following">Following</SelectItem>
                    <SelectItem className='text-xs font-mono' value="Liked Posts">Liked Posts</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <ParallaxScroll 
                className='h-[80.5%] sm:h-[87%]' 
                images={(selectedFeed === "Liked Posts" ? demoPosts : demoThumbnails).map((thumb) => ({
                    thumbnailUrl: thumb,
                }))} 
                onClick={handleDemoClick}
                demoFlag={true}
            />
        </div>
    );
}

