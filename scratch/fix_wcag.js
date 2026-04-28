const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '../projects');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(projectsDir);

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
        }

        // Insert skip link after <body>
        const bodyRegex = /(<body[^>]*>)/i;
        if (bodyRegex.test(content)) {
            content = content.replace(bodyRegex, `$1\n    <!-- WCAG 2.4.1 Bypass Blocks -->\n    <a href="#${mainId}" class="nav-skip">Skip to main content</a>\n`);
            changed = true;
            console.log(`Added skip link to ${file}`);
        }
    }

    // Fix misplaced unified-design.css
    const cssRegex = /^[ \t]*<link[^>]*href="[^"]*unified-design\.css"[^>]*>\r?\n?/gm;
    let cssMatch;
    let count = 0;
    while ((cssMatch = cssRegex.exec(content)) !== null) {
        count++;
    }
    
    if (count > 0) {
        const cssLineMatch = content.match(/<link[^>]*href="([^"]*unified-design\.css)"[^>]*>/);
        if (cssLineMatch) {
            const cssLine = cssLineMatch[0];
            // Remove all occurrences
            content = content.replace(cssRegex, '');
            // Insert in head just before </head>
            content = content.replace('</head>', `    ${cssLine}\n</head>`);
            changed = true;
            console.log(`Moved unified-design.css to head in ${file}`);
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
    }
});

const cssFile = path.join(__dirname, '../css/unified-design.css');
if (fs.existsSync(cssFile)) {
    let cssContent = fs.readFileSync(cssFile, 'utf8');
    if (!cssContent.includes('.nav-skip')) {
        const skipCss = `\n/* Navigation Skip Link (WCAG) */\n.nav-skip { position: absolute; top: -100px; left: 0; background: var(--color-accent, #FF7518); color: white; padding: 16px 24px; z-index: 10000; transition: top 0.2s; font-weight: 800; }\n.nav-skip:focus { top: 0; outline: none; }\n`;
        fs.writeFileSync(cssFile, cssContent + skipCss);
        console.log('Added .nav-skip to unified-design.css');
    }
}
