import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CSE from "./pages/cse/CSE";
import Home from "./pages/home/Home";
import EEE from "./pages/eee/EEE.JSX";
import ME from "./pages/ME/ME";
import ECE from "./pages/ECE/ECE";
import CHEM from "./pages/chem/CHEM";
import MME from "./pages/mme/MME";
import CIVIL from "./pages/civil/CIVIL";
import Login from "./pages/login/Login";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import PlacementStatus from "./pages/placement-status/PlacementStatus";
import ResumeUpload from "./components/ResumeUpload";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/cse" element={
            <ProtectedRoute>
              <CSE />
            </ProtectedRoute>
          } />

          <Route path="/eee" element={
            <ProtectedRoute>
              <EEE />
            </ProtectedRoute>
          } />

          <Route path="/me" element={
            <ProtectedRoute>
              <ME />
            </ProtectedRoute>
          } />

          <Route path="/ece" element={
            <ProtectedRoute>
              <ECE />
            </ProtectedRoute>
          } />

          <Route path="/chem" element={
            <ProtectedRoute>
              <CHEM />
            </ProtectedRoute>
          } />

          <Route path="/mme" element={
            <ProtectedRoute>
              <MME />
            </ProtectedRoute>
          } />

          <Route path="/civil" element={
            <ProtectedRoute>
              <CIVIL />
            </ProtectedRoute>
          } />

          <Route path="/placement-status" element={
            <ProtectedRoute>
              <PlacementStatus />
            </ProtectedRoute>
          } />

          <Route path="/resume" element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}