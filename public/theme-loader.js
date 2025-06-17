(function () {
  try {
    const saved = localStorage.getItem("caelumTheme");
    const themes = ["dark", "iris", "matrix", "pepe"];
    const theme = themes.includes(saved) ? saved : "dark";

    document.documentElement.className = theme;

    // Wait for <body> to exist
    window.addEventListener("DOMContentLoaded", () => {
      const removeBadClasses = () => {
        for (const t of themes) {
          document.body.classList.remove(t);
        }
      };

      removeBadClasses();

      // 👁️ Observe future class changes and kill them instantly
      const observer = new MutationObserver(() => {
        removeBadClasses();
      });

      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    });
  } catch (e) {
    document.documentElement.className = "dark";
  }
})();
