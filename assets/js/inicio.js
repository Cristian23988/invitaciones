// Inicializar AOS y Fancybox
    AOS.init({ once: true, duration: 800, offset: 80 });
    // Fancybox para la galería (usando data-fancybox en los <a>)
    // Si prefieres lightGallery, descomenta las líneas siguientes y ajusta el HTML:
    // lightGallery(document.getElementById('lightgallery'), { selector: 'a' });

    // Cuenta regresiva (26 agosto 2026, 00:00:00)
    (function() {
      const target = new Date(2026, 3, 26, 0, 0, 0); // mes 7 = agosto (0-based)
      const el = {
        d: document.getElementById('cd-days'),
        h: document.getElementById('cd-hours'),
        m: document.getElementById('cd-minutes'),
        s: document.getElementById('cd-seconds')
      };
      const tick = () => {
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) {
          el.d.textContent = '0'; el.h.textContent = '0';
          el.m.textContent = '0'; el.s.textContent = '0';
          return;
        }
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const m = Math.floor((diff % (1000*60*60)) / (1000*60));
        const s = Math.floor((diff % (1000*60)) / 1000);
        el.d.textContent = d;
        el.h.textContent = h.toString().padStart(2, '0');
        el.m.textContent = m.toString().padStart(2, '0');
        el.s.textContent = s.toString().padStart(2, '0');
      };
      tick();
      setInterval(tick, 1000);
    })();

    // Formulario RSVP (demo sin backend)
    document.getElementById('rsvpForm').addEventListener('submit', function(e){
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviado ✓';
      alert('¡Gracias por confirmar! Nos alegra contar contigo en este día.');
    });

const playBtn = document.getElementById('playBtn');
  const audio = document.getElementById('weddingAudio');

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play();
      playBtn.innerHTML = '<i class="las la-pause me-2"></i> Pausar música';
      isPlaying = true;
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="las la-music me-2"></i> Reproducir música';
      isPlaying = false;
    }
  });

