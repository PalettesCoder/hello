(function($) {
    "use strict";

    const darkModeToggle = () => {
        const toggle = $(".toggle-switch-mode");
        const body = $("body");
        const images = $(".image-switch");
        const logo = $("#logo_mode");

        if (!toggle.length) return;

        images.each(function() {
            const img = $(this);
            if (!img.data("light-original")) {
                img.data("light-original", img.attr("src"));
            }
        });

        if (logo.length && !logo.data("light-original")) {
            logo.data("light-original", logo.attr("src"));
        }

        const switchImages = (isDark) => {
            images.each(function() {
                const img = $(this);
                const light = img.data("light-original");
                const dark = img.data("dark");
                img.attr("src", isDark && dark ? dark : light);
            });

            if (logo.length) {
                const light = logo.data("light-original");
                const dark = logo.data("dark");
                logo.attr("src", isDark && dark ? dark : light);
            }
        };

        const updateToggleState = (isDark) => {
            toggle.each(function() {
                $(this).toggleClass("active", isDark);
            });
        };

        const currentMode = localStorage.getItem("darkMode");
        const defaultMode = body.data("default-mode");
        let isDark;

        if (defaultMode !== undefined) {
            isDark = defaultMode === "dark";
        } else if (currentMode !== null) {
            isDark = currentMode === "enabled";
        } else {
            isDark = false;
        }

        body.toggleClass("dark-mode", isDark);
        switchImages(isDark);
        updateToggleState(isDark);

        toggle.on("click", function() {
            const nextMode = !body.hasClass("dark-mode");
            body.toggleClass("dark-mode", nextMode);
            updateToggleState(nextMode);
            switchImages(nextMode);
            localStorage.setItem("darkMode", nextMode ? "enabled" : "disabled");
        });
    };

    const workScrollReveal = () => {
        function reveal() {
            $(".wg-work").each(function() {
                let el = $(this);
                let top = el.offset().top;
                let bottom = top + el.outerHeight();
                let scroll = $(window).scrollTop();
                let winH = $(window).height();

                if (bottom > scroll && top < scroll + winH) {
                    el.find(".wrap").addClass("active");
                } else {
                    el.find(".wrap").removeClass("active");
                }
            });
        }
        $(window).on("scroll", reveal);
        reveal();
    };

    const themeSwitcher = () => {
        // Support both legacy .choose-item and new .theme-choice
        const items = document.querySelectorAll(".choose-item, .theme-choice");
        const body = document.body;

        if (!items.length) return;

        items.forEach((item, index) => {
            item.addEventListener("click", () => {
                // Ignore elements meant for other systems (like accessibility)
                if (item.hasAttribute("data-access")) return;

                // If using data-theme (New Method)
                const themeId = item.getAttribute("data-theme");
                
                // Remove all existing theme classes
                body.classList.forEach(cls => {
                    if (cls.startsWith("body-v") || cls.startsWith("dark-v") || cls.startsWith("env-")) {
                        body.classList.remove(cls);
                    }
                });

                // Set active state
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                if (themeId) {
                    // Mapping data-theme to classes
                    const themeMap = {
                        "silver-dawn": "body-v1",
                        "lavender-stone": "body-v2",
                        "ocean-breezes": "body-v3",
                        "env-orbs": "env-orbs",
                        "env-blossom": "env-blossom",
                        "env-glimmer": "env-glimmer",
                        "env-breeze": "env-breeze",
                        "env-waves": "env-waves"
                    };
                    if (themeMap[themeId]) body.classList.add(themeMap[themeId]);
                } else {
                    // Legacy Fallback (Index based)
                    const isLight = item.classList.contains("theme-light");
                    const cls = `${isLight ? "body-v" : "dark-v"}${ (index % 3) + 1 }`;
                    body.classList.add(cls);
                }
            });
        });
    };

    const localTime = (selector = ".time-local") => {
        function update() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

            document.querySelectorAll(selector).forEach(el => {
                const d = el.querySelector(".date");
                const c = el.querySelector(".clock");
                if (d) d.textContent = dateStr;
                if (c) c.textContent = timeStr;
            });
        }
        update();
        setInterval(update, 1000);
    };

    const scrollNav = () => {
        const links = $("a.scroll-link");
        $(document).on("scroll", function() {
            links.each(function() {
                const href = $(this).attr("href");
                if (!href || href === "#") return;
                const target = $(href);
                if (!target.length) return;

                const top = target.offset().top;
                const bottom = top + target.outerHeight();
                const scroll = $(document).scrollTop();

                if (scroll < bottom - 20 && scroll >= top - 20) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        });
    };

    const menuMobile = () => {
        $(".action-open-mobile, .overlay-pop").on("click", function() {
            $(".nav-mobile-list, .overlay-pop").toggleClass("open");
            $("body").toggleClass("overflow-hidden");
            $(".btn-mobile-menu").toggleClass("close");
        });
    };

    const envControls = () => {
        const body = document.body;
        const motionToggle = document.getElementById("motionToggle");
        const tooltipToggle = document.getElementById("tooltipToggle");
        const debugToggle = document.getElementById("debugToggle");

        if (!motionToggle) return;

        // Dev Mode Overlay Element
        let devOverlay = document.getElementById("devmode-overlay");
        if (!devOverlay) {
            devOverlay = document.createElement("div");
            devOverlay.id = "devmode-overlay";
            devOverlay.innerHTML = `
                <div class="stat-row"><span class="label">STATUS:</span> <span id="dev-status">OPERATIONAL</span></div>
                <div class="stat-row"><span class="label">THEME:</span> <span id="dev-theme">DEFAULT</span></div>
                <div class="stat-row"><span class="label">MEMORY:</span> <span id="dev-mem">-- MB</span></div>
                <div class="stat-row"><span class="label">LOAD:</span> <span id="dev-load">-- ms</span></div>
                <div class="stat-row"><span class="label">FPS:</span> <span id="dev-fps">--</span></div>
            `;
            document.body.appendChild(devOverlay);
        }

        // 1. Fluid Motion
        const updateMotion = () => {
            const isEnabled = motionToggle.checked;
            body.classList.toggle("no-animations", !isEnabled);
            localStorage.setItem("env-motion", isEnabled);
        };

        // 2. Smart Tooltips
        const updateTooltips = () => {
            const isEnabled = tooltipToggle.checked;
            body.classList.toggle("hide-tooltips", !isEnabled);
            localStorage.setItem("env-tooltips", isEnabled);
        };

        // 3. Developer Mode
        const updateDebug = () => {
            const isEnabled = debugToggle.checked;
            devOverlay.classList.toggle("active", isEnabled);
            localStorage.setItem("env-debug", isEnabled);
        };

        // Event Listeners
        motionToggle.addEventListener("change", updateMotion);
        tooltipToggle.addEventListener("change", updateTooltips);
        debugToggle.addEventListener("change", updateDebug);

        // Persistent Settings Restore
        if (localStorage.getItem("env-motion") === "false") {
            motionToggle.checked = false;
            updateMotion();
        }
        if (localStorage.getItem("env-tooltips") === "false") {
            tooltipToggle.checked = false;
            updateTooltips();
        }
        if (localStorage.getItem("env-debug") === "true") {
            debugToggle.checked = true;
            updateDebug();
        }

        // Live Stats Update For Dev Mode
        let frameCount = 0;
        let lastTime = performance.now();
        const updateStats = (time) => {
            if (debugToggle.checked) {
                frameCount++;
                if (time - lastTime >= 1000) {
                    document.getElementById("dev-fps").textContent = frameCount;
                    frameCount = 0;
                    lastTime = time;
                }
                
                const themeClass = Array.from(body.classList).find(c => c.startsWith("body-v") || c.startsWith("dark-v")) || "DEFAULT";
                document.getElementById("dev-theme").textContent = themeClass.toUpperCase();

                if (window.performance && window.performance.memory) {
                    document.getElementById("dev-mem").textContent = Math.round(window.performance.memory.usedJSHeapSize / 1048576) + " MB";
                }
                
                const perf = performance.getEntriesByType("navigation")[0];
                if (perf) {
                    document.getElementById("dev-load").textContent = Math.round(perf.duration) + " ms";
                }
            }
            requestAnimationFrame(updateStats);
        };
        requestAnimationFrame(updateStats);
    };

    $(function() {
        darkModeToggle();
        workScrollReveal();
        themeSwitcher();
        localTime();
        scrollNav();
        menuMobile();
        envControls();

        // Contact Form Validation
        $("#contactform").each(function() {
            $(this).validate({
                submitHandler: function(form) {
                    const $form = $(form);
                    const data = $form.serialize();
                    const loading = $("<div />", { class: "loading" });

                    $.ajax({
                        type: "POST",
                        url: $form.attr("action"),
                        data: data,
                        beforeSend: function() {
                            $form.find(".send-wrap").append(loading);
                        },
                        success: function(resp) {
                            let msg, type;
                            if (resp === "Success") {
                                msg = "Message sent successfully. I'll get back to you soon!";
                                type = "msg-success";
                            } else {
                                msg = "Error sending message.";
                                type = "msg-error";
                            }
                            $form.prepend($("<div />", { class: "flat-alert " + type, text: msg })
                                .append($('<a class="close" href="#"><i class="icon icon-close2"></i></a>')));
                            $form.find(":input").not(".submit").val("");
                        },
                        complete: function() {
                            $form.find(".loading").remove();
                        }
                    });
                }
            });
        });

        // Infinite Slide
        if ($(".infiniteSlide").length > 0) {
            $(".infiniteSlide").each(function() {
                const el = $(this);
                const dir = el.data("style") || "left";
                const clone = el.data("clone") || 2;
                const speed = el.data("speed") || 50;
                el.infiniteslide({ speed: speed, direction: dir, clone: clone, pauseonhover: true });
            });
        }

        // Title Animation Reveal
        const revealTitles = () => {
            const titles = document.querySelectorAll(".intro-title span");
            titles.forEach(span => {
                if (span.classList.contains("active")) return;
                const rect = span.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                    setTimeout(() => span.classList.add("active"), 300);
                }
            });
        };
        window.addEventListener("scroll", revealTitles);
        window.addEventListener("load", revealTitles);
    });

})(jQuery);