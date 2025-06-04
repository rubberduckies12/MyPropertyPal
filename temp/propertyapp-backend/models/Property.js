const mongoose = require('mongoose');


const PropertySchema = new mongoose.Schema({
  propertyId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'vacant' }, 
  rent: { type: Number, required: true },
  leaseEnd: { type: Date },
  tenantId: { type: String, default: null },    
  landlordId: { type: String, required: true }  
});



module.exports = mongoose.model('Property', PropertySchema);