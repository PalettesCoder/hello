function sendMail(event){
    event.preventDefault(); // stop default submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = `Project inquiry from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;

    const mailtoLink = `mailto:hello@isak.design?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
}