const storySection = document.querySelector('.story-section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        storySection.classList.add('loaded');
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(storySection);

document.addEventListener("DOMContentLoaded", function () {

  const video = document.querySelector(".story-bg-video");
  if (!video) return;

  // 📱 Detectar móvil
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // 🎥 TUS VIDEOS (NO CAMBIAR)
  const videoWeb = "https://github.com/Cristian23988/invitaciones/releases/download/v1.1/fondoGif.m4v";
  const videoMobile = "https://github.com/Cristian23988/invitaciones/releases/download/v1.1/720.m4v";

  // 👉 Elegir según dispositivo
  const selectedVideo = isMobile ? videoMobile : videoWeb;

  // ⚙️ Configuración OBLIGATORIA
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.preload = "auto";

  // 🔗 Asignar src UNA SOLA VEZ
  video.src = selectedVideo;
  video.load();

  /* =========================
     🖥️ WEB — AUTOPLAY REAL
     ========================= */
  if (!isMobile) {
    video.autoplay = true;

    video.play().catch(() => {
      console.warn("Autoplay bloqueado en web");
    });
  }

  /* =========================
     📱 MÓVIL — SIN BOTÓN DE PLAY
     ========================= */
  if (isMobile) {
    video.autoplay = false;

    const startVideo = () => {
      video.play().then(() => {
        document.removeEventListener("touchstart", startVideo);
        document.removeEventListener("click", startVideo);
      }).catch(() => {});
    };

    // 🔑 Primer gesto válido (requerido por móviles)
    document.addEventListener("touchstart", startVideo, { once: true });
    document.addEventListener("click", startVideo, { once: true });
  }

});

document.addEventListener("DOMContentLoaded", () => {

/* ===============================
   CONFIGURACIÓN: URL DE GOOGLE SHEETS
   =============================== */
let families = {}; // aquí se guardarán los datos de Sheets
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwFIJgyKSboQc4dHsyzWbG7Yedtgd-HL00jwBpmqVD_IACCwV3EjDuYIw7MDIzNk_qN/exec"; // <- TU URL DE SCRIPT

/* ===============================
   ELEMENTOS DEL FORMULARIO
   =============================== */
let activeCode = null;
const codeInput = document.getElementById("familyCode");
const validateBtn = document.getElementById("validateBtn");
const confirmBtn = document.getElementById("confirmBtn");
const membersDiv = document.getElementById("familyMembers");
const result = document.getElementById("result");
// 🔒 Bloquear botón hasta que carguen los datos
validateBtn.disabled = true;

/* ===============================
   CARGAR DATOS DESDE GOOGLE SHEETS
   =============================== */
// Mensaje mientras carga Sheets
result.innerHTML = "Cargando invitación...";

fetch(SHEETS_URL)
  .then(res => {
    console.log("Estado HTTP:", res.status);
    return res.json();
  })
  .then(data => {
    families = data;
    console.log("Datos de Google Sheets cargados:", families);

    // ✅ Habilitar botón SOLO cuando ya hay datos
    validateBtn.disabled = false;

 

    result.innerHTML = "";
  })
  .catch(err => {
    console.error("Error cargando datos:", err);
    result.innerHTML = "❌ Error cargando datos. Recarga la página.";
  });



/* ===============================
   BOTÓN VALIDAR CÓDIGO
   =============================== */
validateBtn.addEventListener("click", () => {
  const code = codeInput.value.trim().toUpperCase();

  if (!families[code]) {
    alert("Código incorrecto ❌");
    return;
  }

  activeCode = code;
  //alert("Código correcto ✅");

  // Mostrar invitados
  membersDiv.innerHTML = "";
  families[code].forEach(name => {
    const div = document.createElement("div");
    div.style.marginBottom = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `guest-${name}`;
    checkbox.value = name;
    checkbox.name = "guests";
    checkbox.style.marginRight = "8px";

    const label = document.createElement("label");
    label.htmlFor = `guest-${name}`;
    label.textContent = name;
    label.style.cursor = "pointer";

    div.appendChild(checkbox);
    div.appendChild(label);
    membersDiv.appendChild(div);
  });

  membersDiv.style.display = "block";

  // BLOQUEAR VALIDACIÓN
  codeInput.disabled = true;
  validateBtn.disabled = true;
  validateBtn.style.background = "#999";

  // HABILITAR CONFIRMACIÓN
  confirmBtn.style.display = "block";
});

/* ===============================
   BOTON CONFIRMAR ASISTENCIA 
   =============================== */
confirmBtn.addEventListener("click", async () => {
  if (!activeCode) return;

  // Obtener invitados seleccionados
  const selectedGuests = families[activeCode].filter(
    name => document.getElementById(`guest-${name}`).checked
  );

  // Confirmación
  const confirmMsg = selectedGuests.length > 0
    ? `¿Estás seguro que quieres confirmar la asistencia de: ${selectedGuests.join(", ")}?`
    : `No seleccionaste ningún invitado. ¿Deseas continuar y registrar que no asistirán?`;

  if (!confirm(confirmMsg)) return;

  // Preparar datos para enviar a Apps Script
  const dataToSend = families[activeCode].map(name => ({
    codigo: activeCode,
    invitado: name,
    asistira: document.getElementById(`guest-${name}`).checked ? "Sí" : "No"
  }));

  // Mostrar mensaje de espera
  result.innerHTML = `<div style="
    padding: 12px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    animation: pulse 1.2s infinite;
  ">Guardando tu asistencia...</div>`;

  // Estilo animación pulse
  if (!document.getElementById('pulseStyle')) {
    const style = document.createElement('style');
    style.id = 'pulseStyle';
    style.innerHTML = `
      @keyframes pulse {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }

  try {
    const resp = await fetch(SHEETS_URL, {
      method: "POST",
      body: JSON.stringify(dataToSend)
    });
    const jsonResp = await resp.json();
    console.log("Respuesta del servidor:", jsonResp);

    // Mensaje de éxito
    result.innerHTML = `<div style="
      padding: 12px;
      background: linear-gradient(135deg, #f1d08a, #c59d5f);
      color: #2b2b2b;
      border-radius: 12px;
      text-align: center;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    ">¡Tu asistencia ha sido confirmada con éxito! 🎉</div>`;

    // Bloquear inputs y checkboxes
    confirmBtn.disabled = true;
    confirmBtn.style.background = "#999";
    codeInput.disabled = true;
    membersDiv.querySelectorAll('input').forEach(cb => cb.disabled = true);

  } catch (err) {
    console.error("Error enviando asistencia:", err);
    result.innerHTML = `<div style="
      padding: 12px;
      background: rgba(255,0,0,0.1);
      color: #b00000;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    ">Error al guardar asistencia ❌</div>`;
  }
});


});

document.getElementById('SeeMan').addEventListener('click', function() {
    // Cambia esta URL por la de Pinterest que quieras
    window.location.href = 'https://pin.it/30a39TKLy';
  });

document.getElementById('SeeWoman').addEventListener('click', function() {
    // Cambia esta URL por la de Pinterest que quieras
    window.location.href = 'https://pin.it/334lnTmeE';
  });

function toggleCuenta() {
    const cuenta = document.getElementById('cuenta-bancaria');
    cuenta.style.display = cuenta.style.display === 'none' || cuenta.style.display === ''
      ? 'block'
      : 'none';
  }
