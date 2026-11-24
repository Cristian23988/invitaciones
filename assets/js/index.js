const invitation = document.getElementById("openInvitation");
const prompt = document.getElementById("openPrompt");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let redirectTimer;
let revealTimer;
let resetTimer;

invitation.addEventListener("click", event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  if (invitation.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    return;
  }

  if (!event.target.closest(".wax-seal") && event.detail !== 0) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  document.body.classList.add("is-opening");
  invitation.setAttribute("aria-disabled", "true");
  prompt.textContent = "Abriendo tu invitación…";
  sessionStorage.setItem("weddingMusicPosition", "0");
  window.weddingMusic.start();

  revealTimer = window.setTimeout(() => {
    document.body.classList.add("is-card-reveal");
  }, reducedMotion ? 0 : 3100);

  redirectTimer = window.setTimeout(() => {
    window.location.href = invitation.href;
  }, reducedMotion ? 1200 : 5200);
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || invitation.getAttribute("aria-disabled") !== "true") {
    return;
  }

  window.clearTimeout(revealTimer);
  window.clearTimeout(redirectTimer);
  window.clearTimeout(resetTimer);
  window.weddingMusic.stop();
  document.body.classList.remove("is-opening", "is-card-reveal");
  prompt.textContent = "Preparando la apertura…";

  resetTimer = window.setTimeout(() => {
    invitation.setAttribute("aria-disabled", "false");
    prompt.textContent = "Toca el sello para abrir";
  }, reducedMotion ? 0 : 1200);
});
