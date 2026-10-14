document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("quicknav-placeholder");
  const content = document.querySelector(".project-content");
  if (!placeholder || !content) return;

  const res = await fetch("../partials/project-quicknav.html");
  placeholder.outerHTML = await res.text();

  const list = document.querySelector(".quicknav-list");
  const sections = Array.from(content.children).filter((el) => el.id);

  // Project name at the top of the side rail
  const title = document.querySelector(".quicknav-title");
  const projectTitle = content.querySelector(".project-title");
  if (title) {
    if (projectTitle) title.textContent = projectTitle.textContent.trim();
    else title.remove();
  }

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

  // Phone / tablet layout shows the sections as a chip row (matches project.css)
  const chipRow = window.matchMedia("(max-width: 56rem)");
  let activeId = null;

  const setActive = (id) => {
    if (id === activeId) return;
    activeId = id;
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");

      // Keep the active chip in view by scrolling the row sideways only
      if (isActive && chipRow.matches) {
        const linkBox = link.getBoundingClientRect();
        const listBox = list.getBoundingClientRect();
        const left =
          list.scrollLeft +
          (linkBox.left - listBox.left) -
          (list.clientWidth - linkBox.width) / 2;
        list.scrollTo({ left, behavior: "smooth" });
      }
    });
  };

  // px below the fixed nav (desktop) or the nav + chip row (phone)
  const triggerOffset = () => (chipRow.matches ? 176 : 140);

  const updateActive = () => {
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top - triggerOffset() <= 0) {
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
