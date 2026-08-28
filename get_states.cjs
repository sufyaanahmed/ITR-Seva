const fs = require('fs');
const content = fs.readFileSync('src/components/IndiaSvgMap.jsx', 'utf8');
const regex = /<path\s+id="([^"]+)"\s+title="([^"]+)"/g;
let match;
const map = {};
while ((match = regex.exec(content)) !== null) {
  map[match[1]] = match[2];
}
console.log(JSON.stringify(map, null, 2));
