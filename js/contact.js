function sendMail(event) {
    event.preventDefault(); // stop default submission

    const btn = event.target.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.text-body-3');
    const originalText = btnText.innerText;

    // Show loading state
    btnText.innerText = "Sending...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const templateParams = {
        from_name: name,
        user_email: email, 
        message: message,
        to_name: "Harsha Royal",
        reply_to: email
    };

    console.log("Attempting to send with params:", templateParams);

    // Swapping based on user clarification:
    // template_yog32e8 is "Contact Us" (Notification to Harsha)
    // template_d4tsn4n is "Auto-Reply" (Thank you to User)
    const sendToOwner = emailjs.send('service_kfsqpcg', 'template_yog32e8', templateParams);
    const sendToUser = emailjs.send('service_kfsqpcg', 'template_d4tsn4n', templateParams);

    Promise.all([sendToOwner, sendToUser])
        .then(function(responses) {
            showSuccessPopup();
            document.getElementById("contactform").reset();
        })
        .catch(function(error) {
            console.error('EmailJS ERROR:', error);
            figmaNotify("Error: " + (error.text || "Something went wrong. Check the console (F12) for details."));
        })
        .finally(() => {
            btnText.innerText = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
        });
}