document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("quicknav-placeholder");
  const content = document.querySelector(".project-content");
  if (!placeholder || !content) return;

  const res = await fetch("../partials/project-quicknav.html");
  placeholder.outerHTML = await res.text();

  const list = document.querySelector(".quicknav-list");
  const sections = Array.from(content.children).filter((el) => el.id);
  if (!sections.length) return;

  sections.forEach((section) => {
    const label =
      section.dataset.navLabel ||
      section.querySelector(".section-label")?.textContent.trim() ||
      section.id;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${section.id}`;
    a.textContent = label;
    li.appendChild(a);
    list.appendChild(li);
  });

  const links = list.querySelectorAll("a");

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const triggerOffset = 120; // px below the fixed nav bar

  const updateActive = () => {
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top - triggerOffset <= 0) {
        current = section;
      }
    }
    if (current) setActive(current.id);
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setActive(link.getAttribute("href").slice(1));
    });
  });
});
