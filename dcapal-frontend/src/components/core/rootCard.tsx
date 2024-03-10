import React from "react";

export const RootCard = ({ id, imgSrc, text }) => {
  return (
    <div
      id={id}
      className="w-full min-h-[11.5rem] max-h-[11.5rem] flex flex-col gap-y-2 items-center justify-center bg-[#ededed] rounded"
    >
      <img
        alt="Icon homepage"
        className="w-full max-w-[4rem] p-1 rounded-full bg-neutral-600"
        src={imgSrc}
      />
      <div className="w-4/5 text-xl text-center font-light">{text}</div>
    </div>
  );
};
