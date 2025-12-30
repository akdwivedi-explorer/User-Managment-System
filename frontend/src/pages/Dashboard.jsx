import { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import { Button } from "../components/common/UI";
import DashboardTable from "../components/DashboardTable"; // <--- Import here
import toast from "react-hot-toast";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers(page);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    // 1. Get the correct ID (handle _id or id)
    const userId = user._id || user.id;
    if (!userId) return toast.error("User ID missing");

    const newStatus = user.status === "active" ? "inactive" : "active";
    const action = user.status === "active" ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this user?`))
      return;

    try {
      // 2. Call API for THIS specific user
      await adminAPI.updateUserStatus(userId, newStatus);

      // 3. Update UI: Only change the user with the matching ID
      setUsers((currentUsers) =>
        currentUsers.map((u) => {
          // Strict check: if IDs match, update status. Otherwise, keep existing.
          if ((u._id || u.id) === userId) {
            return { ...u, status: newStatus };
          }
          return u;
        })
      );

      toast.success(`User ${newStatus}`);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading && users.length === 0)
    return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button variant="secondary" onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      {/* Use the new Component */}
      <DashboardTable users={users} onStatusChange={toggleStatus} />

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
