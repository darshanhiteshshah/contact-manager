import { useState } from 'react';
import axios from 'axios';

function ContactForm({ onContactAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10,15}$/.test(phone.replace(/[-\s]/g, ''));
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Invalid email address';
        break;
      
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!validatePhone(value)) error = 'Invalid phone number';
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'message') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contacts`, formData);
      onContactAdded(response.data);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
      setSuccess('Contact added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to add contact' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      validateEmail(formData.email) &&
      formData.phone.trim() &&
      validatePhone(formData.phone) &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-700">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Add New Contact</h2>
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-6 bg-green-900 border border-green-700 text-green-200 px-4 py-3">
            {success}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 bg-black border text-white placeholder-gray-500 focus:outline-none ${
                  errors.name 
                    ? 'border-red-600 focus:border-red-500' 
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 bg-black border text-white placeholder-gray-500 focus:outline-none ${
                  errors.email 
                    ? 'border-red-600 focus:border-red-500' 
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 bg-black border text-white placeholder-gray-500 focus:outline-none ${
                  errors.phone 
                    ? 'border-red-600 focus:border-red-500' 
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                placeholder="1234567890"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Optional message"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`px-8 py-3 font-semibold ${
                isFormValid() && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
