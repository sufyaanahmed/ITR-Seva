const fs = require('fs');
const content = fs.readFileSync('node_modules/@vishalvoid/react-india-map/dist/index.mjs', 'utf8');
const match = content.match(/const INDIA_SVG_MAP = "(.*?)";/s);
if (match) {
  let svg = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  
  // Clean up the SVG tag to allow React className and props
  svg = svg.replace(/<\?xml.*?\?>/i, '');
  svg = svg.replace(/<svg[^>]*>/, '<svg className="w-full h-auto drop-shadow-xl" viewBox="0 0 611.85999 695.70178" preserveAspectRatio="xMidYMid meet">');
  
  // Also handle the mapsvg attributes and other useless tags
  svg = svg.replace(/xmlns:mapsvg=".*?"/, '');
  svg = svg.replace(/xmlns:dc=".*?"/, '');
  svg = svg.replace(/xmlns:cc=".*?"/, '');
  svg = svg.replace(/xmlns:rdf=".*?"/, '');
  svg = svg.replace(/xmlns:svg=".*?"/, '');
  svg = svg.replace(/mapsvg:geoViewBox=".*?"/, '');
  svg = svg.replace(/<metadata.*?>.*?<\/metadata>/s, '');
  svg = svg.replace(/<defs.*?>.*?<\/defs>/s, '');
  
  // Create a React component wrapper
  const componentCode = `import React from 'react';

export default function IndiaSvgMap({ onStateClick, hoveredState, setHoveredState }) {
  return (
    <div 
      className="w-full max-w-[600px] mx-auto india-map-container"
      onClick={(e) => {
        const target = e.target;
        if (target && target.tagName && target.tagName.toLowerCase() === 'path') {
          const id = target.getAttribute('id');
          if (id && onStateClick) onStateClick(id);
        }
      }}
      onMouseOver={(e) => {
        const target = e.target;
        if (target && target.tagName && target.tagName.toLowerCase() === 'path') {
          const id = target.getAttribute('id');
          if (id && setHoveredState) setHoveredState(id);
        }
      }}
      onMouseOut={() => {
        if (setHoveredState) setHoveredState(null);
      }}
    >
      ${svg}
    </div>
  );
}
`;
  
  fs.writeFileSync('src/components/IndiaSvgMap.jsx', componentCode);
  console.log('Successfully extracted and created src/components/IndiaSvgMap.jsx');
} else {
  console.log('Could not find SVG in index.mjs');
}
