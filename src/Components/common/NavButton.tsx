export const NavButton = ({ text, alpha }: { text?: string; alpha?: string }) => (
  <button className=" h-10 flex items-center hover:bg-blue-500 hover:text-white justify-start px-3 text-muted gap-2 bg-transparent">
    <span className="underline">{alpha}</span>
    <span>{text}</span>
  </button>
);