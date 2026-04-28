const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    '../projects/WSP-project/index.html',
    '../projects/Bajaj-project/index.html',
    '../projects/Nexi-project/index.html',
    '../css/unified-design.css'
];

filesToUpdate.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Light mode text colors
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.40\)/g, 'rgba(0, 0, 0, 0.65)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.56\)/g, 'rgba(0, 0, 0, 0.75)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.72\)/g, 'rgba(0, 0, 0, 0.85)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.6\)/g, 'rgba(0, 0, 0, 0.75)');
    content = content.replace(/rgba\(0,\s*0,\s*0,\s*0\.65\)/g, 'rgba(0, 0, 0, 0.75)');

    // Dark mode text colors
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.40\)/g, 'rgba(255, 255, 255, 0.65)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.50\)/g, 'rgba(255, 255, 255, 0.70)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.56\)/g, 'rgba(255, 255, 255, 0.75)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.72\)/g, 'rgba(255, 255, 255, 0.85)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.65\)/g, 'rgba(255, 255, 255, 0.80)');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated contrast in ${relativePath}`);
    } else {
        console.log(`No changes needed in ${relativePath}`);
    }
});
