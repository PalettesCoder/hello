const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const projectsDir = path.join(rootDir, '../');

function getRootHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isFile() && fullPath.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getRootHtmlFiles(projectsDir);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix missing Skip to Main Content
    if (!content.includes('class="nav-skip"')) {
        // Find main ID
        const match = content.match(/<main([^>]*)id="([^"]+)"/);
        let mainId = "main-content";
        if (match) {
            mainId = match[2];
        } else if (content.includes('<main>')) {
            // Give main an ID
            content = content.replace('<main>', '<main id="main-content">');
            changed = true;
        } else if (content.includes('id="wrapper"')) {
            mainId = "wrapper";
        }

        // Insert skip link after <body>
        const bodyRegex = /(<body[^>]*>)/i;
        if (bodyRegex.test(content)) {
            content = content.replace(bodyRegex, `$1\n    <!-- WCAG 2.4.1 Bypass Blocks -->\n    <a href="#${mainId}" class="nav-skip">Skip to main content</a>\n`);
            changed = true;
            console.log(`Added skip link to ${file}`);
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
    }
});
