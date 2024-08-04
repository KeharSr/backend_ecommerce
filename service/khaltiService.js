const axios = require('axios');

const verifyKhaltiPayment = async (pidx) => {
    const headersList = {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({ pidx });

    const reqOptions = {
        url: `${process.env.KHALTI_URL}payment/verify/`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
    };

    try {
        const response = await axios.request(reqOptions);
        return response.data;
    } catch (error) {
        console.error("Error verifying Khalti payment:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const initializeKhaltiPayment = async (details) => {
    const headersList = {
        Authorization: `Key ${process.env.KHALTI_PUBLIC_KEY}`,
    };

    const bodyContent = JSON.stringify(details);

    const reqOptions = {
        url: `${process.env.KHALTI_URL}payment/initiate/`,
        method: "POST",
        headers: headersList,
        data: bodyContent,
    };

    try {
        const response = await axios.request(reqOptions);
        return response.data;
    } catch (error) {
        console.error("Error initializing Khalti payment:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };
KHALTI_URL="https://khalti.com/api/v2/"