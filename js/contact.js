function sendMail(event){
    event.preventDefault(); // stop default submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = `Project inquiry from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;

    const mailtoLink = `mailto:iinvaild@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
}
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'mshkL1V69kBv4PxzC',      // Paste your Public Key
    SERVICE_ID: 'service_nrhphpv',      // Paste your Service ID
    TEMPLATE_ID: 'template_5r5cunf'     // Paste your Template ID
};

// document.getElementById("contactform").addEventListener("submit", function (e) {
//     e.preventDefault(); // ✨ prevents 405 error

//     emailjs.send("service_nrhphpv", "template_5r5cunf", {
//         name: document.getElementById("name").value,
//         email: document.getElementById("email").value,
//         message: document.getElementById("message").value
//     })
//     .then(() => {
//         alert("Message sent!");
//     })
//     .catch((err) => {
//         console.error(err);
//         alert("Error sending message.");
//     });
// });

// document.addEventListener("DOMContentLoaded", function() {
//     emailjs.init("mshkL1V69kBv4PxzC");

//     document.getElementById("contactform").addEventListener("submit", function (e) {
//         e.preventDefault();

//         emailjs.send("service_5rmkt16", "template_bz3u8rn", {
//             name: document.getElementById("name").value,
//             email: document.getElementById("email").value,
//             message: document.getElementById("message").value
//         })
//         .then(() => {
//             Swal.fire({
//                 title: "Thank you!",
//                 text: "Thanks for reaching out — I’ll get back to you soon!",
//                 icon: "success",
//                 confirmButtonText: "Okay",
//                 confirmButtonColor: "#4BAF47",
//             });

//             // Reset the form
//             document.getElementById("contactform").reset();
//         })
//         .catch((err) => {
//             Swal.fire({
//                 title: "Oops!",
//                 text: "Something went wrong. Please try again later.",
//                 icon: "error",
//                 confirmButtonText: "Close"
//             });
//         });
//     });
// });


document.addEventListener("DOMContentLoaded", function() {
    emailjs.init("mshkL1V69kBv4PxzC");

    document.getElementById("contactform").addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_nrhphpv", "template_5r5cunf", {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        })
        .then(() => {

            // Show popup
            document.getElementById("successPopup").style.display = "flex";

            // Reset form
            document.getElementById("contactform").reset();
        })
        .catch(() => {
            alert("Something went wrong. Please try again.");
        });
    });

    // Close popup
    document.getElementById("closePopup").addEventListener("click", function() {
        document.getElementById("successPopup").style.display = "none";
    });
});
