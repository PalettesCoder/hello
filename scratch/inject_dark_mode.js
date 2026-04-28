const fs = require('fs');
const files = [
    '../projects/WSP-project/index.html',
    '../projects/Bajaj-project/index.html',
    '../projects/Nexi-project/index.html'
];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('/* DARK MODE VARIABLE OVERRIDES */')) {
        const darkModeCSS = `
        /* DARK MODE VARIABLE OVERRIDES */
        body.dark-mode {
            --color-bg: #0A0A0A;
            --color-text-main: #FFFFFF;
            --color-text-sub: rgba(255, 255, 255, 0.75);
            --color-surface-dark: #151515;
            --color-text-on-dark: #FFFFFF;
            --surface: #151515;
            --bg-base: #0A0A0A;
            --black-92: rgba(255, 255, 255, 0.92);
            --black-72: rgba(255, 255, 255, 0.85);
            --black-56: rgba(255, 255, 255, 0.75);
            --black-40: rgba(255, 255, 255, 0.65);
            --black: #ffffff;
            color: #ffffff;
            background-color: #0A0A0A;
        }
        body.dark-mode .case-study-header {
            background-color: #151515;
            color: #ffffff;
        }
        body.dark-mode h1, 
        body.dark-mode h2, 
        body.dark-mode h3, 
        body.dark-mode h4,
        body.dark-mode p,
        body.dark-mode li {
            color: var(--color-text-main, #ffffff);
        }
        body.dark-mode .narrative-copy {
            color: var(--color-text-sub, rgba(255, 255, 255, 0.75));
        }
        `;
        content = content.replace('</style>', darkModeCSS + '\n    </style>');
        fs.writeFileSync(file, content);
        console.log('Added dark mode overrides to ' + file);
    } else {
        console.log('Already added to ' + file);
    }
});
