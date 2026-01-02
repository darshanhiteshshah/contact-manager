import { useState } from 'react';

function ContactList({ contacts, onDelete, loading }) {
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleDeleteClick = (id) => {
    if (window.confirm('Delete this contact?')) {
      setDeleteId(id);
      onDelete(id);
      setTimeout(() => setDeleteId(null), 500);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key]?.toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toLowerCase() || '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 12l5 5 5-5H5zm10-4l-5-5-5 5h10z" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 15l5-5 5 5H5z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M15 10l-5 5-5-5h10z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">All Contacts</h2>
        </div>
        <div className="p-12 text-center text-gray-400">
          Loading contacts...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">All Contacts</h2>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold">
          {contacts.length} Total
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className="p-16 text-center">
          <p className="text-gray-400 text-lg">No contacts available</p>
          <p className="text-gray-600 text-sm mt-2">Add your first contact below</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden md:table w-full">
            <thead className="bg-gray-800">
              <tr className="border-b border-gray-700">
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Email</span>
                    <SortIcon columnKey="email" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Message
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedContacts.map((contact) => (
                <tr 
                  key={contact._id} 
                  className={`hover:bg-gray-800 ${
                    deleteId === contact._id ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{contact.email}</td>
                  <td className="px-6 py-4 text-gray-300">{contact.phone}</td>
                  <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                    {contact.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteClick(contact._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-800">
            {sortedContacts.map((contact) => (
              <div 
                key={contact._id} 
                className={`p-5 hover:bg-gray-800 ${
                  deleteId === contact._id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-semibold text-lg">{contact.name}</span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="text-gray-300">
                    <span className="text-gray-500">Email: </span>
                    {contact.email}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-500">Phone: </span>
                    {contact.phone}
                  </div>
                  {contact.message && (
                    <div className="text-gray-400">
                      <span className="text-gray-500">Message: </span>
                      {contact.message}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClick(contact._id)}
                  className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                >
                  Delete Contact
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactList;
