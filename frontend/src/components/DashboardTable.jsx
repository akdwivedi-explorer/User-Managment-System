import { Button } from './common/UI';

export default function DashboardTable({ users, onStatusChange }) {
  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map((header) => (
                <th 
                  key={header} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName || user.name || "Unknown"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString() 
                      : <span className="text-gray-400 italic">Never</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.role !== 'admin' && (
                    <Button 
                      variant={user.status === 'active' ? 'danger' : 'secondary'} 
                      onClick={() => onStatusChange(user)}
                      className="text-xs px-3 py-1 h-8"
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  )}
                  {user.role === 'admin' && (
                    <span className="text-gray-400 text-xs italic">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}