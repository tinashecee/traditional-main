import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/apiService";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(username, password);
      const {
        token,
        province,
        role,
        district,
        username: responseUsername,
      } = response;
      authLogin(token, {
        username: responseUsername,
        province,
        role,
        district,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="text-center mb-6">
        <img
          src="/images/logo.png"
          alt="Traditional Leaders Support Services Logo"
          className="w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Traditional Leaders Support Services
        </h1>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
          disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-700 font-medium">
            Register here
          </a>
        </p>
        <p className="text-gray-600">
          Forgot password?{" "}
          <a
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-700 font-medium">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};
