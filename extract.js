const fs = require('fs');
const path = require('path');

const mainJsPath = 'c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\main.js';
const content = fs.readFileSync(mainJsPath, 'utf8');

const key = 'const eventDetails = ';
const startIndex = content.indexOf(key);
if (startIndex === -1) {
    console.error('Could not find eventDetails');
    process.exit(1);
}

// Find the end of the object
let braceCount = 0;
let endIndex = -1;
let started = false;

for (let i = startIndex + key.length; i < content.length; i++) {
    if (content[i] === '{') {
        braceCount++;
        started = true;
    } else if (content[i] === '}') {
        braceCount--;
    }

    if (started && braceCount === 0) {
        endIndex = i + 1;
        break;
    }
}

if (endIndex === -1) {
    console.error('Could not find end of object');
    process.exit(1);
}

const objStr = content.substring(startIndex + key.length, endIndex);
try {
    const eventDetails = eval('(' + objStr + ')');
    fs.writeFileSync('c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\event-details.json', JSON.stringify(eventDetails, null, 2));
    console.log('Successfully extracted eventDetails to js/event-details.json');
} catch (e) {
    console.error('Error evaluating object:', e);
    process.exit(1);
}
