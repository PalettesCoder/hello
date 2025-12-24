document.addEventListener("DOMContentLoaded", function() {
    const popupOverlay = document.getElementById("welcome-popup-2");

    if (popupOverlay) {
        const continueToWebsiteButton = popupOverlay.querySelector("#continue-to-website-2");
        const contactFromPopupButton = popupOverlay.querySelector("#contact-from-popup-2");

        // Show the popup
        popupOverlay.style.display = "flex";

        if (continueToWebsiteButton) {
            // Hide the popup when the "Continue to Website" button is clicked
            continueToWebsiteButton.addEventListener("click", function(event) {
                event.preventDefault();
                popupOverlay.style.display = "none";
            });
        }

        if (contactFromPopupButton) {
            contactFromPopupButton.addEventListener("click", function() {
                popupOverlay.style.display = "none";
            });
        }
    }
});