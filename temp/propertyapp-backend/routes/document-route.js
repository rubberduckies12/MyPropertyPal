const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Property = require('../models/Property');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

// Protect all routes below this line
router.use(auth);

// Add a new document (always use userId for tenantId and landlordId)
router.post('/', async (req, res) => {
  try {
    let landlordId = req.body.landlordId;
    // If landlordId not provided, try to get it from property
    if (!landlordId && req.body.propertyId) {
      const property = await Property.findOne({ propertyId: req.body.propertyId });
      if (property) landlordId = property.landlordId;
    }
    const doc = new Document({
      ...req.body,
      documentId: uuidv4(),
      tenantId: req.body.tenantId,   // should be 6-digit userId string
      landlordId: landlordId         // should be 6-digit userId string
    });
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all documents (only for the authenticated tenant or landlord)
router.get('/', async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only show documents where the user is the tenant or landlord (by userId)
  const filter = {
    $or: [
      { tenantId: req.user.userId },
      { landlordId: req.user.userId }
    ]
  };

  // Optional: further filter by propertyId if provided
  if (req.query.propertyId) filter.propertyId = req.query.propertyId;

  try {
    const documents = await Document.find(filter);
    res.json(documents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a document by MongoDB _id (only if user is tenant or landlord)
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    // Only allow if user is tenant or landlord on the document
    if (doc.tenantId !== req.user.userId && doc.landlordId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: Not your document.' });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a document by MongoDB _id (only if user is tenant or landlord)
router.patch('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });

    // Only allow if user is tenant or landlord on the document
    if (doc.tenantId !== req.user.userId && doc.landlordId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: Not your document.' });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;