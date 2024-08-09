// const axios = require('axios');

// const verifyKhaltiPayment = async (pidx) => {
//     const headersList = {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//     };

//     const bodyContent = JSON.stringify({ pidx });

//     const reqOptions = {
//         url: `${process.env.KHALTI_URL}payment/verify/`,
//         method: "POST",
//         headers: headersList,
//         data: bodyContent,
//     };

//     try {
//         const response = await axios.request(reqOptions);
//         return response.data;
//     } catch (error) {
//         console.error("Error verifying Khalti payment:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// const initializeKhaltiPayment = async (details) => {
//     const headersList = {
//         Authorization: `Key ${process.env.KHALTI_PUBLIC_KEY}`,
//     };

//     const bodyContent = JSON.stringify(details);

//     const reqOptions = {
//         url: `${process.env.KHALTI_URL}payment/initiate/`,
//         method: "POST",
//         headers: headersList,
//         data: bodyContent,
//     };

//     try {
//         const response = await axios.request(reqOptions);
//         return response.data;
//     } catch (error) {
//         console.error("Error initializing Khalti payment:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };
// KHALTI_URL="https://khalti.com/api/v2/"


const axios = require('axios');

const initiatePayment = async (payment) => {
  const data = {
    return_url: 'http://localhost:3000/success',
    website_url: 'http://localhost:3000',
    amount: '1000',
    purchase_order_id: payment._id,
    purchase_order_name: 'Pet Adoption',
    customer_info: {
      name: payment.user.firstName,
      email: payment.user.email,
      phone: payment.user.phone,
    },
  };

  const options = {
    headers: {
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/initiate/',
      data,
      options
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
};

const verifyPayment = async (token) => {
  const data = {
    pidx: token,
  };

  // /epayment/lookup/	POST	Required	application/json
  const options = {
    headers: {
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    console.log('Verifying payment with token:', token);
    console.log('Verifying payment with data:', options);
    const response = await axios.post(
      'https://a.khalti.com/api/v2/epayment/lookup/',
      data,
      options
    );
    console.log('Verification response data:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
};
