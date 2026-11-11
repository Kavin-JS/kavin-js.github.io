(() => {
  const shelf = document.querySelector(".shelf");
  if (!shelf || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const books = [...shelf.querySelectorAll(".book")];
  let raf = 0, nx = 0, ny = 0;
  const apply = () => { raf = 0; books.forEach((b, i) => { const d = i === 1 ? 1 : .6; b.style.setProperty("--px", (nx * d).toFixed(3)); b.style.setProperty("--py", (ny * d).toFixed(3)); }); };
  shelf.addEventListener("pointermove", e => {
    const r = shelf.getBoundingClientRect();
    nx = (e.clientX - r.left) / r.width - .5; ny = (e.clientY - r.top) / r.height - .5;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
  shelf.addEventListener("pointerleave", () => { nx = ny = 0; apply(); });
})();
