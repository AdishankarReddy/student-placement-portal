import Layout from "../../Layout";
import Companies from "../cse/Companies";

const ME = () => {
  return (
    <Layout>
      <div className="bg-gray-100 text-center min-h-screen">
      {/* Navbar */}
      <div className="bg-gray-700 text-white py-6 text-2xl font-bold transition duration-300 hover:bg-gray-800 hover:text-yellow-500 cursor-pointer">
        WELCOME TO MECHANICAL ENGINEERING
      </div>

      {/* Content */}
      <div className="mt-12 mx-auto bg-white p-8 rounded-lg shadow-lg w-3/4">
        {/* Tagline */}
        <div className="flex justify-center">
          <p className="text-lg text-white italic bg-gray-800 px-20 py-8 rounded-lg inline-block transition-transform transform hover:scale-90 hover:bg-gray-700">
            "Machines rule the world, but mechanical engineers make them work!"
          </p>
        </div>
      </div>
      <Companies branch={"ME"}/>
    </div>
    </Layout>
  );
};

export default ME;
