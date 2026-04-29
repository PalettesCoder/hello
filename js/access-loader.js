document.addEventListener("DOMContentLoaded", () => {
    const accBtns = document.querySelectorAll(".btn-access");
    let currentWidget = "none";

    console.log("Accessibility Loader Initialized.");

    function removeExistingWidgets() {
        console.log("Cleaning up accessibility widgets...");
        const selectors = [
            '#userwayAccessibilityWidget', '.uwy',
            'iframe[title*="Accessibility"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                el.remove();
            });
        });

        // Remove injected scripts
        const scripts = document.querySelectorAll('script[data-acc-widget]');
        scripts.forEach(s => s.remove());
    }

    function loadUserWay() {
        console.log("Triggering UserWay...");
        const script = document.createElement("script");
        script.src = "https://cdn.userway.org/widget.js";
        script.setAttribute("data-account", "y1eB9nCxzX");
        script.async = true;
        script.setAttribute('data-acc-widget', 'userway');
        document.body.appendChild(script);
    }

    accBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const widget = this.getAttribute("data-access");
            if (widget === currentWidget) return;

            accBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            removeExistingWidgets();
            currentWidget = widget;

            if (widget === "userway") {
                loadUserWay();
            }
        });
    });
});
