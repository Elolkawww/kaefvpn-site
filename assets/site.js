// Small progressive enhancements; the page works without them.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // header background once the page is scrolled
  const top = document.getElementById("top");
  const onScroll = () => top && top.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal blocks as they enter the viewport
  const items = document.querySelectorAll(".rv");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  // light that follows the cursor on cards
  document.querySelectorAll(".card").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // the leaf leans towards the cursor
  const stage = document.getElementById("stage");
  const leaf = document.getElementById("leaf");
  if (stage && leaf && !reduce && matchMedia("(pointer: fine)").matches) {
    addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      leaf.style.transform = `translate(${x * 24}px, ${y * 24}px) rotate(${x * 6}deg)`;
    }, { passive: true });
  }

  // only one FAQ answer open at a time
  const faq = document.querySelectorAll(".faq details");
  faq.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) faq.forEach((o) => o !== d && (o.open = false));
  }));
})();
