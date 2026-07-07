import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./login";
import ExamApp from "./ExamApp";
import SMEPortal from "./SMEPortal";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<LoginScreen />}
          
        />

        <Route
          path="/exam"
          element={
            <ProtectedRoute allowedRole="USER">
              <ExamApp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sme"
          element={
            <ProtectedRoute allowedRole="SME">
              <SMEPortal />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;