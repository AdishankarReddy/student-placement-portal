import Layout from "../../Layout";
import Companies from "../cse/Companies";

const CIVIL = () => {
  return (
    <Layout>
      <div>
      {/* Navbar */}
      <div className="header-container">WELCOME TO CIVIL ENGINEERING</div>

      {/* Content */}
      <div className="container">
        <div className="tagline-container">
          <p className="tagline">"Building the future, one structure at a time!"</p>
        </div>
      </div>
      <Companies/>
    </div>
    </Layout>
  );
};

export default CIVIL;
