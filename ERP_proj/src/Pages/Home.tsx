import React from "react";
import Header from '../Components/Header';
import Footer from "../Components/Footer";
import Companycreation from "./Compneycreation";

const Home = () => {
  return (
    <div className="w-screen flex ">
      <div className="flex-1 overflow-auto">
        <Header/>
        <Companycreation/>
        <Footer/>
      </div>
       <div className="w-32 h-full flex flex-col gap-1 bg-[#0B3A33]">
    {Array.from({ length: 17 }).map((_, i) => (
      <div key={i} className="bg-[#115445] h-[39.5px] text-white text-center">
        
      </div>
    ))}
  </div>
    </div>
  );
};

export default Home;