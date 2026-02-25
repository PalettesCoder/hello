const fs = require('fs');

// 1. Fix the Time Local problem in index.html (move it outside <main id="wrapper">)
let indexHtml = fs.readFileSync('index.html', 'utf8');

// The markup looks roughly like:
// <main id="wrapper">
//
//     <!-- Time Local -->
//     ...
//     <!-- /Time Local -->

if (indexHtml.includes('<main id="wrapper">') && indexHtml.includes('<!-- Time Local -->') && indexHtml.indexOf('<main id="wrapper">') < indexHtml.indexOf('<!-- Time Local -->')) {
    
    // We want to move Time Local Block before main wrapper
    let startMain = indexHtml.indexOf('<main id="wrapper">');
    let startTime = indexHtml.indexOf('<!-- Time Local -->');
    let endTime = indexHtml.indexOf('<!-- /Time Local -->') + '<!-- /Time Local -->'.length;
    
    let timeBlock = indexHtml.substring(startTime, endTime);
    
    // Remove the timeblock from current place
    let firstPart = indexHtml.substring(0, startTime);
    let secondPart = indexHtml.substring(endTime);
    
    // Remove main wrapper from first part
    firstPart = firstPart.replace('<main id="wrapper">', '');
    
    // Now concatenate
    indexHtml = firstPart + timeBlock + '\n    <main id="wrapper">' + secondPart;
    fs.writeFileSync('index.html', indexHtml);
    console.log("Moved Time Local outside of main wrapper in index.html");
}

// 2. Rebuild project-detail.html based on index.html with moved Time Local
let headEnd = indexHtml.indexOf('</head>') + 7;
let head = indexHtml.substring(0, headEnd);

let preloadsAndSidebars = indexHtml.substring(indexHtml.indexOf('<!-- Preload -->'), indexHtml.indexOf('<!-- Time Local -->'));
let timeLocal = indexHtml.substring(indexHtml.indexOf('<!-- Time Local -->'), indexHtml.indexOf('<!-- /Time Local -->') + '<!-- /Time Local -->'.length);

let projectSidebarStr = `
        <main id="wrapper">
        <!-- Project Sidebar -->
        <div class="sidebar-user project-sidebar">
            <div class="wrap no-padding" style="padding: 0; background: transparent;">
                <div class="wg-work d-flex flex-column" style="height: calc(100vh - 48px); max-height: 860px; padding: 6px; background-color: var(--white); border-radius: 24px; box-shadow: var(--shadow-2); width: 100%;">
                    <div class="work-content" style="position: relative; height: 100%; border-radius: 24px; overflow: hidden;">
                        <div class="w-image" style="position: absolute; inset: 0; z-index: 0; border-radius: 18px;">
                            <img loading="lazy" width="468" height="856" src="images/work-1.jpg" alt="Image" style="width: 100%; height: 100%; object-fit: cover;">
                            <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"></div>
                        </div>
                        <div class="content" style="position: relative; z-index: 1; padding: 32px; display: flex; flex-direction: column; height: 100%; overflow-y: auto; -ms-overflow-style: none; scrollbar-width: none;">
                            <div class="content-top" style="flex-shrink: 0;">
                                <div class="w-logo" style="margin-bottom: 64px;">
                                    <img loading="lazy" width="40" height="40" src="images/logo.svg" alt="Image">
                                </div>
                                <h4 class="w-title letter-space--2 text-white-72" style="margin-bottom: 16px;">
                                    WSP Global
                                </h4>
                                <p class="w-desc text-white-56 text-body-3" style="margin-bottom: 64px;">
                                    Designed responsive UI for Project Management tools supporting different type of internal projects
                                </p>
                                <div class="w-highlight" style="display: grid; gap: 40px; margin-bottom: 64px;">
                                    <div class="box-high" style="display: grid; gap: 8px;">
                                        <p class="text-body-3 text-white-56">Year</p>
                                        <p class="text-body-1 text-white-72">2025</p>
                                    </div>
                                    <div class="box-high" style="display: grid; gap: 8px;">
                                        <p class="text-body-3 text-white-56">Role</p>
                                        <p class="text-body-1 text-white-72">Lead Product Designer</p>
                                    </div>
                                </div>
                                <div class="w-tag-list" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                                    <div class="tag" style="padding: 5px 11px; background-color: var(--black-56); border: 1px solid var(--white-8); backdrop-filter: blur(6px); border-radius: 999px;">
                                        <span class="text-body-3 fw-medium text-white-72">Brand</span>
                                    </div>
                                    <div class="tag" style="padding: 5px 11px; background-color: var(--black-56); border: 1px solid var(--white-8); backdrop-filter: blur(6px); border-radius: 999px;">
                                        <span class="text-body-3 fw-medium text-white-72">Website</span>
                                    </div>
                                    <div class="tag" style="padding: 5px 11px; background-color: var(--black-56); border: 1px solid var(--white-8); backdrop-filter: blur(6px); border-radius: 999px;">
                                        <span class="text-body-3 fw-medium text-white-72">Webflow</span>
                                    </div>
                                </div>
                            </div>
                            <div class="content-bottom" style="flex-shrink: 0; margin-top: auto;">
                                <div class="group-action" style="display: flex; align-items: center; justify-content: space-between;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /Project Sidebar -->
`;

let rightSideContent = `
        <div class="main-content">
            <div class="container">
                <div class="row">
                    <div class="col-lg-7 col-xl-8 ms-auto">
                        <div class="wrap-container">
                            <div class="flat-spacing pb-5">
                            
                                <div style="display: flex; justify-content: flex-start; margin-bottom: 30px; margin-top: 20px;">
                                    <a href="index.html#work" class="tf-btn-action style-white flex-shrink-0" style="padding: 12px 24px; border-radius: 999px; box-shadow: var(--shadow-2); background: var(--white); border: 1px solid var(--white-8); z-index: 10;">
                                        <span class="ic-wrap"><i class="icon icon-arrow-left"></i></span>
                                        <span class="text text-body-1 letter-space--05 fw-medium text-black">Back to Projects</span>
                                    </a>
                                </div>
                                
                                <h1 class="mb-4 mt-2 text-black text-64 font-2">Project Overview</h1>
                                <p class="text-body-1 text-black-56 mb-5">This projects involved designing and building scalable components for enterprise project management. It addresses common pain points by optimizing navigation and contextual information density, making complex data manageable.</p>
                                
                                <img src="images/work-2.jpg" class="img-fluid rounded mb-5 shadow" style="width:100%; object-fit: cover; border-radius: 20px;" />
                                <img src="images/work-3.jpg" class="img-fluid rounded mb-5 shadow" style="width:100%; object-fit: cover; border-radius: 20px;" />
                            
                                <div class="text-center mt-5 mb-5 pb-5 pt-5">
                                  <h2>Enjoyed this case study?</h2>
                                  <br/>
                                  <a href="index.html#contact" class="tf-btn-action style-primary d-inline-flex"><span class="text text-body-3 fw-medium">Let's Work Together</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

let scriptsStart = indexHtml.lastIndexOf('<!-- Javascript -->');
let scriptsEnd = indexHtml.indexOf('</body>');
let scripts = indexHtml.substring(scriptsStart, scriptsEnd);

let newHtml = head + '\n<body class="counter-scroll">\n' + preloadsAndSidebars + '\n' + timeLocal + '\n' + projectSidebarStr + rightSideContent + '</main>\n' + scripts + '\n</body></html>';

fs.writeFileSync('project-detail.html', newHtml);
console.log("Fixed Time Local and rebuilt project-detail.html");
