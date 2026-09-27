let page = window.location.pathname.split("/").pop().replace(".html", "");
if (page === "" || page === "index") page = "about";

const _self = document.currentScript;
const _base = _self ? _self.src.replace(/components\.js$/, "") : "../../js/";
const rootPrefix = _base.replace(/js\/?$/, "");

async function loadPartial(placeholderId, file) {
  const res = await fetch(file);
  const html = await res.text();
  const placeholder = document.getElementById(placeholderId);
  placeholder.outerHTML = html;
}

Promise.all([
  loadPartial("nav-placeholder", rootPrefix + "html/partials/nav.html"),
  loadPartial("footer-placeholder", rootPrefix + "html/partials/footer.html"),
]).then(() => {
  document.querySelectorAll(".nav-tab").forEach((a) => {
    a.href = rootPrefix + a.getAttribute("href");
  });

  const tab = document.querySelector(`.tab-${page}`);
  if (tab) tab.classList.add("active");

  const nav = document.querySelector(".site-nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  const footer = document.querySelector(".site-footer");
  if (footer) {
    const playChat = setupFooterChat(footer);
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("footer-visible");
          playChat();
          footerObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }
});

// ── Footer phone chat: messages arrive one by one, with typing dots ──
function setupFooterChat(footer) {
  const chat = footer.querySelector(".device-chat");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!chat || reduceMotion) return () => {};

  const bubbles = [...chat.querySelectorAll(".chat-bubble")];
  const typing = chat.querySelector(".chat-typing");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Hide everything until the footer scrolls into view
  chat.classList.add("is-playing");

  const showTyping = (isMe) => {
    typing.classList.toggle("chat-typing--me", isMe);
    typing.classList.add("is-typing");
  };
  const hideTyping = () => typing.classList.remove("is-typing");

  const playOnce = async () => {
    for (const bubble of bubbles) {
      const isMe = bubble.classList.contains("chat-bubble--me");
      showTyping(isMe);
      await wait(isMe ? 1400 : 900);
      hideTyping();
      bubble.classList.add("is-shown");
      await wait(700);
    }
    // Visitor starts typing again, then the chat clears and replays
    showTyping(false);
    await wait(2500);
    chat.classList.add("is-clearing");
    await wait(450);
    hideTyping();
    bubbles.forEach((bubble) => bubble.classList.remove("is-shown"));
    chat.classList.remove("is-clearing");
  };

  return async () => {
    await wait(500);
    while (true) {
      await playOnce();
      await wait(600);
    }
  };
}

// ── Back to top ──
(function () {
  const style = document.createElement("style");
  style.textContent = `
    #back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: none;
      background: #642052;
      color: var(--text-light);
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transform: translateY(0.5rem);
      transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s ease;
      z-index: 600;
      box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.25);
    }
    #back-to-top.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    #back-to-top:hover {
      background: #7d2a68;
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="ri-arrow-up-line"></i>';
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true }
  );
})();
