const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);
module.exports = Inquiry;