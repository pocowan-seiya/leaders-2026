// リーダーズスペースシップクラス —— 現れ方と、宇宙のヴェール
(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var skipAnimation = prefersReduced || window.location.search.indexOf("noanim") !== -1;

  // 比較用: ?line2 = PCの題字も2行に
  if (window.location.search.indexOf("line2") !== -1) document.querySelector(".ls").classList.add("ls-line2");
  // 比較用: ?fv0 = ファーストビューを前の背景(窓枠ごと見た地球)で
  if (window.location.search.indexOf("fv0") !== -1) document.querySelector(".ls").classList.add("ls-fv0");

  // 1. スクロールで静かに現れる(JS が動かなくても全文は読める)
  var targets = document.querySelectorAll(".ls-reveal");
  // ファーストビューの現れ方も止めて、最初から全部見せる
  if (skipAnimation) document.querySelector(".ls").classList.add("ls-still");
  if (skipAnimation || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    document.querySelector(".ls").classList.add("ls-js");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 2. 宇宙船のセクション: 進むほど紺が深まり、文字が立つ
  var ship = document.getElementById("ship");
  if (!ship) return;
  if (prefersReduced) {
    ship.style.setProperty("--space-dim", "0.55");
    return;
  }
  var raf = 0;
  function update() {
    raf = 0;
    var r = ship.getBoundingClientRect();
    var total = r.height + window.innerHeight;
    var passed = Math.min(Math.max(window.innerHeight - r.top, 0), total);
    var dim = 0.36 + (passed / total) * 0.3;
    ship.style.setProperty("--space-dim", dim.toFixed(3));
  }
  function onScroll() {
    if (!raf) raf = requestAnimationFrame(update);
  }
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
