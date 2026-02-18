const fs = require('fs');
const path = 'c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\main.js';
const lines = fs.readFileSync(path, 'utf8').split('\n');
lines.splice(637, 2078 - 638 + 1, "// eventDetails object removed and moved to js/event-details.json for performance", "let cachedEventDetails = null;");
fs.writeFileSync(path, lines.join('\n'));
console.log('Successfully removed lines 638-2078');
