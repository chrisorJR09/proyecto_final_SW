/* ========================================
   WIDGET DE ACCESIBILIDAD TECNOMEX
   TODO EN UNO - CSS + HTML + JS
   Archivo: js/accessibility-widget.js
   
   INSTALACIÓN:
   Agregar esta línea antes de </body>:
   <script src="../js/accessibility-widget.js"></script>
   ======================================== */

(function() {
    'use strict';

    // ==========================================
    // INYECTAR FONT AWESOME
    // ==========================================
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://kit.fontawesome.com/223c51bfeb.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    document.head.appendChild(fontAwesomeScript);

    // ==========================================
    // INYECTAR CSS
    // ==========================================
    const styles = `
        /* Variables para modo oscuro */
        body.dark-mode {
            background: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        body.dark-mode .main-header {
            background: #2d2d2d !important;
            border-bottom-color: #444 !important;
            color: #e0e0e0 !important;
        }

        body.dark-mode .logo {
            color: #ffd700 !important;
        }

        body.dark-mode .header-nav a,
        body.dark-mode .small-link {
            color: #b0b0b0 !important;
        }

        body.dark-mode .header-nav a:hover,
        body.dark-mode .small-link:hover {
            color: #ffd700 !important;
        }

        body.dark-mode .checkout-hero,
        body.dark-mode .hero-section,
        body.dark-mode .hero {
            background: linear-gradient(135deg, #0a1f17 0%, #0d2b1f 100%) !important;
        }

        body.dark-mode .checkout-main,
        body.dark-mode .content-section {
            background: transparent !important;
        }

        body.dark-mode .form-container,
        body.dark-mode .card,
        body.dark-mode .resumen,
        body.dark-mode .cat-card {
            background: #2d2d2d !important;
            border-color: #555 !important;
            color: #e0e0e0 !important;
        }

        body.dark-mode h1,
        body.dark-mode h2,
        body.dark-mode h3,
        body.dark-mode h4 {
            color: #ffd700 !important;
        }

        body.dark-mode label,
        body.dark-mode p {
            color: #b0b0b0 !important;
        }

        body.dark-mode input[type="text"],
        body.dark-mode input[type="email"],
        body.dark-mode input[type="tel"],
        body.dark-mode input[type="file"],
        body.dark-mode select,
        body.dark-mode textarea {
            background: #3a3a3a !important;
            border-color: #555 !important;
            color: #e0e0e0 !important;
        }

        body.dark-mode input:focus,
        body.dark-mode select:focus,
        body.dark-mode textarea:focus {
            border-color: #ffd700 !important;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2) !important;
        }

        body.dark-mode .metodos label {
            background: #3a3a3a !important;
            border-color: #555 !important;
        }

        body.dark-mode .metodos label:hover {
            border-color: #ffd700 !important;
            background: #444 !important;
        }

        body.dark-mode #extra-pago {
            background: #2d2d2d !important;
            border-color: #555 !important;
        }

        body.dark-mode .datos-bancarios,
        body.dark-mode .info-oxxo,
        body.dark-mode .tarjetas-aceptadas,
        body.dark-mode .formulario-tarjeta input,
        body.dark-mode .referencia-oxxo {
            background: #3a3a3a !important;
            border-color: #555 !important;
        }

        body.dark-mode .instrucciones-transferencia,
        body.dark-mode .instrucciones-oxxo {
            background: #2a3a3f !important;
            border-color: #3a5a5f !important;
        }

        body.dark-mode .aviso-transferencia,
        body.dark-mode .aviso-oxxo {
            background: #3a3020 !important;
            border-left-color: #f59e0b !important;
        }

        body.dark-mode .main-footer {
            background: linear-gradient(135deg, #0d2b1f 0%, #0a1f17 100%) !important;
        }

        body.dark-mode button[type="submit"],
        body.dark-mode .btn {
            background: #ffd700 !important;
            color: #0b2f23 !important;
        }

        /* Widget de Accesibilidad */
        .accessibility-widget {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
        }

        .accessibility-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #0b2f23;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            transition: all 0.3s;
        }

        .accessibility-button:hover {
            background: #1a4d3a;
            transform: scale(1.1);
        }

        body.dark-mode .accessibility-button {
            background: #ffd700;
            color: #0b2f23;
        }

        .accessibility-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            padding: 25px;
            width: 320px;
            display: none;
            animation: slideUp 0.3s ease;
        }

        body.dark-mode .accessibility-panel {
            background: #2d2d2d;
            border: 1px solid #444;
        }

        .accessibility-panel.active {
            display: block;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .accessibility-panel h3 {
            font-size: 1.3rem;
            color: #0b2f23 !important;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        body.dark-mode .accessibility-panel h3 {
            color: #ffd700 !important;
        }

        .accessibility-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e8e8e8;
        }

        body.dark-mode .accessibility-option {
            border-bottom-color: #444;
        }

        .accessibility-option:last-child {
            border-bottom: none;
        }

        .option-label {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.95rem;
            color: #444 !important;
        }

        body.dark-mode .option-label {
            color: #b0b0b0 !important;
        }

        .option-label i {
            font-size: 18px;
        }

        .option-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .control-btn {
            width: 36px;
            height: 36px;
            border: 2px solid #0b2f23;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            color: #0b2f23;
            transition: all 0.2s;
        }

        body.dark-mode .control-btn {
            background: #3a3a3a;
            border-color: #ffd700;
            color: #ffd700;
        }

        .control-btn:hover {
            background: #0b2f23;
            color: white;
        }

        body.dark-mode .control-btn:hover {
            background: #ffd700;
            color: #0b2f23;
        }

        .control-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .toggle-switch {
            position: relative;
            width: 52px;
            height: 28px;
            background: #ddd;
            border-radius: 14px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .toggle-switch.active {
            background: #0b2f23;
        }

        body.dark-mode .toggle-switch.active {
            background: #ffd700;
        }

        .toggle-switch::after {
            content: '';
            position: absolute;
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            top: 3px;
            left: 3px;
            transition: transform 0.3s;
        }

        .toggle-switch.active::after {
            transform: translateX(24px);
        }

        .font-size-indicator {
            font-size: 0.85rem;
            color: #0b2f23 !important;
            font-weight: 600;
            min-width: 60px;
            text-align: center;
        }

        body.dark-mode .font-size-indicator {
            color: #ffd700 !important;
        }

        .reset-btn {
            width: 100%;
            margin: 10px 0 0 0 !important;
            padding: 12px 20px !important;
            background: #0b2f23 !important;
            color: white !important;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .reset-btn:hover {
            background: #1a4d3a !important;
            transform: translateY(-2px);
        }

        body.dark-mode .reset-btn {
            background: #ffd700 !important;
            color: #0b2f23 !important;
        }

        body.dark-mode .reset-btn:hover {
            background: #ffed4e !important;
        }

        #accessibilityFeedback {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: #0b2f23;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: 600;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        body.dark-mode #accessibilityFeedback {
            background: #ffd700;
            color: #0b2f23;
        }

        @media (max-width: 768px) {
            .accessibility-widget {
                right: 15px;
                bottom: 15px;
            }

            .accessibility-button {
                width: 55px;
                height: 55px;
                font-size: 24px;
            }

            .accessibility-panel {
                width: 280px;
                right: -10px;
                padding: 20px;
            }
        }
    `;

    // Inyectar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ==========================================
    // INYECTAR HTML
    // ==========================================
    const widgetHTML = `
        <div class="accessibility-widget">
            <button class="accessibility-button" id="accessibilityBtn" aria-label="Abrir menú de accesibilidad">
                <i class="fa-brands fa-accessible-icon"></i>
            </button>

            <div class="accessibility-panel" id="accessibilityPanel">
                <h3><i class="fa-solid fa-gear"></i> Accesibilidad</h3>

                <div class="accessibility-option">
                    <div class="option-label">
                        <i class="fa-solid fa-moon"></i>
                        <span>Modo Oscuro</span>
                    </div>
                    <div class="toggle-switch" id="darkModeToggle" role="switch" aria-checked="false"></div>
                </div>

                <div class="accessibility-option">
                    <div class="option-label">
                        <i class="fa-solid fa-text-height"></i>
                        <span>Tamaño de Texto</span>
                    </div>
                    <div class="option-controls">
                        <button class="control-btn" id="decreaseFont" aria-label="Reducir tamaño de texto">-</button>
                        <span class="font-size-indicator" id="fontSizeIndicator">100%</span>
                        <button class="control-btn" id="increaseFont" aria-label="Aumentar tamaño de texto">+</button>
                    </div>
                </div>

                <div class="accessibility-option">
                    <button class="reset-btn" id="resetBtn">
                        <i class="fa-solid fa-arrow-rotate-right"></i>
                        <span>Restablecer Todo</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="accessibilityFeedback"></div>
    `;

    // Inyectar HTML cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertWidget);
    } else {
        insertWidget();
    }

    function insertWidget() {
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        initializeWidget();
    }

    // ==========================================
    // FUNCIONALIDAD
    // ==========================================
    function initializeWidget() {
        let fontSizeLevel = 100;
        const minFontSize = 80;
        const maxFontSize = 140;
        const fontSizeStep = 10;

        const accessibilityBtn = document.getElementById('accessibilityBtn');
        const accessibilityPanel = document.getElementById('accessibilityPanel');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const increaseFontBtn = document.getElementById('increaseFont');
        const decreaseFontBtn = document.getElementById('decreaseFont');
        const fontSizeIndicator = document.getElementById('fontSizeIndicator');
        const resetBtn = document.getElementById('resetBtn');
        const feedback = document.getElementById('accessibilityFeedback');

        // Cargar preferencias
        function loadPreferences() {
            const isDarkMode = localStorage.getItem('tecnomex_darkMode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.classList.add('active');
                darkModeToggle.setAttribute('aria-checked', 'true');
            }

            const savedFontSize = localStorage.getItem('tecnomex_fontSize');
            if (savedFontSize) {
                fontSizeLevel = parseInt(savedFontSize);
                applyFontSize(fontSizeLevel);
            }
        }

        // Toggle panel
        accessibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accessibilityPanel.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!accessibilityBtn.contains(e.target) && !accessibilityPanel.contains(e.target)) {
                accessibilityPanel.classList.remove('active');
            }
        });

        // Modo oscuro
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('active');
            
            const isActive = darkModeToggle.classList.contains('active');
            darkModeToggle.setAttribute('aria-checked', isActive);
            localStorage.setItem('tecnomex_darkMode', isActive);
            
            showFeedback(isActive ? '<i class="fa-solid fa-moon"></i> Modo oscuro activado' : '<i class="fa-solid fa-sun"></i> Modo claro activado');
        });

        // Reducir texto (botón -)
        decreaseFontBtn.addEventListener('click', () => {
            if (fontSizeLevel > minFontSize) {
                fontSizeLevel -= fontSizeStep;
                applyFontSize(fontSizeLevel);
                localStorage.setItem('tecnomex_fontSize', fontSizeLevel);
                showFeedback(`<i class="fa-solid fa-magnifying-glass-minus"></i> Texto reducido: ${fontSizeLevel}%`);
            }
        });

        // Aumentar texto (botón +)
        increaseFontBtn.addEventListener('click', () => {
            if (fontSizeLevel < maxFontSize) {
                fontSizeLevel += fontSizeStep;
                applyFontSize(fontSizeLevel);
                localStorage.setItem('tecnomex_fontSize', fontSizeLevel);
                showFeedback(`<i class="fa-solid fa-magnifying-glass-plus"></i> Texto aumentado: ${fontSizeLevel}%`);
            }
        });

        // Aplicar tamaño
        function applyFontSize(percentage) {
            const multiplier = percentage / 100;
            fontSizeIndicator.textContent = `${percentage}%`;

            // Guardar tamaños originales si no existen
            if (!window.originalFontSizes) {
                window.originalFontSizes = new Map();
                document.querySelectorAll('h1, h2, h3, h4, p, label, .header-nav a, .small-link, li, span, td, th, button, input, select, textarea, a').forEach(el => {
                    if (!el.closest('.accessibility-panel') && !el.closest('#accessibilityFeedback')) {
                        const originalSize = parseFloat(window.getComputedStyle(el).fontSize);
                        window.originalFontSizes.set(el, originalSize);
                    }
                });
            }

            // Aplicar el multiplier a los tamaños originales
            window.originalFontSizes.forEach((originalSize, el) => {
                if (document.body.contains(el)) {
                    el.style.fontSize = `${originalSize * multiplier}px`;
                }
            });

            decreaseFontBtn.disabled = fontSizeLevel <= minFontSize;
            increaseFontBtn.disabled = fontSizeLevel >= maxFontSize;
        }

        // Restablecer
        resetBtn.addEventListener('click', () => {
            document.body.classList.remove('dark-mode');
            darkModeToggle.classList.remove('active');
            darkModeToggle.setAttribute('aria-checked', 'false');
            
            fontSizeLevel = 100;
            
            // Limpiar tamaños guardados
            if (window.originalFontSizes) {
                window.originalFontSizes.clear();
                delete window.originalFontSizes;
            }
            
            document.querySelectorAll('[style*="font-size"]').forEach(el => {
                el.style.fontSize = '';
            });
            
            fontSizeIndicator.textContent = '100%';
            decreaseFontBtn.disabled = false;
            increaseFontBtn.disabled = false;

            localStorage.removeItem('tecnomex_darkMode');
            localStorage.removeItem('tecnomex_fontSize');

            showFeedback('<i class="fa-solid fa-circle-check"></i> Configuración restablecida');
            
            const originalHTML = resetBtn.innerHTML;
            resetBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Restablecido</span>';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i> <span>Restablecer Todo</span>';
            }, 2000);
        });

        // Mostrar feedback
        function showFeedback(message) {
            feedback.innerHTML = message;
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';

            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(20px)';
            }, 2000);
        }

        loadPreferences();
        console.log('Widget de accesibilidad TecnoMex cargado');
    }
})();