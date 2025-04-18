import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file); // Field name must be 'resume'

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict-career/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data.reason)
      setStatus(
        <div>
          <div>✅ Career Prediction: {response.data.predicted_career_path}</div>
          <div>Confidence: {response.data.confidence}</div>
          <div>Reason:</div>
          <ul>
            {response.data.reason.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
      
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Error uploading file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border-t-4 border-blue-500"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Upload Your Resume
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Resume (PDF Only)
          </label>
          <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-inner">
            <FaFileUpload className="text-blue-500 text-xl" />
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf"
              required
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:scale-105"
        >
          Predict Career
        </button>

        {status && (
          <div className="mt-4 text-center text-sm font-medium text-gray-800">
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeUpload;
