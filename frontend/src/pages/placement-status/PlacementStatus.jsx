import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Search, Download, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Layout from '../../Layout';

const PlacementStatus = () => {
  // Existing states
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // New states for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const studentsPerPage = 12;
  const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CHE', 'CE', 'MME'];
  
  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setIsAdmin(userRole === 'admin');
  }, []);
  
  // Fetch students data
  const fetchStudents = async () => {
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
      setFilteredStudents(studentsData);
      setActiveTab('all');
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch students data. Please try again.');
      console.error('Error fetching students:', err);
      // Initialize with empty arrays on error
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Open confirmation modal before updating student status
  const openConfirmationModal = (student, status) => {
    setSelectedStudent(student);
    setNewStatus(status);
    setShowConfirmModal(true);
  };
  
  // Close confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmModal(false);
    setSelectedStudent(null);
    setNewStatus('');
  };
  
  // Update student status after confirmation
  const updateStudentStatus = async () => {
    if (!selectedStudent || !newStatus) return;
    
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:8080/api/students/edit/${selectedStudent.id}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      const updatedStudents = students.map(student => 
        student.id === selectedStudent.id ? { ...student, status: newStatus } : student
      );
      
      setStudents(updatedStudents);
      
      // Update filtered students as well to reflect changes immediately
      handleTabChange(activeTab, updatedStudents);
      
      // Close modal
      closeConfirmationModal();
      
    } catch (err) {
      setError('Failed to update student status. Please try again.');
      console.error('Error updating student:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Filter handling
  const handleTabChange = (tab, data = students) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    if (!Array.isArray(data)) {
      setFilteredStudents([]);
      return;
    }
    
    if (tab === 'all') {
      setFilteredStudents(data);
    } else if (tab === 'placed') {
      setFilteredStudents(data.filter(student => student.status === 'placed'));
    } else if (tab === 'unplaced') {
      setFilteredStudents(data.filter(student => student.status === 'unplaced'));
    }
    // For pie chart tab, we keep the current filtered view
  };
  
  // Search handling
  useEffect(() => {
    if (!Array.isArray(students)) {
      setFilteredStudents([]);
      return;
    }
    
    if (searchTerm.trim() === '') {
      handleTabChange(activeTab);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = students.filter(student => 
      student.id.toLowerCase().includes(term) || 
      student.name.toLowerCase().includes(term)
    );
    
    if (activeTab === 'all') {
      setFilteredStudents(filtered);
    } else if (activeTab === 'placed') {
      setFilteredStudents(filtered.filter(student => student.status === 'placed'));
    } else if (activeTab === 'unplaced') {
      setFilteredStudents(filtered.filter(student => student.status === 'unplaced'));
    }
  }, [searchTerm, students, activeTab]);
  
  // Download CSV
  const downloadCSV = () => {
    if (!Array.isArray(filteredStudents) || filteredStudents.length === 0) {
      setError('No data to download');
      return;
    }
    
    const headers = ['ID', 'Name', 'Branch', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => 
        [
          student.id,
          `"${student.name}"`, // Wrap name in quotes to handle commas in names
          branch,
          student.status
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${branch}_students_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Ensure filteredStudents is always an array before pagination
  const safeFilteredStudents = Array.isArray(filteredStudents) ? filteredStudents : [];
  
  // Pagination logic
  const totalPages = Math.ceil(safeFilteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = safeFilteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  
  // Count stats - ensure students is an array
  const safeStudents = Array.isArray(students) ? students : [];
  const placedCount = safeStudents.filter(student => student.status === 'placed').length;
  const unplacedCount = safeStudents.filter(student => student.status === 'unplaced').length;
  const allCount = safeStudents.length;
  
  // Pie chart data
  const chartData = [
    { name: 'Placed', value: placedCount, color: '#4ade80' },
    { name: 'Unplaced', value: unplacedCount, color: '#f87171' }
  ];

  return (
   <Layout>
     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Placement Dashboard</h1>
      
      {/* Branch Selection and Fetch */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <select 
            value={branch} 
            onChange={(e) => setBranch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={fetchStudents}
          disabled={loading || !branch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Fetch Students'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      
      {safeStudents.length > 0 && (
        <>
          {/* Tabs and Search */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleTabChange('all')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  All ({allCount})
                </button>
                <button 
                  onClick={() => handleTabChange('placed')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'placed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Placed ({placedCount})
                </button>
                <button 
                  onClick={() => handleTabChange('unplaced')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'unplaced' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                >
                  Unplaced ({unplacedCount})
                </button>
                <button 
                  onClick={() => setActiveTab('chart')}
                  className={`px-3 py-1 rounded-md ${activeTab === 'chart' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  Pie Chart
                </button>
              </div>
              
              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search by ID or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button 
                  onClick={downloadCSV}
                  disabled={safeFilteredStudents.length === 0}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-1 disabled:bg-gray-400"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Download CSV</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Pie Chart View */}
          {activeTab === 'chart' ? (
            <div className="h-80 mb-6 bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Placement Status Distribution</h2>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Table View */
            <>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                      {isAdmin && <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student) => (
                      <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{student.id}</td>
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            student.status === 'placed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openConfirmationModal(
                                student, 
                                student.status === 'placed' ? 'unplaced' : 'placed'
                              )}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                              <Edit className="h-4 w-4" />
                              <span>
                                {student.status === 'placed' ? 'Mark Unplaced' : 'Mark Placed'}
                              </span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    
                    {currentStudents.length === 0 && (
                      <tr>
                        <td 
                          colSpan={isAdmin ? 4 : 3} 
                          className="py-8 text-center text-gray-500"
                        >
                          No students found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {safeFilteredStudents.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, safeFilteredStudents.length)} of {safeFilteredStudents.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex gap-1">
                      {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Logic to show 5 page numbers centered around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="flex items-center px-1">...</span>
                          <button
                            onClick={() => paginate(totalPages)}
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && selectedStudent && (
        <div className="fixed inset-0 bg-neutral-950/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Status Change
              </h3>
              <button 
                onClick={closeConfirmationModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to mark the following student as <span className={`font-semibold ${newStatus === 'placed' ? 'text-green-600' : 'text-red-600'}`}>{newStatus}</span>?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-gray-500">ID:</span>
                  <span className="col-span-2 font-medium">{selectedStudent.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-gray-500">Name:</span>
                  <span className="col-span-2 font-medium">{selectedStudent.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-gray-500">Branch:</span>
                  <span className="col-span-2 font-medium">{branch}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="col-span-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      selectedStudent.status === 'placed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmationModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateStudentStatus}
                disabled={updatingStatus}
                className={`px-4 py-2 text-white rounded-md ${
                  newStatus === 'placed' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {updatingStatus ? 'Updating...' : `Confirm ${newStatus === 'placed' ? 'Placement' : 'Status Change'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
   </Layout>
  );
};

export default PlacementStatus;