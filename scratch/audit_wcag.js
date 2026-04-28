const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '../projects');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(fullPath));
        } else if (fullPath.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(projectsDir);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let issues = [];

    // 1. Missing alt tag on img
    const imgRegex = /<img[^>]*>/ig;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        if (!/alt=/i.test(match[0])) {
            issues.push(`Missing alt on img: ${match[0]}`);
        } else if (/alt=""/i.test(match[0]) && !/role="presentation"/i.test(match[0]) && !/aria-hidden="true"/i.test(match[0])) {
             issues.push(`Empty alt without presentation role on img: ${match[0]}`);
        }
    }

    // 2. Empty links or a tags with no aria-label and no text, often used for icons
    const aRegex = /<a[^>]*>(.*?)<\/a>/ig;
    while ((match = aRegex.exec(content)) !== null) {
        let inside = match[1];
        let tag = match[0];
        // strip whitespace and tags
        let plainText = inside.replace(/<[^>]*>/g, '').trim();
        if (plainText.length === 0 && !/aria-label/i.test(tag)) {
            issues.push(`Link without text or aria-label: ${tag.substring(0, 100)}...`);
        }
    }

    // 3. Elements like buttons without text / aria-label
    const btnRegex = /<button[^>]*>(.*?)<\/button>/ig;
    while ((match = btnRegex.exec(content)) !== null) {
        let inside = match[1];
        let tag = match[0];
        let plainText = inside.replace(/<[^>]*>/g, '').trim();
        if (plainText.length === 0 && !/aria-label/i.test(tag)) {
            issues.push(`Button without text or aria-label: ${tag.substring(0, 100)}...`);
        }
    }

    // 4. Missing lang on html
    if (!/<html[^>]*lang=/i.test(content)) {
        issues.push(`Missing lang attribute on <html>`);
    }

    // 5. Inputs without labels (or aria-label)
    const inputRegex = /<input[^>]*>/ig;
    while ((match = inputRegex.exec(content)) !== null) {
        let tag = match[0];
        if (!/type="(hidden|submit|button)"/.test(tag) && !/(aria-label|id=)/i.test(tag)) {
            issues.push(`Input without aria-label or id (for label for): ${tag}`);
        }
    }

    if (issues.length > 0) {
        console.log(`\n--- ${path.basename(file)} ---`);
        issues.forEach(i => console.log(i));
    }
});
