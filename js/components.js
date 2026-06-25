// Hide system cursor immediately — runs synchronously before any async scripts
(function () {
  const s = document.createElement("style");
  s.textContent =
    "*,a,button,input,select,textarea,[href],[tabindex],[role='button']{cursor:none!important}";
  document.head.appendChild(s);
})();

const page = window.location.pathname.split("/").pop().replace(".html", "");

const _self = document.currentScript;
const _base = _self ? _self.src.replace(/components\.js$/, "") : "../../js/";
const cursorScript = document.createElement("script");
cursorScript.src = _base + "cursor.js";
document.head.appendChild(cursorScript);

async function loadPartial(placeholderId, file) {
  const res = await fetch(file);
  const html = await res.text();
  const placeholder = document.getElementById(placeholderId);
  placeholder.outerHTML = html;
}

const isInProject = window.location.pathname.includes("/project/");
const navPrefix = isInProject ? "../main-page/" : "";

Promise.all([
  loadPartial("nav-placeholder", "../partials/nav.html"),
  loadPartial("footer-placeholder", "../partials/footer.html"),
]).then(() => {
  if (isInProject) {
    document.querySelectorAll(".nav-tab").forEach((a) => {
      a.href = navPrefix + a.getAttribute("href");
    });
  }

  const tab = document.querySelector(`.tab-${page}`);
  if (tab) tab.classList.add("active");

  const nav = document.querySelector(".site-nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  const footer = document.querySelector(".site-footer");
  if (footer) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("footer-visible");
          footerObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }
});
