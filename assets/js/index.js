const invitation = document.getElementById("openInvitation");
const prompt = document.getElementById("openPrompt");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

invitation.addEventListener("click", event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  document.body.classList.add("is-opening");
  invitation.classList.add("is-opening");
  invitation.setAttribute("aria-disabled", "true");
  prompt.textContent = "Abriendo tu invitación…";

  window.setTimeout(() => {
    window.location.href = invitation.href;
  }, reducedMotion ? 100 : 2100);
});
