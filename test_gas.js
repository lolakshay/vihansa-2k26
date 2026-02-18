const fetch = require('node-fetch'); // May not be available, try native fetch in Node 18+ or stick to https module if needed.
// Actually, let's use https for standard library
const https = require('https');
const querystring = require('querystring');

const postData = querystring.stringify({
    'Name': 'NodeTest',
    'Email': 'nodetest@example.com'
});

const options = {
    hostname: 'script.google.com',
    port: 443,
    path: '/macros/s/AKfycbyjxr1tuQ4wocpbb7tldDLGJ1KQrq1qS-usmYnojuzU-eB4jDIMbltGaAVpIv141w/exec',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Follow redirect if 302
    if (res.statusCode === 302) {
        console.log("Redirect Location:", res.headers.location);
        // Usually means login required if not public access
        if (res.headers.location.includes("accounts.google.com")) {
            console.log("ERROR: Redirected to Google Login. Script permissions likely wrong.");
        } else {
            console.log("Follow Redirect...");
            // We could follow it but for now just knowing it redirects is enough info.
            // GAS usually redirects a POST to a GET result page or another POST handler?
            // Actually GAS POST returns 200 or 302 depending on content service.
        }
    }

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(postData);
req.end();
