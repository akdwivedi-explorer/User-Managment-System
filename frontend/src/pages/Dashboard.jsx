import { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import DashboardTable from "../components/DashboardTable"; 
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
    const userId = user._id || user.id;
    if (!userId) return toast.error("User ID missing");

    const newStatus = user.status === "active" ? "inactive" : "active";
    const action = user.status === "active" ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this user?`))
      return;

    try {
      await adminAPI.updateUserStatus(userId, newStatus);

      setUsers((currentUsers) =>
        currentUsers.map((u) => {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="text-purple-600 font-semibold animate-pulse">Loading users...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={loadUsers}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Refresh List
            </button>
          </div>
        </div>


        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
           <DashboardTable users={users} onStatusChange={toggleStatus} />
        </div>

        <div className="mt-5 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 bg-white shadow rounded-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
               onClick={() => setPage((p) => Math.max(1, p - 1))}
               disabled={page === 1}
               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}