interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({title, children }:SectionProps) => (
  <div className="">
    <h3 className=" text-center underline text-sm my-2  text-accent">
      {title}
    </h3>
    {children}
  </div>
);
export default Section;