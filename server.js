const express = require('express');
const fs = require('fs');
const axios = require('axios'); // For GeoIP API
const requestIp = require('request-ip');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(requestIp.mw());

// When someone visits
app.get('/', async (req, res) => {
    const ip = req.clientIp || req.ip;

    // Get GeoIP data
    let geoInfo = {};
    try {
        const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
        geoInfo = geoRes.data;
    } catch (err) {
        console.error('GeoIP lookup failed:', err.message);
    }

    const logEntry = `[${new Date().toISOString()}] IP: ${ip} | Country: ${geoInfo.country_name} | City: ${geoInfo.city} | Device: ${req.headers['user-agent']}\n`;

    console.log(logEntry); // Also print to console
    fs.appendFile('log.txt', logEntry, err => {
        if (err) console.error('Failed to write to log file:', err);
    });

    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
