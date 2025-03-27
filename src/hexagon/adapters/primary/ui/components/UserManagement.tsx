import React, { useState, useEffect } from 'react';
import { usePermission } from '../../providers/PermissionProvider';
import { User, Permission } from '../../../../core/domain/User';

export const UserManagement: React.FC = () => {
  const { hasPermission, getAllUsers, updateUserPermissions, createUser } = usePermission();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canManageUsers, setCanManageUsers] = useState(false);
  
  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  
  // Available services for permissions
  const availableServices = [
    { id: 'service:b2b', name: 'B2B Service' },
    { id: 'service:b2c', name: 'B2C Service' },
    { id: 'service:international', name: 'International Service' }
  ];

  // Check if the current user can manage users
  useEffect(() => {
    const checkPermission = async () => {
      const canManage = await hasPermission('update', 'user');
      setCanManageUsers(canManage);
    };
    
    checkPermission();
  }, [hasPermission]);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setError(null);
      } catch (err) {
        setError('Failed to load users. You may not have permission to view users.');
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (canManageUsers) {
      loadUsers();
    }
  }, [getAllUsers, canManageUsers]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSuccess(null);
    setError(null);
  };

  const handleTogglePermission = (serviceId: string) => {
    if (!selectedUser) return;
    
    // Clone the user and permissions
    const updatedUser = { ...selectedUser };
    const currentPermissions = [...(updatedUser.roles[0]?.permissions || [])];
    
    // Check if the permission already exists
    const existingPermIndex = currentPermissions.findIndex(
      p => p.resource === serviceId && p.action === 'update'
    );
    
    if (existingPermIndex >= 0) {
      // Remove the permission
      currentPermissions.splice(existingPermIndex, 1);
    } else {
      // Add the permission
      const newPermission: Permission = {
        id: Math.random().toString(36).substring(2, 11),
        name: `Manage ${serviceId.split(':')[1].toUpperCase()}`,
        resource: serviceId,
        action: 'update'
      };
      currentPermissions.push(newPermission);
    }
    
    // Update the user's permissions
    if (updatedUser.roles.length > 0) {
      updatedUser.roles[0].permissions = currentPermissions;
      setSelectedUser(updatedUser);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser || !selectedUser.roles[0]) return;
    
    try {
      setLoading(true);
      await updateUserPermissions(selectedUser.id, selectedUser.roles[0].permissions);
      
      // Refresh the users list
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      
      setSuccess(`Permissions updated successfully for ${selectedUser.username}`);
      setError(null);
    } catch (err) {
      setError('Failed to update permissions');
      console.error('Failed to update permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      setError('Username is required');
      return;
    }
    
    try {
      setLoading(true);
      await createUser({
        username: newUsername,
        email: newEmail || `${newUsername}@example.com`
      });
      
      // Refresh the users list
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      
      // Reset form
      setNewUsername('');
      setNewEmail('');
      setShowNewUserForm(false);
      
      setSuccess('User created successfully');
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create user');
      }
      console.error('Failed to create user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!canManageUsers) {
    return <div className="p-4 text-gray-500 italic">You don't have permission to manage users.</div>;
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button 
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            showNewUserForm 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          onClick={() => setShowNewUserForm(!showNewUserForm)}
        >
          {showNewUserForm ? 'Cancel' : 'New User'}
        </button>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="text-red-700">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="text-green-700">{success}</div>
          </div>
        )}
        
        {showNewUserForm && (
          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Users</h3>
            <div className="border border-gray-200 rounded-md overflow-hidden max-h-96 overflow-y-auto">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUser?.id === user.id ? 'bg-primary-50 border-l-2 border-primary-600' : ''
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{user.username}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {user.roles[0]?.name || 'No Role'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedUser && (
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Permissions for {selectedUser.username}
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-700 pb-2 mb-4 border-b border-gray-200">
                  Service Management Permissions
                </h4>
                
                <div className="space-y-3 mb-6">
                  {availableServices.map(service => {
                    const hasPermission = selectedUser.roles[0]?.permissions.some(
                      p => p.resource === service.id && p.action === 'update'
                    );
                    
                    return (
                      <div key={service.id} className="flex items-center">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={() => handleTogglePermission(service.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700">Manage {service.name}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleSavePermissions}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 