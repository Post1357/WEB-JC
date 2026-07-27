document.addEventListener('DOMContentLoaded', () => {
    const SECRET = "Pepito123";

    // Elementos DOM
    const lockScreen = document.getElementById('lockScreen');
    const mainUI = document.getElementById('mainUI');
    const passInput = document.getElementById('passInput');
    const btnLogin = document.getElementById('btnLogin');

    // Validación de Contraseña
    function checkPass() {
        if (passInput.value === SECRET) {
            lockScreen.classList.add('hidden');
            mainUI.classList.remove('hidden');
            fetchNetworkInfo();
            getConnectionType();
            getHardwareData();
        } else {
            alert("TOKEN INVÁLIDO");
        }
    }

    btnLogin.addEventListener('click', checkPass);

    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPass();
    });

    // Deshabilitar Clic Derecho
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Bloqueo de atajos de desarrollo (F12, Ctrl+Shift+I, Ctrl+U)
    document.addEventListener('keydown', (e) => {
        if (e.key === "F12" || 
           (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) || 
           (e.ctrlKey && (e.key === "u" || e.key === "U"))) {
            e.preventDefault();
            return false;
        }
    });

    // Efecto de desenfoque al perder foco de la ventana
    window.addEventListener('blur', () => document.body.classList.add('hidden-context'));
    window.addEventListener('focus', () => document.body.classList.remove('hidden-context'));

    // Navegación por pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabPanels.forEach(panel => panel.classList.remove('active'));
            tabButtons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(tabId).classList.add('active');
            button.classList.add('active');
        });
    });

    // Manejo de eventos de botones dentro de las tarjetas
    document.addEventListener('click', (e) => {
        // Botones de Abrir Enlace (Navegación Directa)
        if (e.target.classList.contains('btn-open')) {
            const url = e.target.getAttribute('data-url');
            if (url) window.open(url, '_blank');
        }

        // Botones de Ocultar Tarjeta
        if (e.target.classList.contains('btn-hide')) {
            const card = e.target.closest('.card');
            if (card) card.style.opacity = '0.2';
        }
    });

    // Generador de Tokens Criptográficos en tiempo real (Sustituye la hora)
    function generateRandomHex(length) {
        const chars = '0123456789ABCDEF';
        let result = '0x';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    setInterval(() => {
        const tokenElem = document.getElementById('crypto-token');
        if (tokenElem) {
            tokenElem.innerText = generateRandomHex(8);
        }
    }, 1000);

    // Consulta de la IP Pública mediante API
    function fetchNetworkInfo() {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                const ipElem = document.getElementById('ip-public');
                if (ipElem) ipElem.innerText = data.ip || "No detectada";
            })
            .catch(() => {
                const ipElem = document.getElementById('ip-public');
                if (ipElem) ipElem.innerText = "Bloqueado / Error";
            });
    }

    // Detección del tipo de conexión (Ethernet o Wi-Fi)
    function getConnectionType() {
        const netTypeElem = document.getElementById('net-type');
        if (!netTypeElem) return;

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection && connection.type) {
            if (connection.type === 'wifi') {
                netTypeElem.innerText = "Wi-Fi";
            } else if (connection.type === 'ethernet') {
                netTypeElem.innerText = "Ethernet";
            } else {
                netTypeElem.innerText = "Ethernet";
            }
        } else {
            // Evaluación basada en latencia/RTT para navegadores sin API directa
            if (connection && connection.rtt !== undefined && connection.rtt < 15) {
                netTypeElem.innerText = "Ethernet";
            } else if (connection && connection.rtt !== undefined && connection.rtt >= 15) {
                netTypeElem.innerText = "Wi-Fi";
            } else {
                netTypeElem.innerText = "Ethernet";
            }
        }
    }

    // Consulta de Datos de Hardware
    function getHardwareData() {
        const cores = navigator.hardwareConcurrency || "N/A";
        const hwInfo = document.getElementById('hw-info');
        if (hwInfo) {
            hwInfo.innerHTML = `
                <div>OS: <span>${navigator.platform}</span></div>
                <div>CPU CORES: <span>${cores} Threads</span></div>
                <div>ESTADO: <span>EN LÍNEA</span></div>
            `;
        }
    }
});