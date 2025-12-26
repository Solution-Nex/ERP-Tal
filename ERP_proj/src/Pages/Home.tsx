import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Companycreation from "./Compneycreation";

const Home = () => {
  return (
    <div className="flex ">
      <div className="flex-1 overflow-auto">
        
        <Header />
        <Companycreation />
        <Footer />
      </div>
      <div className="w-32 flex flex-col gap-1 bg-primary text-white">
        {Array.from({ length: 17 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary/90 h-[39.5px] text-white text-center"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Home;
