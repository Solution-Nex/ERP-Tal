import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Companycreation from "./company/Compneycreation";

const Home = () => {
  return (
    <div className="flex">
      <div>
        <Header />
        <Companycreation />
        <Footer />
      </div>
      <div className="w-36 flex flex-col bg-primary text-white">
        {Array.from({ length: 1 }).map((_, i) => (
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
