(function() {
    // Only track once per session to avoid spamming your inbox
    const sessionKey = 'visitor_logged_' + new Date().toDateString();
    if (localStorage.getItem(sessionKey)) return;

    // Use a free Geolocation API
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const visitorData = {
                from_name: "Portfolio Insider 🕵️‍♂️",
                user_email: "iharsharoyal@gmail.com",
                message: `🚀 NEW VISITOR TRACKED!

📍 Location: ${data.city}, ${data.region}, ${data.country_name}
🌐 IP Address: ${data.ip}
🏢 Provider: ${data.org}
🕒 Time: ${new Date().toLocaleString()}
🔗 Page: ${window.location.href}
📱 User Agent: ${navigator.userAgent}`,
                to_name: "Harsha Royal"
            };

            // Send via your existing EmailJS setup
            // Note: Replace template ID if you have a specific one for logs, 
            // otherwise using the standard one you have.
            emailjs.send("service_kfsqpcg", "template_yog32e8", visitorData)
                .then(() => {
                    localStorage.setItem(sessionKey, 'true');
                    console.log("Visitor journey validated. 📍");
                })
                .catch(err => console.error("Tracking ping failed:", err));
        })
        .catch(err => console.error("Geo-ping failed:", err));
})();
