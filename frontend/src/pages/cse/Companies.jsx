import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Companies({branch}) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({ companyName: "", noOfVacancies: "", roles: "", applyLink: "" });
  const [editCompany, setEditCompany] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [errors, setErrors] = useState({});
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/companies/${branch}`);
      setCompanies(response.data);
    } catch (error) {
      toast.error("Error fetching companies");
      console.error("Error fetching companies:", error);
    }
  };

  const confirmDelete = (company) => {
    setDeleteConfirmation(company);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
      setDeleteConfirmation(null);
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Error deleting company");
      console.error("Error deleting company:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Company name validation
    if (!newCompany.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!newCompany.noOfVacancies) {
      newErrors.noOfVacancies = "No of Vacancies is required";
    }
    if (!newCompany.applyLink.trim()) {
      newErrors.applyLink = "Apply Link is required";
    }
    
    // Roles validation
    if (!newCompany.roles.trim()) {
      newErrors.roles = "At least one role is required";
    }
    
    // Apply link URL validation
    if (newCompany.applyLink.trim()) {
      try {
        new URL(newCompany.applyLink);
      } catch (error) {
        newErrors.applyLink = "Please enter a valid URL";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await axios.post(
        `http://localhost:8080/api/companies/${branch}`,
        {
          companyName: newCompany.companyName,
          noOfVacancies: newCompany.noOfVacancies,
          roles: newCompany.roles.split(","),
          applyLink: newCompany.applyLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanies();
      setNewCompany({ companyName: "", noOfVacancies: "", roles: "", applyLink: "" });
      setErrors({});
      toast.success("Company added successfully");
    } catch (error) {
      toast.error("Error adding company");
      console.error("Error adding company:", error);
    }
  };

  const handleEdit = async () => {
    console.log("Editing company:", editCompany); // Debugging line
    if (!editCompany || !editCompany._id) {
      toast.error("Invalid company data");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/companies/${editCompany._id}`,
        {
          companyName: editCompany.companyName,
          noOfVacancies: editCompany.noOfVacancies,
          roles: Array.isArray(editCompany.roles) ? editCompany.roles : editCompany.roles.split(","),
          applyLink: editCompany.applyLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanies();
      setEditCompany(null);
      toast.success("Company updated successfully");
    } catch (error) {
      toast.error("Error updating company");
      console.error("Error updating company:", error);
    }
  };
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg w-4/5 mx-auto mt-10 p-6">
        <h2 className="text-2xl font-bold mb-6">Available Companies</h2>
        {userRole === "admin" && (
          <div className="mb-4 flex flex-col gap-y-5 items-center">
            <div className="flex justify-center flex-col sm:flex-row">
              <div className="mb-2 sm:mb-0 sm:mr-2">
                <input 
                  type="text" 
                  placeholder="Company Name" 
                  value={newCompany.companyName} 
                  onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })} 
                  className={`border p-2 ${errors.companyName ? 'border-red-500' : ''}`} 
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Vacancies" 
                  value={newCompany.noOfVacancies} 
                  onChange={(e) => setNewCompany({ ...newCompany, noOfVacancies: e.target.value })} 
                  className="border p-2" 
                />
              </div>
            </div>
            <div className="flex justify-center flex-col sm:flex-row">
              <div className="mb-2 sm:mb-0 sm:mr-2">
                <input 
                  type="text" 
                  placeholder="Roles (comma separated)" 
                  value={newCompany.roles} 
                  onChange={(e) => setNewCompany({ ...newCompany, roles: e.target.value })} 
                  className={`border p-2 ${errors.roles ? 'border-red-500' : ''}`} 
                />
                {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Apply Link" 
                  value={newCompany.applyLink} 
                  onChange={(e) => setNewCompany({ ...newCompany, applyLink: e.target.value })} 
                  className={`border p-2 ${errors.applyLink ? 'border-red-500' : ''}`} 
                />
                {errors.applyLink && <p className="text-red-500 text-sm mt-1">{errors.applyLink}</p>}
              </div>
            </div>
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg">Add Company</button>
          </div>
        )}
        <div>
          {companies.map((company) => (
            <div key={company._id} className="flex justify-between items-center bg-gray-200 p-4 my-2 rounded-lg shadow-md">
              <div>
                <h3 className="text-lg font-semibold">{company.companyName}</h3>
                <p>Vacancies: {company.noOfVacancies}</p>
              </div>
              <div>
                <button className="bg-gradient-to-b from-blue-500 to-blue-800  text-white px-4 py-2 rounded-lg mr-2" onClick={() => setSelectedCompany(company)}>View Details</button>
                {userRole === "admin" && (
                  <>
                    <button className="bg-gradient-to-b from-amber-400 to-amber-700 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer" onClick={() => setEditCompany(company)}>Edit</button>
                    <button className="bg-gradient-to-b from-red-400 to-red-700 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => confirmDelete(company)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {editCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-900/20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-2">Edit Company</h2>
            <input type="text" value={editCompany.companyName} onChange={(e) => setEditCompany({ ...editCompany, companyName: e.target.value })} className="border p-2 mb-2 w-full" />
            <input type="number" value={editCompany.noOfVacancies} onChange={(e) => setEditCompany({ ...editCompany, noOfVacancies: e.target.value })} className="border p-2 mb-2 w-full" />
            <input type="text" value={Array.isArray(editCompany.roles) ? editCompany.roles.join(",") : editCompany.roles} onChange={(e) => setEditCompany({ ...editCompany, roles: e.target.value.split(",") })} className="border p-2 mb-2 w-full" />
            <input type="text" value={editCompany.applyLink} onChange={(e) => setEditCompany({ ...editCompany, applyLink: e.target.value })} className="border p-2 mb-2 w-full" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2" onClick={handleEdit}>Save</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={() => setEditCompany(null)}>Cancel</button>
          </div>
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-2">{selectedCompany.companyName}</h2>
            <p>Vacancies: {selectedCompany.noOfVacancies}</p>
            <p>Roles: {selectedCompany.roles.join(", ")}</p>
            <a href={selectedCompany.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block my-2">Apply Here</a>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={() => setSelectedCompany(null)}>Close</button>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.companyName}</span>?</p>
            <div className="flex justify-center space-x-4">
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-lg" 
                onClick={() => handleDelete(deleteConfirmation._id)}
              >
                Yes, Delete
              </button>
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg" 
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}