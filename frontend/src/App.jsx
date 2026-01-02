import { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';




function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/contacts`);
      setContacts(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (newContact) => {
    setContacts([newContact, ...contacts]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (error) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Centered Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Contact Management
          </h1>
          <p className="text-gray-400">Organize and manage your contacts</p>
        </header>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-6 py-3">
            {error}
          </div>
        )}

        {/* Contacts List - Top */}
        <div className="mb-8">
          <ContactList 
            contacts={contacts} 
            onDelete={handleDelete} 
            loading={loading}
          />
        </div>

        {/* Contact Form - Bottom */}
        <div>
          <ContactForm onContactAdded={handleContactAdded} />
        </div>
      </div>
    </div>
  );
}

export default App;
