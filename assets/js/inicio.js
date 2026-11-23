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
