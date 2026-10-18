document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("quicknav-placeholder");
  const content = document.querySelector(".project-content");
  if (!placeholder || !content) return;

  const res = await fetch("../partials/project-quicknav.html");
  placeholder.outerHTML = await res.text();

  const list = document.querySelector(".quicknav-list");
  const sections = Array.from(content.children).filter((el) => el.id);

  if (!sections.length) {
    document.querySelector(".quicknav-toggle")?.remove();
    return;
  }

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

  // Phone / tablet layout shows the sections in a burger menu (matches project.css)
  const burgerLayout = window.matchMedia("(max-width: 56rem)");
  const quicknav = document.querySelector(".project-quicknav");
  const rail = document.querySelector(".project-quicknav-rail");
  const toggle = document.querySelector(".quicknav-toggle");
  let activeId = null;

  const setOpen = (open) => {
    quicknav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!quicknav.classList.contains("is-open"));
  });

  // Close on a tap outside the menu, or on Escape
  document.addEventListener("click", (e) => {
    if (!quicknav.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && quicknav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  const setActive = (id) => {
    if (id === activeId) return;
    activeId = id;
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  // px below the fixed nav (desktop) or just below the burger bar (phone)
  const triggerOffset = () =>
    burgerLayout.matches ? rail.getBoundingClientRect().bottom + 32 : 140;

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
      setOpen(false);
    });
  });
});
