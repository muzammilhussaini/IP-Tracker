const express = require('express');
const requestIp = require('request-ip');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Email transporter setup (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'muzammilhussain5857@gmail.com',        // your Gmail
        pass: 'kbre yvra vuai nrpw'      // the app password
    }
});

// Handle visits
app.get('/', (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    console.log(`New visitor: ${clientIp}`);

    // Send yourself an email
    const mailOptions = {
        from: 'muzammilhussain5857@gmail.com',
        to: 'muzammilhussain5857@gmail.com',          // Send to yourself
        subject: '🎉 New Visitor on Your Website',
        text: `Someone visited your site!\nIP Address: ${clientIp}\nTime: ${new Date()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Error sending email:', error);
        } else {
            console.log('✅ Email sent: ' + info.response);
        }
    });

    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
