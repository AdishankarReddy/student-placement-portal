import Layout from "../../Layout";
import Companies from "../cse/Companies";


const MME = () => {
  return (
   <Layout>
     <div>
      {/* Navbar */}
      <div className="header-container">WELCOME TO THE METALLURGY ENGINEERING DEPARTMENT</div>

      {/* Content */}
      <div className="container">
        <div className="tagline-container">
          <p className="tagline">"Forging the future, one alloy at a time!"</p>
        </div>
      </div>
      <Companies branch={"MME"}/>
    </div>
   </Layout>
  );
};

export default MME;
