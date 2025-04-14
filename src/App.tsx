import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RouteGuard } from "./components/RouteGuard";
import {
  Login,
  Signup,
  ForgotPassword,
  ResetPassword,
  AdminDashboard,
} from "./pages";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <RouteGuard>
                <Home />
              </RouteGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <RouteGuard roles={["admin"]}>
                <AdminDashboard />
              </RouteGuard>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
