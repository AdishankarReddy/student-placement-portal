import Layout from "../../Layout";
import Companies from "../cse/Companies";

const ECE = () => {
  return (
    <Layout>
      <div className="bg-gray-100 text-center min-h-screen">
      {/* Navbar */}
      <div className="header-container">
        WELCOME TO ELECTRONICS & COMMUNICATION ENGINEERING
      </div>

      {/* Content */}
      <div className="mt-12 mx-auto bg-white p-8 rounded-lg shadow-lg w-3/4">
        {/* Tagline */}
        <div className="tagline-container">
          <p className="tagline">
            "Connecting the world, one signal at a time!"
          </p>
        </div>
      </div>

      <Companies branch={"ECE"}/>
    </div>
    </Layout>
  );
};

export default ECE;
