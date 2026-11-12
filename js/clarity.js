/* Microsoft Clarity (project zci4k2zra6). Loaded after page load so it doesn't affect PageSpeed. */
(function (c, l, a, r, i) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  function load() {
    var t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    var y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  }
  function idle() { ("requestIdleCallback" in c) ? c.requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500); }
  if (l.readyState === "complete") idle(); else c.addEventListener("load", idle);
})(window, document, "clarity", "script", "zci4k2zra6");
