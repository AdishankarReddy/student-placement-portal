import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({ companyName: "", noOfVacancies: "", roles: "", applyLink: "" });
  const [editCompany, setEditCompany] = useState(null);
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/companies");
      setCompanies(response.data);
    } catch (error) {
      toast.error("Error fetching companies");
      console.error("Error fetching companies:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Error deleting company");
      console.error("Error deleting company:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/companies",
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
          <div className="mb-4">
            <input type="text" placeholder="Company Name" value={newCompany.companyName} onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })} className="border p-2 mr-2" />
            <input type="number" placeholder="Vacancies" value={newCompany.noOfVacancies} onChange={(e) => setNewCompany({ ...newCompany, noOfVacancies: e.target.value })} className="border p-2 mr-2" />
            <input type="text" placeholder="Roles (comma separated)" value={newCompany.roles} onChange={(e) => setNewCompany({ ...newCompany, roles: e.target.value })} className="border p-2 mr-2" />
            <input type="text" placeholder="Apply Link" value={newCompany.applyLink} onChange={(e) => setNewCompany({ ...newCompany, applyLink: e.target.value })} className="border p-2 mr-2" />
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
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg mr-2" onClick={() => setSelectedCompany(company)}>View Details</button>
                {userRole === "admin" && (
                  <>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer" onClick={() => setEditCompany(company)}>Edit</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => handleDelete(company._id)}>Delete</button>
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
            <input type="text" value={editCompany.roles.join(",")} onChange={(e) => setEditCompany({ ...editCompany, roles: e.target.value.split(",") })} className="border p-2 mb-2 w-full" />
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
    </div>
  );
}
