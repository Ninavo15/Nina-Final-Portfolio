(function () {
  // Inject cursor:none via JS — immune to linter stripping, won't trigger MutationObserver
  const cursorKill = document.createElement("style");
  cursorKill.textContent =
    "*, *::before, *::after, a, button, input, select, textarea, [href], [tabindex], [role='button'] { cursor: none !important; }";
  document.head.appendChild(cursorKill);

  const ZOOM = 2.5;
  const SIZE = 44;
  const R = SIZE / 2;

  const wrap = document.createElement("div");
  wrap.className = "magnifier-wrap";
  wrap.style.cssText =
    "display:none;position:fixed;pointer-events:none;z-index:99999;";

  const lens = document.createElement("div");
  lens.className = "magnifier-lens";

  const glare = document.createElement("div");
  glare.className = "magnifier-glare";

  const handle = document.createElement("div");
  handle.className = "magnifier-handle";

  const cloneRoot = document.createElement("div");
  cloneRoot.style.cssText =
    "position:absolute;transform-origin:0 0;pointer-events:none;overflow:visible;";

  lens.appendChild(cloneRoot);
  lens.appendChild(glare);
  wrap.appendChild(lens);
  wrap.appendChild(handle);
  document.body.appendChild(wrap);

  let hoverCSS = "";
  let fixedClones = []; // track cloned fixed elements to update on scroll

  function buildClone() {
    cloneRoot.innerHTML = "";
    fixedClones = [];
    cloneRoot.style.width = window.innerWidth + "px";
    cloneRoot.style.height =
      Math.max(document.body.scrollHeight, window.innerHeight) + "px";

    Array.from(document.body.children).forEach((child) => {
      if (child === wrap) return;
      const node = child.cloneNode(true);
      if (window.getComputedStyle(child).position === "fixed") {
        const r = child.getBoundingClientRect();
        node.style.position = "absolute";
        node.style.left = r.left + "px";
        node.style.width = r.width + "px";
        node.style.top = r.top + window.scrollY + "px";
        // Remember viewport top so we can keep it in sync on scroll
        fixedClones.push({ node, viewportTop: r.top });
      }
      cloneRoot.appendChild(node);
    });

    cloneRoot
      .querySelectorAll(".fade-up")
      .forEach((el) => el.classList.add("visible"));
    cloneRoot.querySelectorAll("script").forEach((el) => el.remove());

    if (!hoverCSS) {
      const extraCSS = [];
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          Array.from(sheet.cssRules).forEach((rule) => {
            if (rule.selectorText && rule.selectorText.includes(":hover")) {
              const sel = rule.selectorText.replace(/:hover/g, "._hovered");
              extraCSS.push(sel + "{" + rule.style.cssText + "}");
            }
          });
        } catch (_) {}
      });
      hoverCSS = extraCSS.join("\n");
      if (hoverCSS) {
        const s = document.createElement("style");
        s.textContent = hoverCSS;
        document.head.appendChild(s);
      }
    }
  }

  let rebuildTimer = null;
  function scheduleRebuild() {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(buildClone, 80);
  }

  window.addEventListener("load", () => {
    setTimeout(buildClone, 300);

    // Only watch class changes (expand/collapse) and DOM additions — NOT style
    // Watching style would fire on every cursor:none change and wipe hover state
    new MutationObserver((mutations) => {
      // Ignore mutations from inside the magnifier (e.g. _hovered class on clone)
      if (mutations.every((m) => wrap.contains(m.target))) return;
      scheduleRebuild();
    }).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  function getPath(el) {
    const path = [];
    while (el && el !== document.body && el.parentElement) {
      path.unshift(Array.from(el.parentElement.children).indexOf(el));
      el = el.parentElement;
    }
    return path;
  }

  function getCloneEl(path) {
    if (!path.length) return null;
    const wrapIdx = Array.from(document.body.children).indexOf(wrap);
    let rootIdx = path[0];
    if (wrapIdx !== -1 && rootIdx > wrapIdx) rootIdx--;
    let el = cloneRoot.children[rootIdx];
    for (let i = 1; i < path.length; i++) {
      if (!el || !el.children[path[i]]) return null;
      el = el.children[path[i]];
    }
    return el;
  }

  let lastHovered = [];
  let curMx = -1,
    curMy = -1;

  function updateLens(mx, my) {
    const docY = my + window.scrollY;
    cloneRoot.style.transform = "scale(" + ZOOM + ")";
    cloneRoot.style.left = R - ZOOM * mx + "px";
    cloneRoot.style.top = R - ZOOM * docY + "px";
    fixedClones.forEach(({ node, viewportTop }) => {
      node.style.top = viewportTop + window.scrollY + "px";
    });
  }

  document.addEventListener("mousemove", (e) => {
    curMx = e.clientX;
    curMy = e.clientY;

    wrap.style.display = "block";
    wrap.style.left = curMx + "px";
    wrap.style.top = curMy + "px";

    updateLens(curMx, curMy);

    lastHovered.forEach((el) => el.classList.remove("_hovered"));
    lastHovered = [];
    const hit = document.elementFromPoint(curMx, curMy);
    if (hit && !wrap.contains(hit)) {
      const path = getPath(hit);
      let cloneEl = getCloneEl(path);
      while (cloneEl && cloneEl !== cloneRoot) {
        cloneEl.classList.add("_hovered");
        lastHovered.push(cloneEl);
        cloneEl = cloneEl.parentElement;
      }
    }
  });

  window.addEventListener("scroll", () => {
    if (curMx >= 0) updateLens(curMx, curMy);
  });

  document.addEventListener("mouseleave", () => {
    wrap.style.display = "none";
  });
})();
