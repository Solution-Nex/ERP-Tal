import React from "react";

const FooterButton = ({ text, alpha }: { text?: string; alpha?: string }) => (
  <button className="w-[6em] h-10 flex items-center justify-start border border-muted px-3 text-muted gap-2 rounded-sm bg-transparent">
    <span className="underline">{alpha}</span>
    <span>{text}</span>
  </button>
);

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-surface border-t border-muted">
      <div className="flex items-center justify-between px-3 py-2">
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
