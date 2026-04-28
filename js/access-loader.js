document.addEventListener("DOMContentLoaded", () => {
    const accBtns = document.querySelectorAll(".btn-access");
    let currentWidget = "none";

    function removeExistingWidgets() {
        // Since 3rd party widgets inject heavily, we can only do our best to clean up or alert the user.
        alert("Loading a new real accessibility widget. (If they overlap, please refresh the page to switch cleanly).");
    }

    function loadAccessiBe() {
        const s = document.createElement('script');
        s.src = 'https://acsbapp.com/apps/app/dist/js/app.js';
        s.async = true;
        s.onload = function(){
            acsbJS.init({
                statementLink: '',
                footerHtml: '',
                hideMobile: false,
                hideTrigger: false, // Show their real floating trigger
                language: 'en',
                position: 'right',
                leadColor: '#146FF8',
                triggerColor: '#146FF8',
                triggerRadius: '50%',
                triggerPositionX: 'right',
                triggerPositionY: 'bottom',
                triggerIcon: 'people',
                triggerSize: 'bottom',
                triggerOffsetX: 20,
                triggerOffsetY: 20,
                mobile: {
                    triggerSize: 'small',
                    triggerPositionX: 'right',
                    triggerPositionY: 'bottom',
                    triggerOffsetX: 20,
                    triggerOffsetY: 20,
                    triggerRadius: '20'
                }
            });
            console.log("AccessiBe loaded.");
        };
        document.body.appendChild(s);
    }

    function loadEqualWeb() {
        window.interdeal = { "sitekey": "DEMO_KEY", "Position": "Left", "Menulang": "EN" };
        const coreCall = document.createElement('script');
        coreCall.src = 'https://cdn.equalweb.com/core/4.3.7/accessibility.js';
        coreCall.defer = true;
        document.body.appendChild(coreCall);
        console.log("EqualWeb loaded.");
    }

    function loadEyeAble() {
        window.eyeAbleConfig = { pluginPath: "https://eye-able.com/plugins/accessibility/" };
        const a = document.createElement("script");
        a.src = "https://eye-able.com/plugins/accessibility/eyeAble.js";
        a.async = true;
        document.body.appendChild(a);
        console.log("Eye-Able loaded.");
    }

    function loadUserWay() {
        const script = document.createElement("script");
        script.src = "https://cdn.userway.org/widget.js";
        script.setAttribute("data-account", "y1eB9nCxzX");
        script.async = true;
        document.body.appendChild(script);
        console.log("UserWay loaded.");
    }

    accBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const widget = this.getAttribute("data-access");
            if (widget === currentWidget) return;

            accBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            if (currentWidget !== "none") {
                removeExistingWidgets();
            }

            currentWidget = widget;

            if (widget === "accessibe") loadAccessiBe();
            if (widget === "equalweb") loadEqualWeb();
            if (widget === "eyeable") loadEyeAble();
            if (widget === "userway") loadUserWay();
        });
    });
});
