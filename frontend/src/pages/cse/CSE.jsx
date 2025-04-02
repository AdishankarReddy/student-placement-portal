import { useState } from "react";
import Layout from "../../Layout";
import Companies from "./Companies";


export default function CSE() {

  return (
   <Layout>
     <div className="bg-gray-100 min-h-screen text-center">
      {/* Navbar */}
      <div className="bg-gray-800 text-white text-2xl font-bold py-6 transition hover:bg-gray-900 hover:text-yellow-400 cursor-pointer">
        WELCOME TO COMPUTER SCIENCE AND ENGINEERING
      </div>

      {/* Tagline */}
      <div className="flex justify-center mt-10">
        <p className="text-lg text-white italic bg-gray-800 py-6 px-16 rounded-lg transition-transform transform hover:scale-90 hover:bg-gray-900">
          "Programming isn't about what you know; it's about what you can figure out." – Chris Pine
        </p>
      </div>

      <Companies/>
    </div>
   </Layout>
  );
}