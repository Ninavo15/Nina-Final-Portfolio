const page = window.location.pathname.split("/").pop().replace(".html", "");

async function loadPartial(placeholderId, file) {
  const res = await fetch(file);
  const html = await res.text();
  const placeholder = document.getElementById(placeholderId);
  placeholder.outerHTML = html;
}

Promise.all([
  loadPartial("nav-placeholder", "../partials/nav.html"),
  loadPartial("footer-placeholder", "../partials/footer.html"),
]).then(() => {
  const tab = document.querySelector(`.tab-${page}`);
  if (tab) tab.classList.add("active");

  const nav = document.querySelector(".site-nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });
});
