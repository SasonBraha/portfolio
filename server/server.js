'use strict';
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const Inquiry = require('./models/Inquiry');
const mongoose = require('mongoose');
const { mongoUri, phoneNumber } = require('./keys');
const validateInquiry = require('./validateInquiry');
const nexmo = require('./nexmoConfig');
const express = require('express');
const app = express();
const limiter = rateLimit({ windowMs: 120 * 60 * 1000, max: 6 }); 

// DB Connection
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUri, { useNewUrlParser: true, useFindAndModify: false }).catch(ex => { throw Error(ex) });

app.use(cors());
app.enable('trust proxy');
app.use(limiter); // Max 6 Requests In 2 Hours
app.use(bodyParser.json());

// Routes
app.post('/', async (req, res, next) => {
  try {
    // Validate Form
    const { hasErr, ...errors } = await validateInquiry(req.body);
    if (hasErr) return res.status(400).json({ success: false, errors });
    
    // Create Inquiry
    const { fullName, email, message } = req.body;
    await Inquiry.create({ fullName, email, message });
    res.json({ success: true });

    // Send Text Message
    nexmo.message.sendSms('Portfolio', phoneNumber, `${fullName} contacted you on your website with this email: ${email}`);
  } catch(ex) {
    res.status(500).json({ success: false, errors: {} });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started Successfully On Port ${PORT}`));