interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({title, children }:SectionProps) => (
  <div className="mb-1 border border-gray-500 rounded-md mt-4 p-3 shadow-sm">
    <h3 className="font-semibold text-center underline mb-2 text-accent">
      {title}
    </h3>
    {children}
  </div>
);
export default Section;