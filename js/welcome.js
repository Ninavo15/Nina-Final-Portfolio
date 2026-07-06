const originalColors = {
  about: "#f0b8d0",
  extra: "#445881",
  work: "#6491b1",
  resume: "#764969",
};
const navOrder = { about: 0, extra: 1, work: 2, resume: 3 };
const pageURLs = {
  about: "../main-page/about.html",
  extra: "../main-page/extra.html",
  work:  "../main-page/work.html",
  resume:"../main-page/resume.html",
};

// ── Reveal content ──
const welcomeContent = document.getElementById("welcome-content");
welcomeContent.classList.add("visible");

// ── Folder navigation ──
document.querySelectorAll(".folder").forEach((folder) => {
  folder.addEventListener("click", () => goToPage(folder.dataset.page));
});

function goToPage(targetPage) {
  const folders = [...document.querySelectorAll(".folder")];
  const tabs    = [...document.querySelectorAll(".folder-tab")];
  const notepad = document.querySelector(".notepad");


  // Snap folders + notepad to their settled state before measuring
  folders.forEach((f) => {
    f.style.animation = "none";
    f.style.opacity   = "1";
    f.style.transform = "none";
  });
  notepad.style.animation = "none";
  notepad.style.opacity   = "1";
  void document.body.offsetWidth;

  // Measure where each tab actually sits on screen right now
  const rects = tabs.map((t) => t.getBoundingClientRect());

  const targetTop = 35;
  const tabW = 195;
  const gap  = 8;
  const padL = 32;

  // Build ghost elements that look exactly like the tabs at their current positions.
  // Using ghosts avoids every CSS-inheritance and stacking-context issue with the
  // original absolute-positioned tabs.
  const ghosts = tabs.map((tab, i) => {
    const r    = rects[i];
    const page = tab.dataset.page;
    const g    = document.createElement("div");
    g.textContent = tab.textContent.trim();
    Object.assign(g.style, {
      position:      "fixed",
      top:           r.top  + "px",
      left:          r.left + "px",
      width:         "195px",
      height:        "55px",
      background:    originalColors[page],
      borderRadius:  "29px 29px 0 0",
      zIndex:        "300",
      fontFamily:    '"Newsreader", serif',
      fontSize:      "32px",
      fontWeight:    "400",
      color:         "#fcfff1",
      display:       "inline-flex",
      alignItems:    "flex-end",
      justifyContent:"center",
      paddingBottom: "2px",
      pointerEvents: "none",
      transition:    "none",
    });
    document.body.appendChild(g);
    tab.style.visibility = "hidden";
    return g;
  });

  // Fade notepad and folder bodies
  Object.assign(notepad.style, {
    transition:    "opacity 0.3s ease",
    opacity:       "0",
    pointerEvents: "none",
  });
  folders.forEach((f) =>
    Object.assign(f.style, {
      transition: "opacity 0.4s ease",
      opacity: "0",
    }),
  );

  void ghosts[0].offsetWidth;

  // Phase 1: shoot up with expo ease-out (snappy lift, gentle arrival)
  ghosts.forEach((g) => {
    g.style.transition = "top 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    g.style.top        = targetTop + "px";
  });

  // Phase 2: slide into nav positions — starts at 220ms so it overlaps with
  // the tail of phase 1, giving a continuous arc feel instead of two hard steps
  setTimeout(() => {
    ghosts.forEach((g, i) => {
      const pos = navOrder[tabs[i].dataset.page];
      g.style.transition = "left 0.35s cubic-bezier(0.65, 0, 0.35, 1)";
      g.style.left       = padL + pos * (tabW + gap) + "px";
    });

    // Fade in the page-body area so it's already visible before navigation
    const pageBody = document.createElement("div");
    Object.assign(pageBody.style, {
      position:   "fixed",
      top:        "90px",
      left:       "0",
      right:      "0",
      bottom:     "0",
      background: "#f6f1ed",
      zIndex:     "200",
      opacity:    "0",
      transition: "opacity 0.35s ease",
    });
    document.body.appendChild(pageBody);
    void pageBody.offsetWidth;
    pageBody.style.opacity = "1";
  }, 220);

  setTimeout(() => {
    window.location.href = pageURLs[targetPage];
  }, 650);
}
