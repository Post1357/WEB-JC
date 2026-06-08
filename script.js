const SECRET = "Pepito123";

function checkPass() {
    if(document.getElementById('passInput').value === SECRET) {
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('mainUI').style.display = 'block';
        fetchNetworkInfo();
        getHardwareData();
    } else {
        alert("TOKEN INVÁLIDO");
    }
}

// Bloqueo de teclas de desarrollo (F12, Ctrl+Shift+I, Ctrl+U)
document.addEventListener('keydown', (e) => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
        e.preventDefault();
        return false;
    }
});

// Desenfoque de pantalla al salir de la pestaña
window.onblur = () => document.body.classList.add('hidden-context');
window.onfocus = () => document.body.classList.remove('hidden-context');

// Manejo de pestañas (Tabs)
function showTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

// Reloj en tiempo real
setInterval(() => {
    document.getElementById('timer').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);

// Obtener información de red mediante API externa
function fetchNetworkInfo() {
    fetch('http://ip-api.com/json/?fields=status,isp,query,city,country')
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            document.getElementById('ip-addr').innerText = data.query;
            document.getElementById('isp-name').innerText = data.isp;
            document.getElementById('geo-loc').innerText = `${data.city}, ${data.country}`;
        }
    }).catch(() => {
        document.getElementById('ip-addr').innerText = "Bloqueado";
    });
}

// Detectar datos básicos del Hardware
function getHardwareData() {
    const cores = navigator.hardwareConcurrency || "N/A";
    document.getElementById('hw-info').innerHTML = `
        <div>OS: <span>${navigator.platform}</span></div>
        <div>CPU CORES: <span>${cores} Threads</span></div>
        <div>ESTADO: <span>EN LÍNEA</span></div>
    `;
}