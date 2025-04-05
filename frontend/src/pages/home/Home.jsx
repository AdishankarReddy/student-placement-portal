import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Navbar from '../../components/Navbar';
import axios from 'axios';

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

  useEffect(() => {
    // Check login status
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!username && !!token);
    fetchStudents('CSE');
    fetchStudents('ECE');
    fetchStudents('EEE');
    fetchStudents('ME');
    fetchStudents('CHE');
    fetchStudents('CE');
    fetchStudents('MME');
  }, []);

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
          <span className="text-blue-600 font-bold mx-8">🚀 Google Drive - 20-03-25 - CSE</span>
          <span className="text-green-600 font-bold mx-8">📌 Microsoft Drive - 15-04-25 - IT</span>
          <span className="text-red-600 font-bold mx-8">🔧 Tesla Drive - 13-04-25 - ME</span>
          <span className="text-purple-600 font-bold mx-8">⚡ Amazon Drive - 06-04-25- ECE</span>
          <span className="text-orange-600 font-bold mx-8">🏗️ L&T Drive - 28-04-25- Civil</span>
        </div>
      </div>

      {/* Main Sections */}
      <div className="relative flex-grow overflow-y-auto pr-4" id="scroll-container">
        {/* Home Section */}
        <section id="home" className="p-10 text-center flex flex-col justify-start items-center min-h-screen">
          <h2 className="text-4xl font-bold text-blue-600" style={{ animation: 'bounce 1s infinite' }}>Welcome to the Student Placement Portal</h2>
          <p className="mt-4 text-gray-700 text-lg">Connecting students with career opportunities.</p>
        </section>

        {/* Placement Updates Box (Fixed Bottom-Right, Only On Home Page) */}
        <div className="fixed right-4 bottom-4 bg-white p-4 shadow-lg rounded-lg w-72 h-72 overflow-hidden border-l-4 border-blue-600 hidden lg:block">
          <h3 className="text-lg font-bold text-blue-600 text-center mb-2">Placement Updates</h3>
          <div className="h-full overflow-hidden relative">
            <ul className="text-gray-700 space-y-2" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'scroll 12s linear infinite'
            }}>
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

        {/* About Us Section */}
        <section id="about" className="p-10 bg-gray-100 text-center min-h-screen relative overflow-hidden">
          {/* Title and Description */}
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-blue-600">About Us</h2>
            <p className="mt-4 text-black text-lg">We help students connect with top companies for internships and placements. Our mission is to bridge the gap between talent and opportunity.</p>

            {/* Values Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-blue-600">Our Core Values</h3>
              <ul className="mt-6 text-left text-lg text-black space-y-4">
                <li>Personalized Career Guidance</li>
                <li>Industry Connections with Leading Companies</li>
                <li>Skill Development Resources for Success</li>
              </ul>
            </div>

            {/* Call to Action */}
            <div className="mt-12">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl shadow-lg hover:bg-blue-700 transition duration-300">Get Started Today</button>
            </div>
          </div>

          {/* Background Animation */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-200 bg-opacity-30 z-0"></div>
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="p-10 bg-white text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-blue-600">Analytics</h2>
          <p className="mt-4 text-gray-700 text-lg">Explore placement trends and insights.</p>

          {/* Vacancies Link */}
          {/*<Link to="/vacancy" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center">
            <i className="fas fa-briefcase mr-2"></i> Vacancies
          </Link>*/}

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
            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800 transition duration-300">
              <i className="fas fa-phone-alt text-4xl"></i>
              <p className="mt-2 text-sm text-gray-700">Call Us</p>
            </a>

            {/* Email Icon */}
            <a href="mailto:support@placementportal.com" className="text-blue-600 hover:text-blue-800 transition duration-300">
              <i className="fas fa-envelope text-4xl"></i>
              <p className="mt-2 text-sm text-gray-700">Email Us</p>
            </a>

            {/* LinkedIn Icon */}
            <a href="https://www.linkedin.com/company/placementportal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300">
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