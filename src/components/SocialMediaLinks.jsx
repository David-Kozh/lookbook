import React from 'react';
//* Displays links in top right corner of profile 
//* (rendered in ProfileSection.jsx)
//? Add an svg/link for a personal website?
const MediaLinks = ({ mode, mediaLinks, isMobile }) => {
    console.log('LINKS:  ', mediaLinks, '\n', mode, isMobile);
    const defaultLinks = {
        linkedin: "https://www.linkedin.com",
        instagram: "https://www.instagram.com",
        youtube: "https://www.youtube.com",
        twitter: "https://www.twitter.com"
    };

    const links = (mode === 'example') ? defaultLinks : mediaLinks;

    const instagramIdA = isMobile ? 'a' : 'c';
    const instagramIdB = isMobile ? 'b' : 'd';
    const size = isMobile ? 24 : 26;
    const youtubeSize = isMobile ? 32 : 35;

    return (
        <div className="flex w-full justify-end gap-4 md:gap-5">
            {links.linkedin && (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="#fff" aria-label="LinkedIn" viewBox="0 0 512 512" id="linkedin">
                        <rect width="512" height="512" fill="#0077b5" rx="15%"></rect>
                        <circle cx="142" cy="138" r="37"></circle>
                        <path stroke="#fff" strokeWidth="66" d="M244 194v198M142 194v198"></path>
                        <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32"></path>
                    </svg>
                </a>
            )}
            {links.instagram && (
                <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 102 102" id="instagram">
                        <defs>
                            <radialGradient id={instagramIdA} cx="6.601" cy="99.766" r="129.502" gradientUnits="userSpaceOnUse">
                                <stop offset=".09" stopColor="#fa8f21"></stop>
                                <stop offset=".78" stopColor="#d82d7e"></stop>
                            </radialGradient>
                            <radialGradient id={instagramIdB} cx="70.652" cy="96.49" r="113.963" gradientUnits="userSpaceOnUse">
                                <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0"></stop>
                                <stop offset="1" stopColor="#8c3aaa"></stop>
                            </radialGradient>
                        </defs>
                        <path fill={`url(#${instagramIdA})`} d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                        <path fill={`url(#${instagramIdB})`} d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                        <path fill="#fff" d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229" transform="translate(-422.637 -426.196)"></path>
                    </svg>
                </a>
            )}
            {links.youtube && (
                <a href={links.youtube} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width={youtubeSize} height={size} viewBox="0 0 448 313.6" id="youtube">
                        <g transform="translate(-32 -99.2)">
                            <g strokeWidth="2.404" transform="translate(314.594 428.651)scale(.41603)">
                                <path fill="#fff" d="M -248.52492,-576.52087 32.650165,-414.99475 -248.52492,-253.4686 Z"></path>
                                <path fill="#fe0000" d="m 373.64966,-675.23131 c -11.96482,-44.86836 -47.85953,-80.76301 -92.7279,-95.7192 -83.75426,-20.93853 -421.76258,-20.93853 -421.76258,-20.93853 0,0 -338.00826,0 -421.76265,20.93853 -44.8683,14.95619 -80.76302,50.85084 -92.7279,95.7192 -23.92983,83.75432 -23.92983,260.23656 -23.92983,260.23656 0,0 0,173.49097 23.92983,260.2365 11.96488,44.86836 47.8596,80.763051 92.7279,92.727916 83.75439,23.929827 421.76265,23.929827 421.76265,23.929827 0,0 338.00832,0 421.76258,-23.929827 44.86837,-11.964865 80.76308,-47.859556 92.7279,-92.727916 23.92984,-86.74553 23.92984,-260.2365 23.92984,-260.2365 0,0 0,-176.48224 -23.92984,-260.23656 z m -622.17457,421.76266 c 0,-323.05221 0,-323.05221 0,-323.05221 281.175075,161.52611 281.175075,161.52611 281.175075,161.52611 z"></path>
                            </g>
                        </g>
                    </svg>
                </a>
            )}
            {links.twitter && (
                <a href={links.twitter} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 512 512" id="twitter">
                        <g clipPath="url(#clip0_84_15697)">
                            <rect width="512" height="512" fill="#000" rx="60"></rect>
                            <path fill="#fff" d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_84_15697">
                                <rect width="512" height="512" fill="#fff"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </a>
            )}
        </div>
    );
};

export default MediaLinks;