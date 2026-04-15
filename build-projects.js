const fs = require('fs');
const path = require('path');

const srcFile = 'project-detail.html';
const content = fs.readFileSync(srcFile, 'utf8');

const projects = [
    {
        id: 'WSP-project',
        title: 'WSP PM | Engineering Clarity at Enterprise Scale —  UX Case Study',
        h1: 'Engineering clarity.<br><span style="color:var(--primary); opacity:0.9;">at Enterprise Scale.</span>'
    },
    {
        id: 'Intel-project',
        title: 'Intel Chat Bots | AI Conversational UX —  UX Case Study',
        h1: 'Conversational AI.<br><span style="color:var(--primary); opacity:0.9;">for Modern Enterprises.</span>'
    },
    {
        id: 'Bajaj-project',
        title: 'Bajaj Pay | FinTech Ecosystem —  UX Case Study',
        h1: 'Seamless FinTech.<br><span style="color:var(--primary); opacity:0.9;">at Massive Scale.</span>'
    }
];

projects.forEach(project => {
    const dir = path.join('projects', project.id);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let updated = content;

    // Adjust relative links since we went one level deeper (projects/ID/index.html) -> two levels actually `../../`
    updated = updated.replace(/href="css\//g, 'href="../../css/');
    updated = updated.replace(/src="images\//g, 'src="../../images/');
    updated = updated.replace(/data-src="images\//g, 'data-src="../../images/');
    updated = updated.replace(/href="images\//g, 'href="../../images/');
    updated = updated.replace(/src="media\//g, 'src="../../media/');
    updated = updated.replace(/src="js\//g, 'src="../../js/');
    updated = updated.replace(/href="index\.html/g, 'href="/"');
    updated = updated.replace(/href="resume\.html/g, 'href="../../resume.html');
    updated = updated.replace(/href="freelance\.html/g, 'href="../../freelance.html');

    // Update Title
    updated = updated.replace(/<title>.*?<\/title>/s, `<title>${project.title}</title>`);
    
    // Update H1
    updated = updated.replace(/<h1(.*?)>.*?<\/h1>/s, `<h1$1>${project.h1}</h1>`);

    fs.writeFileSync(path.join(dir, 'index.html'), updated);
    console.log(`Generated ${path.join(dir, 'index.html')}`);
});
