import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { toast } from "react-hot-toast";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "http://localhost:8080/api"; // Backend URL

const Home = () => {
  const [showGraph, setShowGraph] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const marqueeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [placedCount, setUpdateCount] = useState({ cse: 0, ece: 0, eee: 0, me: 0, che: 0, ce: 0, mme: 0 });
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    // Check login status
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!username && !!token);
    fetchCompanies();
    fetchStudents('CSE');
    fetchStudents('ECE');
    fetchStudents('EEE');
    fetchStudents('ME');
    fetchStudents('CHE');
    fetchStudents('CE');
    fetchStudents('MME');
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/companies/CSE`);
      setCompanies(response.data);
    } catch (error) {
      toast.error("Error fetching companies");
      console.error("Error fetching companies:", error);
    }
  };


  // Fetch students data
  const fetchStudents = async (branch) => {
    if (!branch) {
      setError('Please select a branch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:8080/api/students/${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Ensure response data is an array
      const studentsData = Array.isArray(response.data.students) ? response.data.students : [];

      setStudents(studentsData);
      let filtered = studentsData.filter(student => student.status === 'placed');
      setUpdateCount(prevState => ({
        ...prevState,
        [branch.toLowerCase()]: filtered.length
      }));
    } catch (err) {
      setError('Failed to fetch students data. Please try again.');
      console.error('Error fetching students:', err);
      // Initialize with empty arrays on error
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  // Chart data
  const chartData = {
    labels: ['CSE', 'ECE', 'EEE', 'ME', 'CHE', 'CE', 'MME'],
    datasets: [{
      label: "Students Placed",
      data: [placedCount.cse, placedCount.ece, placedCount.eee, placedCount.me, placedCount.che, placedCount.ce, placedCount.mme],
      backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    scales: {
      y: { beginAtZero: true }
    }
  };

  const colors = [
    "text-red-600",
    "text-green-600",
    "text-blue-600",
    "text-yellow-600",
    "text-purple-600",
    "text-pink-600",
    "text-indigo-600",
    "text-teal-600",
    "text-orange-600"
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex flex-col scroll-smooth">
      {/* Title Section */}
      <section className="text-center py-4 bg-blue-200 shadow-md flex justify-center">
        <div className="max-w-xl w-full px-6">
          <h1 className="text-4xl font-bold text-blue-700">Student Placement Portal</h1>
          <p className="text-gray-700 font-bold mt-1 text-lg">Your gateway to career opportunities</p>
        </div>
      </section>

      {/* Navigation Bar */}
      <Navbar />

      {/* Upcoming Drive Updates (Side Scrolling) */}
      <div className="bg-gray-200 py-2 overflow-hidden whitespace-nowrap">
        <div ref={marqueeRef} className="inline-block" style={{
          animation: 'marquee 15s linear infinite'
        }}>
          {companies.map((item, i) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <span key={i} className={`${randomColor} font-bold mx-8`}>
                {item.companyName} - {item.noOfVacancies}
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Sections */}
      <div className="relative flex-grow overflow-y-auto pr-4" id="scroll-container">
        {/* Home Section */}
        <section
          id="home"
          className="p-10 text-center flex flex-col lg:flex-row justify-between items-start  relative"
        >
          <div className="flex-1">
            <h2
              className="text-4xl font-bold text-blue-600"
              style={{ animation: "bounce 1s infinite" }}
            >
              Welcome to the Student Placement Portal
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              Connecting students with career opportunities.
            </p>
          </div>

          {/* Placement Updates Box */}
          <div className="mt-10 bg-white p-4 shadow-lg rounded-lg w-72 h-72 overflow-hidden border-r-4 border-blue-600 hidden lg:block">
            <div className="h-full overflow-hidden relative">
              <ul
                className="text-gray-700 space-y-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  animation: "scroll 12s linear infinite",
                }}
              >
                <li>🎓 John Doe - Google (CSE)</li>
                <li>🎓 Sarah Lee - Microsoft (CSE)</li>
                <li>🎓 Alex Smith - Amazon (ECE)</li>
                <li>🎓 Emma Brown - Facebook (ME)</li>
                <li>🎓 Chris Johnson - Tesla (EE)</li>
                <li>🎓 Sophia Martinez - Apple (CSE)</li>
                <li>🎓 Daniel Wilson - IBM (Civil)</li>
                <li>🎓 Olivia White - Intel (CSE)</li>
                <li>🎓 William Green - Adobe (CSE)</li>
                <li>🎓 Ava Thompson - Netflix (ECE)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* About Us Section - Fixed to ensure visibility */}
        <section id="about" className="p-10 bg-gray-100 text-center min-h-screen">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">About Us</h2>
            <p className="mt-4 text-gray-700 text-lg">Our Student Placement Portal serves as a comprehensive platform showcasing real-time placement activities within our university. We provide transparent information about companies recruiting on campus, placement statistics across all B.Tech departments, and essential tools for career preparation.</p>
            
            {/* Features Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-blue-600">Key Features</h3>
              <ul className="mt-6 text-left text-lg text-gray-700 space-y-4">
                <li><span className="font-semibold">Live Company Updates:</span> Track active recruiters and available positions in real-time</li>
                <li><span className="font-semibold">Department-wise Analytics:</span> View placement statistics across CSE, ECE, EEE, ME, CHE, CE and MME departments</li>
                <li><span className="font-semibold">Placement Visualization:</span> Interactive graphs showing placement performance by department</li>
                <li><span className="font-semibold">Resume Checker:</span> AI-powered tool to optimize your resume for better results</li>
                <li><span className="font-semibold">Placement Status Tracking:</span> Monitor placed vs. unplaced students in each department</li>
              </ul>
            </div>
            
            {/* Purpose Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-blue-600">Our Purpose</h3>
              <p className="mt-4 text-gray-700 text-lg">"We're committed to enhancing the placement experience for all students by providing transparency and information about industry opportunities. Our portal bridges the gap between university education and industry requirements by making placement data accessible and clear.</p>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12">
              {/* <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl shadow-lg hover:bg-blue-700 transition duration-300">Get Started Today</button> */}
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="p-10 bg-white text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-blue-600">Analytics</h2>
          <p className="mt-4 text-gray-700 text-lg">Explore placement trends and insights.</p>

          {/* Button to Show Graph */}
          <button
            onClick={() => setShowGraph(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Show Placement Graph
          </button>

          {/* Graph Container */}
          {showGraph && (
            <div className="mt-6 flex justify-center items-center w-full h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="p-10 bg-gray-100 text-center">
          <h2 className="text-3xl font-bold text-blue-600">Contact Us</h2>
          <p className="mt-4 text-gray-700 text-lg">For any queries, feel free to reach out to us:</p>

          <div className="mt-8 flex justify-center space-x-8">
            {/* Phone Icon */}
<a href="tel:+7075828829" className="text-blue-600 hover:text-blue-800 transition duration-300">
  <i className="fas fa-phone-alt text-4xl"></i>
  <p className="mt-2 text-sm text-gray-700">Call Us: +91 707582 8829</p>
</a>

{/* Email Icon */}
<a href="mailto:n200671@rguktn.ac.in" className="text-blue-600 hover:text-blue-800 transition duration-300">
  <i className="fas fa-envelope text-4xl"></i>
  <p className="mt-2 text-sm text-gray-700">Email Us</p>
</a>

            {/* LinkedIn Icon */}
            <a href="https://www.linkedin.com/in/adishankar-reddy-patti-7310b4254/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300">
              <i className="fab fa-linkedin text-4xl"></i>
              <p className="mt-2 text-sm text-gray-700">Follow Us</p>
            </a>
          </div>

          <div className="mt-8 text-gray-600">
            <p className="text-lg">We'd love to hear from you!</p>
          </div>
        </section>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Home;