import React from 'react';

const RightButtonGroup = ({ selectedIndex, postsLength }) => {
  return (
    <div className="h-[60%] flex flex-col rounded-xl bg-zinc-500 
        p-0 text-xs sm:text-sm w-full shadow-lg shadow-black/30 max-w-14">
      
      {<div className="flex w-full flex-col justify-between items-center rounded-xl bg-zinc-500 gap-0.5 pb-0.5 h-full">
        <a href={`#slide${selectedIndex == 0 ? (postsLength - 1) : (selectedIndex - 1)}`} className="btn w-full border-none h-1/2 min-h-10 rounded-none rounded-t-xl hover:bg-slate-700">❮</a> 
        <a href={`#slide${(selectedIndex + 1) % (postsLength)}`} className="btn w-full rounded-none min-h-10 border-none h-1/2 rounded-b-xl hover:bg-slate-700">❯</a>
      </div>}

    </div>
  );
};

export default RightButtonGroup;