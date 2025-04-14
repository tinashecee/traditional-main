import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../lib/apiService";

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    province: "",
    district: "",
    role: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(
        formData.username,
        formData.email,
        formData.phone_number,
        formData.province,
        formData.district,
        formData.role,
        formData.password
      );
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block mb-2 capitalize">
              {key.replace("_", " ")}
            </label>
            <input
              type={key === "password" ? "password" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
          disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
