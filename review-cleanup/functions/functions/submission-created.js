// Load environment variables (if needed)
require('dotenv').config();

const fetch = require('node-fetch'); // For making API requests, if needed
const { EMAIL_TOKEN } = process.env; // Token for external service (if needed)
const querystring = require('querystring'); // To parse URL-encoded data

const handler = async (event) => {
  try {
    // Parse the form submission data from URL-encoded format
    const formData = querystring.parse(event.body);

    const { name, email, message } = formData;

    console.log(`Received submission: Name: ${name}, Email: ${email}, Message: ${message}`);

    // Optionally, send the data to an external service (e.g., Buttondown, email service, etc.)
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${EMAIL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log(`Submitted to Buttondown:\n ${JSON.stringify(data)}`);

    // Return a success response to the client
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Form submission received successfully" }),
    };

  } catch (error) {
    console.error('Error processing submission', error);

    // Return an error response to the client
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing form submission" }),
    };
  }
};

// Export the handler function for Netlify to use
module.exports = { handler };