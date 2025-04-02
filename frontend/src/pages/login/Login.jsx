import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { useAuth } from '../../hooks/useAuth';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{6,12}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateUsername(username)) {
      setError("Invalid username! Must be 6-12 alphanumeric characters.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Invalid password! Must be 6-12 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }

    try {
       await login(username, password);
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("username",username);
      

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateUsername(username)) {
      setError("Invalid username! Must be 6-12 alphanumeric characters.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Invalid password! Must be 6-12 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }

    try {
      await register(username, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        setIsLogin(true);
      }, 1000);
      
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
   <Layout>
     <div className="min-h-screen flex items-center justify-center bg-gray-400 p-6">
      {isLogin ? (
        <div className="w-full max-w-sm p-6 bg-blue-400 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">🔑 Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              className="w-full px-3 py-3 my-2 rounded border bg-gray-100 text-gray-800 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-3 py-3 my-2 rounded border bg-gray-100 text-gray-800 outline-none"
            />
            <button 
              type="submit"
              className="w-full py-3 mt-2 bg-black text-white rounded shadow hover:bg-gray-800 transition-transform hover:scale-105"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-300 text-sm mt-2">{success}</p>}
          <p className="mt-4">
            New user?{" "}
            <button 
              onClick={() => setIsLogin(false)}
              className="text-white underline hover:text-gray-200"
            >
              Register here
            </button>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm p-6 bg-blue-400 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">📝 Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              className="w-full px-3 py-3 my-2 rounded border bg-gray-100 text-gray-800 outline-none"
            />
            <p className="text-xs text-gray-200 mb-2">Username: 6-12 alphanumeric characters only.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-3 my-2 rounded border bg-gray-100 text-gray-800 outline-none"
            />
            <p className="text-xs text-gray-200 mb-2">Password: 6-12 chars, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.</p>
            <button 
              type="submit"
              className="w-full py-3 mt-2 bg-black text-white rounded shadow hover:bg-gray-800 transition-transform hover:scale-105"
            >
              Register
            </button>
          </form>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-300 text-sm mt-2">{success}</p>}
          <p className="mt-4">
            Already registered?{" "}
            <button 
              onClick={() => setIsLogin(true)}
              className="text-white underline hover:text-gray-200"
            >
              Login here
            </button>
          </p>
        </div>
      )}
    </div>
   </Layout>
  );
};

export default Login;