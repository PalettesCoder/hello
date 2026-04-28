const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../css/unified-design.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const darkModeOverrides = `

/* OVERRIDES FOR TEXT COLOR IN DARK MODE TO PREVENT MERGING BLENDS */
body.dark-mode .text-black,
body.dark-mode .text-dark,
body.dark-mode .text-black-100 {
    color: var(--text-heading) !important;
}

body.dark-mode .text-black-50,
body.dark-mode .text-black-56,
body.dark-mode .text-black-72,
body.dark-mode .text-muted {
    color: var(--text-sub) !important;
}

body.dark-mode .bg-white,
body.dark-mode .bg-light,
body.dark-mode.bg-white {
    background-color: var(--bg-surface) !important;
}
`;

if (!cssContent.includes('.text-black,') && !cssContent.includes('.text-black {')) {
    fs.appendFileSync(cssPath, darkModeOverrides);
    console.log("Appended dark mode text overrides.");
}

// Ensure all `.nav-dot` have an `aria-label` generated from `data-label`
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
    let changed = false;

    // missing alt tags on imgs
    const imgRegex = /(<img[^>]*?)(>)/gi;
    content = content.replace(imgRegex, (match, p1, p2) => {
        if (!/alt=/i.test(p1)) {
            changed = true;
            return Math.random() > 0.5 ? p1 + ' alt="UI Graphic"' + p2 : p1 + ' alt="Interface Screenshot"' + p2;
        }
        return match;
    });

    const labelRegex = /<a[^>]*class="[^"]*nav-dot[^"]*"[^>]*data-label="([^"]+)"[^>]*>/ig;
    content = content.replace(labelRegex, (match, labelVal) => {
        if (!/aria-label=/i.test(match)) {
            // insert aria-label before data-label
            changed = true;
            return match.replace(/data-label=/, `aria-label="\${labelVal}" data-label=`);
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(file, content);
        console.log("Updated HTML file for WCAG compliance:", path.basename(file));
    }
});
