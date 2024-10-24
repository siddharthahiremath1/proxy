
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/proxy/*', async (req, res) => {
  try {
    // Extract the URL to be proxied from the request path
    const encodedUrl = req.path.slice(1); // Remove the leading '/'
    const decodedUrl = decodeURIComponent(encodedUrl);

    // Validate the URL
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
      return res.status(400).send('Invalid URL. Please provide a valid http or https URL.');
    }

    console.log('Proxying request to:', decodedUrl);

    // Make a request to the decoded URL
    const response = await axios.get(decodedUrl, {
      responseType: 'arraybuffer' // To handle all types of responses (text, binary, etc.)
    });

    // Set the appropriate headers
    Object.keys(response.headers).forEach(header => {
      res.setHeader(header, response.headers[header]);
    });

    // Send the response
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error processing the URL: ' + error.message);
  }
});

app.get('/b', function(req, res) {23
  res.sendFile(path.join(__dirname, '/proxy.html'));
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

// Note: This code won't run in the Node.js sandbox environment.
// You'll need to set up a local Node.js environment and install the required dependencies to run this server.
