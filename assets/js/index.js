const invitation = document.getElementById("openInvitation");
const invitationPage = document.getElementById("invitationPage");
const prompt = document.getElementById("openPrompt");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const openingTitle = document.title;
let transitionTimer;
let revealTimer;
let resetTimer;
let invitationReady = false;
let shouldShowInvitation = false;

const revealInvitation = () => {
  if (!invitationReady || !shouldShowInvitation) return;

  invitationPage.removeAttribute("aria-hidden");
  document.body.classList.add("is-invitation-loaded");
  document.title = invitationPage.contentDocument.title;
  if (!window.history.state || !window.history.state.invitationPage) {
    window.history.pushState({ invitationPage: true }, "", invitation.href);
  }
};

invitationPage.addEventListener("load", () => {
  if (!invitationPage.hasAttribute("src")) return;

  invitationReady = true;
  revealInvitation();
});

window.addEventListener("popstate", event => {
  if (event.state && event.state.invitationPage) {
    shouldShowInvitation = true;
    revealInvitation();
    return;
  }

  shouldShowInvitation = false;
  document.body.classList.remove("is-invitation-loaded", "is-opening", "is-card-reveal");
  invitationPage.setAttribute("aria-hidden", "true");
  invitation.setAttribute("aria-disabled", "false");
  prompt.textContent = "Toca el sello para abrir";
  document.title = openingTitle;
  window.weddingMusic.stop();
});

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
  shouldShowInvitation = false;
  if (!invitationPage.hasAttribute("src")) invitationPage.src = invitation.href;

  revealTimer = window.setTimeout(() => {
    document.body.classList.add("is-card-reveal");
  }, reducedMotion ? 0 : 3100);

  transitionTimer = window.setTimeout(() => {
    shouldShowInvitation = true;
    revealInvitation();
  }, reducedMotion ? 1200 : 5200);
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || invitation.getAttribute("aria-disabled") !== "true") {
    return;
  }

  window.clearTimeout(revealTimer);
  window.clearTimeout(transitionTimer);
  window.clearTimeout(resetTimer);
  window.weddingMusic.stop();
  document.body.classList.remove("is-opening", "is-card-reveal");
  prompt.textContent = "Preparando la apertura…";

  resetTimer = window.setTimeout(() => {
    invitation.setAttribute("aria-disabled", "false");
    prompt.textContent = "Toca el sello para abrir";
  }, reducedMotion ? 0 : 1200);
});
