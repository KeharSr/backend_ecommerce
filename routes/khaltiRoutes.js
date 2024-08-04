const express = require('express');
const router = express.Router();
const { verifyKhaltiPayment, initializeKhaltiPayment } = require('../service/khaltiService');

// Initialize Khalti payment
router.post('/initiate', async (req, res) => {
    try {
        const details = req.body;
        const response = await initializeKhaltiPayment(details);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify Khalti payment
router.post('/verify', async (req, res) => {
    try {
        const { pidx } = req.body;
        const response = await verifyKhaltiPayment(pidx);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
