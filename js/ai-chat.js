/**
 * Harsha Royal AI Assistant - Neural Hive Engine v4.2
 * Features: Persistent Identity, New Chat on Close, Massive Intent Recognition.
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatTrigger = document.querySelector('.ai-chat-floating');
    const chatContainer = document.getElementById('aiChatContainer');
    const closeBtn = document.getElementById('closeAiChat');
    const chatForm = document.getElementById('aiChatForm');
    const chatInput = document.getElementById('aiChatMessageInput');
    const chatMessages = document.getElementById('aiChatMessages');

    if (!chatTrigger || !chatContainer || !closeBtn || !chatForm) return;

    // --- STATE MANAGEMENT ---
    let userName = localStorage.getItem('aiUserName') || null;
    let chatHistory = JSON.parse(localStorage.getItem('aiChatHistory')) || [];

    // --- MASSIVE NEURAL HIVE KNOWLEDGE BASE ---
    const KNOWLEDGE_BASE = [
        { keywords: /\b(hi|hello|hey|greetings|morning|evening|sup|whatsapp|welcome|intro)\b/gi, answer: "Hello! I'm Harsha's Neural Assistant. I've been synchronized with his professional journey. How can I help you today?" },
        { keywords: /\b(who|about|harsha|royal|identity|name|palettescoder|bio|personality|person)\b/gi, answer: "Harsha Royal (<strong>PalettesCoder</strong>) is a high-performance UI Developer and Product Designer based in Hyderabad. He specializes in bridging the gap between complex logic and premium aesthetics." },
        { keywords: /\b(current|job|acuvate|today|working|position|role|engineer|employment)\b/gi, answer: "Harsha is currently a <strong>Software Engineer - UI at Acuvate Software</strong>. He focuses on architecting scalable enterprise dashboards and modular design systems." },
        { keywords: /\b(previous|history|past|c2s|technologies|background|career path|started)\b/gi, answer: "Before Acuvate, Harsha was a <strong>UX Designer at C2S Technologies</strong>. This design-first background is why his code is exceptionally user-centric and visually polished." },
        { keywords: /\b(experience|years|tenure|professional|journey|duration|how long)\b/gi, answer: "Harsha brings <strong>3+ years of professional experience</strong> across the entire product lifecycle—from initial wireframes to production-ready Angular components." },
        { keywords: /\b(javascript|js|es6|coding|programming|frontend|logic|scripts)\b/gi, answer: "Harsha is an expert in <strong>Modern JavaScript (ES6+)</strong>. He builds complex logic, asynchronous handlers, and performance-optimized modules." },
        { keywords: /\b(angular|framework|typescript|spa|state|components|rx|observables)\b/gi, answer: "He is highly proficient in <strong>Angular & TypeScript</strong>, specializing in enterprise-grade state management and reusable component libraries." },
        { keywords: /\b(css|sass|scss|styling|layout|flexbox|grid|responsive|animation|motion)\b/gi, answer: "A master of <strong>CSS3 and Sass</strong>. Harsha specializes in 'The Physics of UI'—advanced animations, fluid layouts, and responsive precision." },
        { keywords: /\b(design system|tokens|atomic|scalable|library|consistency|ui kits|components)\b/gi, answer: "Creating <strong>Global Design Systems</strong> is his superpower. He builds tokenized libraries that ensure visual consistency for products with 100+ screens." },
        { keywords: /\b(skills|stack|abilities|expert|proficient|tools|expertise|can you do)\b/gi, answer: "Harsha's stack is a fusion of <strong>Engineering</strong> (JS, Angular, SCSS) and <strong>Design</strong> (Figma, Design Systems). He is a true 'Dual-Threat' developer." },
        { keywords: /\b(wsp|project management|pm|dashboard|enterprise saas|complex|construction)\b/gi, answer: "The <strong>WSP PM</strong> project involved architecting an enterprise dashboard that 'Orchestrated Complexity' for a global engineering firm." },
        { keywords: /\b(bajaj|finance|pay|fintech|payment|wallet|transaction|emi)\b/gi, answer: "For <strong>Bajaj Pay</strong>, Harsha designed a 'Frictionless Flow' for their payment ecosystem, serving millions of users with a focus on speed and high-volume user clarity." },
        { keywords: /\b(nexi|service|pay|app|tracking|deposits|financial)\b/gi, answer: "<strong>Nexi</strong> is a financial service app where Harsha restructured the architectural flow to create a seamless sign-up and tracking experience." },
        { keywords: /\b(intel|luminary|ai|community|collaboration|platform)\b/gi, answer: "<strong>Intel Luminary</strong> was a community-focused project where Harsha built a platform for AI collaboration and knowledge sharing." },
        { keywords: /\b(drame|dramebaaz|music|entertainment|theater|streaming)\b/gi, answer: "<strong>Dramebaaz</strong> is an entertainment platform where Harsha focused on a vibrant, content-first visual direction and search experience." },
        { keywords: /\b(behance|designs|screens|ui|ux|frames|mockups|case study|visuals|figma|graphics)\b/gi, answer: "Harsha's high-fidelity <strong>Design Frames</strong> and full case studies are hosted on Behance. You can explore his pixel-perfect work here: <div class='chat-action-buttons'><a href='https://www.behance.net/palettescoder' target='_blank' class='chat-btn behance'>View Design Portfolio</a></div>" },
        { keywords: /\b(projects|work|portfolio|showcase|built|done|examples|created|list)\b/gi, answer: "Harsha has led several high-impact projects across FinTech, SaaS, and AI. Explore them directly: <div class='chat-action-buttons'><a href='projects/Bajaj-project' class='chat-btn bajaj'>Bajaj Pay</a><a href='projects/WSP-project' class='chat-btn wsp'>WSP Global</a><a href='projects/Nexi-project' class='chat-btn nexi'>Nexi Pay</a><a href='projects/Intel-project' class='chat-btn intel'>Intel AI</a><a href='projects/Drame' class='chat-btn drame'>Dramebaaz</a><a href='projects/index.html' class='chat-btn all'>View All</a></div>" },
        { keywords: /\b(education|study|degree|college|university|ssc|inter|graduation|learned)\b/gi, answer: "Harsha completed his <strong>Graduation in Computer Science</strong>. His education provided the foundation for his analytical approach to UI Engineering." },
        { keywords: /\b(location|where|city|hyderabad|india|live|base|office)\b/gi, answer: "Harsha is based in <strong>Hyderabad, India</strong>, working with global teams to deliver high-end digital products." },
        { keywords: /\b(hobbies|interests|music|free time|relax|passion)\b/gi, answer: "Beyond code, Harsha is passionate about <strong>Music</strong>, deep-diving into new design trends, and exploring the intersection of AI and Creativity." },
        { keywords: /\b(resume|cv|curriculum vitae|bio-data|profile|download)\b/gi, answer: "You can view Harsha's professional roadmap in his resume: <div class='chat-action-buttons'><a href='https://harsharoyal.in/resume' target='_blank' class='chat-btn figma'>View Figma Resume</a></div>" },
        { keywords: /\b(nice|cool|great|awesome|thanks|thank you|wow|ok|okay|good|perfect|excellent|wonderful)\b/gi, answer: "I'm glad you think so! Harsha always strives for excellence in every pixel. What would you like to dive into next?" },
        { keywords: /\b(roast|royale|game|play|fun|level|training|sniper|gun|fps|arena|shoot|stars)\b/gi, answer: "<strong>Roast Royale</strong> is my integrated FPS mini-game! You can earn high scores and unlock 10 levels (Training Grounds to Roast God). <br><br>💡 <strong>Note:</strong> To save your progress and level up, please <strong>Sign in with Google</strong> in the game lobby. <div class='chat-action-buttons'><button onclick='triggerAlarm(\"Manual Training\")' class='chat-btn call'>Start Training Session</button></div>" },
        { keywords: /\b(contact|email|reach|talk|hire|linkedin|github|social|behance|message|details|info|address|phone|connect|mobile|number|call|whatsapp|instagram|insta)\b/gi, answer: "You can reach Harsha at <strong>+917337481238</strong> or through his neural links: <div class='chat-action-buttons'><a href='tel:+917337481238' class='chat-btn call'>Call Now</a><a href='https://www.linkedin.com/in/palettescoder/' target='_blank' class='chat-btn linkedin'>LinkedIn</a><a href='https://www.instagram.com/iharsharoyal/' target='_blank' class='chat-btn instagram'>Instagram</a><a href='https://www.behance.net/palettescoder' target='_blank' class='chat-btn behance'>Behance</a><a href='mailto:palettescoder@gmail.com' class='chat-btn email'>Email</a></div>" }
    ];

    // --- UTILITIES ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const scrollToBottom = () => {
        const performScroll = () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        performScroll();
        setTimeout(performScroll, 50);
        setTimeout(performScroll, 250);
    };

    const addMessage = (text, sender, save = true) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `neural-msg ${sender}`;
        const botIcon = sender === 'bot' ? '<div class="sound-wave small"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>' : '';
        msgDiv.innerHTML = `${botIcon}<div class="msg-bubble">${text}</div>`;
        chatMessages.appendChild(msgDiv);
        
        scrollToBottom();

        if (save) {
            chatHistory.push({ text, sender });
            localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
        }
    };

    const showTyping = () => {
        const tid = document.createElement('div');
        tid.id = 'neuralTyping';
        tid.className = 'neural-msg bot';
        tid.innerHTML = '<div class="sound-wave small"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div><div class="msg-bubble typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
        chatMessages.appendChild(tid);
        scrollToBottom();
    };

    const getResponse = (input) => {
        const query = input.toLowerCase().trim();
        let bestMatch = null;
        let maxScore = 0;

        KNOWLEDGE_BASE.forEach(item => {
            let score = 0;
            const matches = query.match(item.keywords);
            if (matches) {
                score = matches.length * 10;
                if (query.length < 15) score += 5;
            }
            if (score > maxScore) {
                maxScore = score;
                bestMatch = item.answer;
            }
        });

        if (bestMatch && maxScore > 0) return bestMatch;
        return `I'm not exactly sure about that, ${userName || 'friend'}, but I can tell you about Harsha's <strong>3+ years of experience</strong>, his <strong>Enterprise Projects</strong>, or how to <strong>Contact him</strong> directly!`;
    };

    const notifyAdmin = (name) => {
        const notifyForm = document.getElementById('aiNotifyForm');
        const nameField = document.getElementById('notifyVisitorName');
        const timeField = document.getElementById('notifyVisitTime');
        if (notifyForm && nameField && timeField) {
            nameField.value = name;
            timeField.value = new Date().toLocaleString();
            const formData = new FormData(notifyForm);
            fetch(notifyForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch(err => console.log('Notification silent fail', err));
        }
    };

    // --- INITIALIZATION ---
    const initChat = () => {
        chatMessages.innerHTML = ''; 
        if (chatHistory.length > 0) {
            chatHistory.forEach(msg => addMessage(msg.text, msg.sender, false));
            scrollToBottom();
        } else {
            if (!userName) {
                setTimeout(() => {
                    addMessage("Welcome to the Neural Portal. I am Harsha's AI Assistant. To begin, may I know your name?", "bot");
                }, 800);
            } else {
                setTimeout(() => {
                    addMessage(`${getGreeting()}, <strong>${userName}</strong>! How can I assist you with Harsha's profile today?`, "bot");
                }, 800);
            }
        }
        scrollToBottom();
    };

    initChat();

    // --- INTERACTION ---
    chatTrigger.addEventListener('click', () => { 
        chatContainer.classList.add('active'); 
        chatInput.focus();
        scrollToBottom();
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        chatHistory = [];
        localStorage.removeItem('aiChatHistory');
        setTimeout(initChat, 300); 
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = chatInput.value.trim();
        if (!val) return;

        addMessage(val, 'user');
        chatInput.value = '';
        showTyping();

        setTimeout(() => {
            const tid = document.getElementById('neuralTyping');
            if (tid) tid.remove();

            if (!userName) {
                userName = val;
                localStorage.setItem('aiUserName', userName);
                addMessage(`Nice to meet you, <strong>${userName}</strong>! ${getGreeting()}. I've unlocked Harsha's full knowledge base. What would you like to know?`, "bot");
                notifyAdmin(userName);
            } else {
                addMessage(getResponse(val), "bot");
            }
        }, 800);
    });
});
