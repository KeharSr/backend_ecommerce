const paymentModel = require('../models/paymentModel');
const {
  initiatePayment,
  verifyPayment,
} = require('../service/khaltiService');
exports.addPayment = async (req, res) => {
  console.log(req.body);
  const { product, paymentMethod, paymentAmount } = req.body;
  const user = req.user.id;
  if (!product || !user || !paymentMethod || !paymentAmount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields',
    });
  }
  try {
    const newPayment = await paymentModel({
      product,
      user,
      paymentMethod,
      paymentAmount: parseInt(paymentAmount),
    });
    await newPayment.save();

    const payment = await paymentModel
      .findById(newPayment._id)
      .populate('product')
      .populate('user');
    res.status(201).json({
      status: 'success',
      payment,
      paymentMethod,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// View khalti payment
exports.viewKhaltiPayment = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide token',
    });
  }
  try {
    const khaltiPayment = await verifyPayment(token);
    res.status(200).json({
      status: 'success',
      data: khaltiPayment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
