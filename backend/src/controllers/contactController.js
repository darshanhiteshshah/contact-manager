import Contact from '../models/Contact.js';

// @desc    Create new contact
// @route   POST /api/contacts
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create contact', 
      error: error.message 
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch contacts', 
      error: error.message 
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete contact', 
      error: error.message 
    });
  }
};
