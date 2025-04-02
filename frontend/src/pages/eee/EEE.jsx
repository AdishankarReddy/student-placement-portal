import Layout from "../../Layout";

const EEE = () => {
  return (
   <Layout>
     <div className="bg-gray-100 text-center min-h-screen">
      {/* Navbar */}
      <div className="bg-gray-800 text-white py-6 text-2xl font-bold transition duration-300 hover:bg-gray-900 hover:text-black cursor-pointer">
        WELCOME TO ELECTRICAL ENGINEERING
      </div>

      {/* Content */}
      <div className="mt-12 mx-auto bg-white p-8 rounded-lg shadow-lg w-3/4">
        {/* Tagline */}
        <div className="flex justify-center">
          <p className="text-lg text-white italic bg-gray-900 px-20 py-8 rounded-lg inline-block transition-transform transform hover:scale-90 hover:bg-gray-800">
            "Empowering the world, one circuit at a time!"
          </p>
        </div>
      </div>
    </div>
   </Layout>
  );
};

export default EEE;