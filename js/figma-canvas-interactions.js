(function () {
    function initFigmaCanvasInteractions() {
        var viewport = document.getElementById('viewport');
        var panCanvas = document.getElementById('panCanvas');
        var layers = Array.from(document.querySelectorAll('.figma-layer'));
        if (!viewport || !panCanvas || !layers.length) return;
        if (window.__figmaCanvasInteractionsReady) return;
        window.__figmaCanvasInteractionsReady = true;

        var api = window.figmaViewportApi || {};
        var layerNavItems = Array.from(document.querySelectorAll('.figma-sidebar-left .sidebar-section:last-of-type .sidebar-list .list-item'));
        var inspectorRoot = document.querySelector('.figma-sidebar-right .sidebar-panel-content');
        var activeLayer = null;
        var frameDrag = null;
        var lastInteractionAt = Date.now();
        var inspectorBindings = null;

        function getScale() {
            return typeof api.getScale === 'function' ? api.getScale() : 1;
        }

        function selectLayer(layer) {
            layers.forEach(function (node) { node.classList.remove('active-frame'); });
            layer.classList.add('active-frame');
            activeLayer = layer;
            lastInteractionAt = Date.now();

            if (layerNavItems.length) {
                var layerIndex = layers.indexOf(layer);
                layerNavItems.forEach(function (item, index) {
                    item.classList.toggle('active', index === layerIndex);
                });
            }

            syncInspectorFromLayer(layer);
        }

        function getTextTargets(layer) {
            return Array.from(layer.querySelectorAll('h1, h2, h3, h4, p, li, .layer-title, .reveal-title, .reveal-desc, .type-lab-word, .type-lab-meta'));
        }

        function getPrimaryTextTarget(layer) {
            var targets = getTextTargets(layer);
            return targets[0] || null;
        }

        function parseNumericValue(value, fallback) {
            var parsed = parseFloat(String(value).replace(/[^\d.-]/g, ''));
            return Number.isFinite(parsed) ? parsed : fallback;
        }

        function resolveInspectorField(selector, fallbackNode, kind) {
            var existing = inspectorRoot ? inspectorRoot.querySelector(selector) : null;
            return createInspectorInput(existing || fallbackNode, kind);
        }

        function getInspectorSections() {
            if (!inspectorRoot) return {};
            var sections = Array.from(inspectorRoot.querySelectorAll('.sidebar-section'));
            var result = {};
            sections.forEach(function (section) {
                var title = section.querySelector('.section-label');
                if (!title) return;
                var key = title.childNodes[0] && title.childNodes[0].textContent ? title.childNodes[0].textContent.trim().toLowerCase() : title.textContent.trim().toLowerCase();
                result[key] = section;
            });
            return result;
        }

        function createInspectorInput(node, kind) {
            if (!node || !node.parentNode) return null;
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
                node.classList.add('figma-inspector-input');
                if (kind) node.classList.add(kind);
                return node;
            }
            var input = document.createElement('input');
            input.type = 'text';
            input.value = node.textContent.trim();
            input.className = 'figma-inspector-input ' + kind;
            input.setAttribute('aria-label', node.textContent.trim() || kind);
            node.parentNode.replaceChild(input, node);
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    input.blur();
                }
            });
            return input;
        }

        function buildInspectorBindings() {
            if (!inspectorRoot) return null;
            var sections = getInspectorSections();
            var layoutInputs = sections.layout ? sections.layout.querySelectorAll('.input-with-icon') : [];
            var appearanceColumns = sections.appearance ? sections.appearance.querySelectorAll('.prop-row-custom > div') : [];
            var typographyRows = sections.typography ? sections.typography.querySelectorAll('.prop-row-custom') : [];
            var fillSection = sections.fill;

            var bindings = {
                width: resolveInspectorField('[data-figma-field="width"]', layoutInputs[0] ? layoutInputs[0].querySelectorAll('span')[1] : null, 'figma-editable-value'),
                height: resolveInspectorField('[data-figma-field="height"]', layoutInputs[1] ? layoutInputs[1].querySelectorAll('span')[1] : null, 'figma-editable-value'),
                opacity: resolveInspectorField('[data-figma-field="opacity"]', appearanceColumns[0] ? appearanceColumns[0].querySelector('.input-with-icon span:last-child') : null, 'figma-editable-value'),
                radius: resolveInspectorField('[data-figma-field="radius"]', appearanceColumns[1] ? appearanceColumns[1].querySelector('.input-with-icon span:last-child') : null, 'figma-editable-value'),
                fontFamily: resolveInspectorField('[data-figma-field="font-family"]', typographyRows[0] ? typographyRows[0].querySelector('.prop-block-custom span') : null, 'figma-editable-block'),
                fontWeight: resolveInspectorField('[data-figma-field="font-weight"]', typographyRows[1] ? typographyRows[1].querySelector('.prop-block-custom span') : null, 'figma-editable-block'),
                fontSize: resolveInspectorField('[data-figma-field="font-size"]', typographyRows[1] ? typographyRows[1].querySelectorAll('.prop-block-custom span')[1] : null, 'figma-editable-block'),
                lineHeight: resolveInspectorField('[data-figma-field="line-height"]', typographyRows[2] ? typographyRows[2].querySelectorAll('.input-with-icon span')[1] : null, 'figma-editable-value'),
                letterSpacing: resolveInspectorField('[data-figma-field="letter-spacing"]', typographyRows[2] ? typographyRows[2].querySelectorAll('.input-with-icon span')[3] : null, 'figma-editable-value'),
                fillHex: fillSection ? resolveInspectorField('[data-figma-field="fill-hex"]', fillSection.querySelector('.hex-input'), 'figma-editable-chip') : null,
                fillOpacity: fillSection ? resolveInspectorField('[data-figma-field="fill-opacity"]', fillSection.querySelector('.opacity-input'), 'figma-editable-chip') : null,
                fillSwatch: fillSection ? fillSection.querySelector('.color-swatch') : null
            };

            function bindEditable(node, handler) {
                if (!node) return;
                node.addEventListener('blur', function () {
                    if (!activeLayer) return;
                    handler(node.value.trim(), activeLayer);
                    syncInspectorFromLayer(activeLayer);
                });
            }

            bindEditable(bindings.width, function (value, layer) {
                var next = Math.max(120, parseNumericValue(value, layer.offsetWidth));
                layer.style.width = next + 'px';
            });
            bindEditable(bindings.height, function (value, layer) {
                var next = Math.max(120, parseNumericValue(value, layer.offsetHeight));
                layer.style.height = next + 'px';
            });
            bindEditable(bindings.opacity, function (value, layer) {
                var next = Math.max(0.1, Math.min(1, parseNumericValue(value, 100) / 100));
                layer.style.opacity = String(next);
            });
            bindEditable(bindings.radius, function (value, layer) {
                var next = Math.max(0, parseNumericValue(value, 0));
                layer.style.borderRadius = next + 'px';
            });
            bindEditable(bindings.fontFamily, function (value, layer) {
                getTextTargets(layer).forEach(function (node) { node.style.fontFamily = value; });
            });
            bindEditable(bindings.fontWeight, function (value, layer) {
                getTextTargets(layer).forEach(function (node) { node.style.fontWeight = value; });
            });
            bindEditable(bindings.fontSize, function (value, layer) {
                var next = Math.max(8, parseNumericValue(value, 16));
                getTextTargets(layer).forEach(function (node) { node.style.fontSize = next + 'px'; });
            });
            bindEditable(bindings.lineHeight, function (value, layer) {
                var normalized = String(value).toLowerCase() === 'auto' ? '1.2' : String(parseNumericValue(value, 1.2));
                getTextTargets(layer).forEach(function (node) { node.style.lineHeight = normalized; });
            });
            bindEditable(bindings.letterSpacing, function (value, layer) {
                var normalized = String(value).includes('em') ? value : (String(value).includes('%') ? (parseNumericValue(value, 0) / 100).toFixed(2) + 'em' : parseNumericValue(value, 0) + 'px');
                getTextTargets(layer).forEach(function (node) { node.style.letterSpacing = normalized; });
            });
            bindEditable(bindings.fillHex, function (value, layer) {
                var hex = String(value).replace('#', '').trim();
                if (/^[0-9a-fA-F]{6}$/.test(hex)) {
                    layer.style.backgroundColor = '#' + hex;
                }
            });
            bindEditable(bindings.fillOpacity, function (value, layer) {
                var next = Math.max(0.1, Math.min(1, parseNumericValue(value, 100) / 100));
                layer.style.opacity = String(next);
            });

            if (bindings.fillSwatch) {
                bindings.fillSwatch.style.cursor = 'pointer';
                bindings.fillSwatch.addEventListener('click', function () {
                    if (!activeLayer || !bindings.fillHex) return;
                    bindings.fillHex.focus();
                });
            }

            return bindings;
        }

        function syncInspectorFromLayer(layer) {
            if (!layer || !inspectorBindings) return;
            var computed = getComputedStyle(layer);
            var primaryText = getPrimaryTextTarget(layer);
            var textStyles = primaryText ? getComputedStyle(primaryText) : null;
            var backgroundColor = computed.backgroundColor || 'rgb(255, 255, 255)';
            var hex = '#ffffff';
            var colorMatch = backgroundColor.match(/\d+/g);
            if (colorMatch && colorMatch.length >= 3) {
                hex = '#' + colorMatch.slice(0, 3).map(function (value) {
                    return Number(value).toString(16).padStart(2, '0');
                }).join('');
            }

            if (inspectorBindings.width) inspectorBindings.width.value = String(Math.round(layer.offsetWidth));
            if (inspectorBindings.height) inspectorBindings.height.value = String(Math.round(layer.offsetHeight));
            if (inspectorBindings.opacity) inspectorBindings.opacity.value = Math.round(parseFloat(computed.opacity || '1') * 100) + '%';
            if (inspectorBindings.radius) inspectorBindings.radius.value = String(Math.round(parseFloat(computed.borderRadius || '0')));
            if (textStyles && inspectorBindings.fontFamily) inspectorBindings.fontFamily.value = textStyles.fontFamily.split(',')[0].replace(/['"]/g, '');
            if (textStyles && inspectorBindings.fontWeight) inspectorBindings.fontWeight.value = textStyles.fontWeight;
            if (textStyles && inspectorBindings.fontSize) inspectorBindings.fontSize.value = String(Math.round(parseFloat(textStyles.fontSize || '16')));
            if (textStyles && inspectorBindings.lineHeight) {
                inspectorBindings.lineHeight.value = textStyles.lineHeight === 'normal' ? 'Auto' : textStyles.lineHeight;
            }
            if (textStyles && inspectorBindings.letterSpacing) inspectorBindings.letterSpacing.value = textStyles.letterSpacing;
            if (inspectorBindings.fillHex) inspectorBindings.fillHex.value = hex.replace('#', '').toUpperCase();
            if (inspectorBindings.fillOpacity) inspectorBindings.fillOpacity.value = Math.round(parseFloat(computed.opacity || '1') * 100) + '%';
            if (inspectorBindings.fillSwatch) inspectorBindings.fillSwatch.style.background = hex;
        }

        function focusLayer(layer) {
            if (typeof api.focusLayer === 'function') {
                api.focusLayer(layer);
                return;
            }

            var scale = getScale();
            var computed = getComputedStyle(layer);
            var left = parseFloat(layer.style.left || computed.left || 0);
            var top = parseFloat(layer.style.top || computed.top || 0);
            var centerX = left + layer.offsetWidth / 2;
            var centerY = top + layer.offsetHeight / 2;
            panCanvas.style.transform = 'translate3d(' + (window.innerWidth / 2 - centerX * scale) + 'px, ' + (window.innerHeight / 2 - centerY * scale) + 'px, 0) scale(' + scale + ')';
        }

        function randomizeLayer(layer) {
            var bars = layer.querySelectorAll('.mock-bar');
            bars.forEach(function (bar) {
                var width = 24 + Math.random() * 66;
                bar.style.width = width + '%';
            });

            var cards = layer.querySelectorAll('.mock-card');
            var tokens = ['UX', 'UI', '404', 'JS', 'SYNC', 'FLOW'];
            cards.forEach(function (card) {
                card.textContent = tokens[Math.floor(Math.random() * tokens.length)];
            });

            var headings = layer.querySelectorAll('h1, h2, h3, .reveal-title, .type-lab-word');
            headings.forEach(function (heading) {
                heading.style.letterSpacing = (Math.random() * -0.08).toFixed(2) + 'em';
            });

            if (layer.animate) {
                layer.animate([
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(-0.6deg)' },
                    { transform: 'rotate(0deg)' }
                ], { duration: 220, easing: 'ease-out' });
            }
            lastInteractionAt = Date.now();
        }

        function toggleScale(layer, button) {
            layer.classList.toggle('frame-expanded');
            if (button) button.classList.toggle('is-active', layer.classList.contains('frame-expanded'));
            lastInteractionAt = Date.now();
        }

        function bindLayer(layer) {
            if (layer.dataset.figmaInteractiveReady === 'true') return;
            layer.dataset.figmaInteractiveReady = 'true';
            layer.setAttribute('tabindex', '0');

            layer.addEventListener('mousedown', function (event) {
                if (event.button !== 0) return;
                if (event.target.closest('input, textarea, select, button, a, label, form, .search-bar-container, .reveal-actions')) return;
                event.stopPropagation();
                selectLayer(layer);

                var computed = getComputedStyle(layer);
                frameDrag = {
                    frame: layer,
                    startX: event.clientX,
                    startY: event.clientY,
                    originLeft: parseFloat(layer.style.left || computed.left || 0),
                    originTop: parseFloat(layer.style.top || computed.top || 0)
                };
                layer.classList.add('dragging');
                lastInteractionAt = Date.now();
            });

            layer.addEventListener('click', function (event) {
                if (event.target.closest('input, textarea, select, button, a, label')) return;
                selectLayer(layer);
            });

            layer.addEventListener('dblclick', function (event) {
                if (event.target.closest('input, textarea, select, button, a, label')) return;
                toggleScale(layer);
            });

            layer.addEventListener('keydown', function (event) {
                var step = event.shiftKey ? 20 : 8;
                var computed = getComputedStyle(layer);
                var left = parseFloat(layer.style.left || computed.left || 0);
                var top = parseFloat(layer.style.top || computed.top || 0);

                if (event.key === 'Enter') {
                    event.preventDefault();
                    toggleScale(layer);
                    return;
                }
                if (event.key.toLowerCase() === 'f') {
                    event.preventDefault();
                    focusLayer(layer);
                    return;
                }
                if (event.key.toLowerCase() === 'r') {
                    event.preventDefault();
                    randomizeLayer(layer);
                    return;
                }
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    layer.style.left = (left - step) + 'px';
                }
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    layer.style.left = (left + step) + 'px';
                }
                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    layer.style.top = (top - step) + 'px';
                }
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    layer.style.top = (top + step) + 'px';
                }
            });
        }

        layers.forEach(bindLayer);
        inspectorBindings = buildInspectorBindings();

        if (layerNavItems.length) {
            layerNavItems.slice(0, layers.length).forEach(function (item, index) {
                item.addEventListener('click', function () {
                    selectLayer(layers[index]);
                    focusLayer(layers[index]);
                });
            });
        }

        window.addEventListener('mousemove', function (event) {
            if (!frameDrag) return;
            var scale = getScale();
            var dx = (event.clientX - frameDrag.startX) / scale;
            var dy = (event.clientY - frameDrag.startY) / scale;
            frameDrag.frame.style.left = (frameDrag.originLeft + dx) + 'px';
            frameDrag.frame.style.top = (frameDrag.originTop + dy) + 'px';
        });

        window.addEventListener('mouseup', function () {
            if (!frameDrag) return;
            frameDrag.frame.classList.remove('dragging');
            frameDrag = null;
        });

        setInterval(function () {
            if (Date.now() - lastInteractionAt < 5000) return;
            if (!layers.length) return;
            var layer = layers[Math.floor(Math.random() * layers.length)];
            randomizeLayer(layer);
        }, 2600);

        selectLayer(layers[0]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFigmaCanvasInteractions);
    } else {
        initFigmaCanvasInteractions();
    }
})();
