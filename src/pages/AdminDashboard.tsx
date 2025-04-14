import { useAuth } from "../context/AuthContext";

export const AdminDashboard = () => {
  const { userData, logout } = useAuth();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {userData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Admin Information</h2>
          <p>Role: {userData.role}</p>
          <p>Province: {userData.province}</p>
          <p>District: {userData.district}</p>
        </div>
      )}
    </div>
  );
};
