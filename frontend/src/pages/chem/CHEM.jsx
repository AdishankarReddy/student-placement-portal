import Layout from "../../Layout";
import Companies from "../cse/Companies";

const CHEM = () => {
  return (
   <Layout>
     <div>
      {/* Navbar */}
      <div className="header-container">WELCOME TO THE CHEMICAL ENGINEERING DEPARTMENT</div>

      {/* Content */}
      <div className="container">
        <div className="tagline-container">
          <p className="tagline">"Transforming molecules into solutions, one reaction at a time!"</p>
        </div>
      </div>
      <Companies branch={"CHE"}/>
    </div>
   </Layout>
  );
};

export default CHEM;
