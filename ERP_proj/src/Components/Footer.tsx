import React from "react";

const FooterButton = ({ text, alpha }: { text?: string; alpha?: string }) => (
  <button className="w-[6em] h-10 flex items-start justify-start border-2 border-gray-400 px-2 py-2 text-gray-500 gap-1">
    <span className="underline">{alpha}</span>
    <span>{text}</span>
  </button>
);

const Footer: React.FC = () => {
  return (
    <div className="bg-[#B8E0B8] w-full">
      <div className="flex items-center justify-between">
        <FooterButton alpha="Q:" text="Quit" />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
        <FooterButton />
      </div>
    </div>

  );
};

export default Footer;
