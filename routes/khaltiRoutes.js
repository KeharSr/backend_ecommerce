const express = require('express');
const { verifyKhaltiPayment, initializeKhaltiPayment } = require('../service/khaltiService'); // Make sure this path is correct
const router = express.Router();

// Route to verify Khalti payment
router.post('/verify', async (req, res) => {
  const { pidx } = req.body;
  try {
    const response = await verifyKhaltiPayment(pidx);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Khalti payment',
      error: error.message,
    });
  }
});

// Route to initialize Khalti payment
router.post('/initialize', async (req, res) => {
  const details = req.body;
  try {
    const response = await initializeKhaltiPayment(details);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initializing Khalti payment',
      error: error.message,
    });
  }
});

module.exports = router;
