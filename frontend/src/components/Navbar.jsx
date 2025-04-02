import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar(){
    const navigate = useNavigate();
    const {user,logout}  = useAuth();
    return   <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
    <div className="flex items-center space-x-4">
      <Link to="/" className="text-white text-lg font-bold">Placement Portal</Link>
      <ul className="flex space-x-6">
        <li><a href="/#home" className="text-white flex items-center hover:text-gray-300"><i className="fas fa-home mr-2"></i> Home</a></li>
        <li><a href="/#about" className="text-white flex items-center hover:text-gray-300"><i className="fas fa-info-circle mr-2"></i> About</a></li>
        <li><a href="/#contact" className="text-white flex items-center hover:text-gray-300"><i className="fas fa-envelope mr-2"></i> Contact</a></li>
        <li><a href="/#analytics" className="text-white flex items-center hover:text-gray-300"><i className="fas fa-chart-line mr-2"></i> Analytics</a></li>

        {/* Branches Dropdown */}
        <li className="relative group">
          <a href="#" className="text-white flex items-center hover:text-gray-300">
            <i className="fas fa-graduation-cap mr-2"></i> Branches
          </a>
          {/* Dropdown Menu */}
          <ul className="absolute left-0 top-4 mt-2 hidden group-hover:flex hover:flex flex-col bg-white text-black shadow-lg mt-2 w-48 rounded-lg">
            <li><Link to="/cse" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-laptop-code mr-2"></i> CSE</Link></li>
            <li><Link to="/me" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-cogs mr-2"></i> MECH</Link></li>
            <li><Link to="/eee" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-bolt mr-2"></i> EEE</Link></li>
            <li><Link to="/civil" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-building mr-2"></i> CIVIL</Link></li>
            <li><Link to="/ece" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-microchip mr-2"></i> ECE</Link></li>
            <li><Link to="/chem" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-microchip mr-2"></i> CHEM</Link></li>
            <li><Link to="/mme" className="block px-4 py-2 hover:bg-gray-200 flex items-center"><i className="fas fa-microchip mr-2"></i> MME</Link></li>
          </ul>
        </li>
      </ul>
    </div>

    <div className="flex space-x-4">
      {/* Placement Status */}
      <Link to="/status" className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center">
        <i className="fas fa-check-circle mr-2"></i> Placement Status
      </Link>
      
      {/* Upload Resume Button */}
      <Link to="/resume" className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center"> 
        <i className="fas fa-upload mr-2"></i> Upload Resume
      </Link>
      
      {/* Login/Logout Button */}
      {user ? (
        <button 
          onClick={()=>{
            logout();
            navigate("/login");
          }}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      ) : (
        <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center">
          <i className="fas fa-sign-in-alt mr-2"></i> Login
        </Link>
      )}
    </div>
  </nav>
}