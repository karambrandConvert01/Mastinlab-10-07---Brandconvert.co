let urlToPreloads, mouseoverTimers, lastTouchTimestamps;
const prefetchers = document.createElement("link"),
    isSupporteds = prefetchers.relList && prefetchers.relList.supports && prefetchers.relList.supports("prefetch"),
    isDataSaverEnableds = navigator.connection && navigator.connection.saveData,
    allowQueryStrings = "instantAllowQueryString" in document.body.dataset,
    allowExternalLinkss = "instantAllowExternalLinks" in document.body.dataset;
if (isSupporteds && !isDataSaverEnableds) {
    prefetchers.rel = "prefetch", document.head.appendChild(prefetchers);
    const e = {
        capture: !0,
        passive: !0
    };
    document.addEventListener("touchstart", touchstartListener, e), document.addEventListener("mouseover", mouseoverListener, e)
}

function touchstartListener(e) {
    lastTouchTimestamps = performance.now();
    const t = e.target.closest("a");
    isPreloadable(t) && (t.addEventListener("touchcancel", touchendAndTouchcancelListener, {
        passive: !0
    }), t.addEventListener("touchend", touchendAndTouchcancelListener, {
        passive: !0
    }), urlToPreloads = t.href, preload(t.href))
}

function touchendAndTouchcancelListener() {
    urlToPreloads = void 0, stopPreloading()
}

function mouseoverListener(e) {
    if (performance.now() - lastTouchTimestamps < 1100) return;
    const t = e.target.closest("a");
    isPreloadable(t) && (t.addEventListener("mouseout", mouseoutListener, {
        passive: !0
    }), urlToPreloads = t.href, mouseoverTimers = setTimeout(() => {
        preload(t.href), mouseoverTimers = void 0
    }, 65))
}

function mouseoutListener(e) {
    e.relatedTarget && e.target.closest("a") == e.relatedTarget.closest("a") || (mouseoverTimers ? (clearTimeout(mouseoverTimers), mouseoverTimers = void 0) : (urlToPreloads = void 0, stopPreloading()))
}

function isPreloadable(e) {
    if (!e || !e.href) return;
    if (urlToPreloads == e.href) return;
    const t = new URL(e.href);
    return !(!(allowExternalLinkss || t.origin == location.origin || "instant" in e.dataset) || !["http:", "https:"].includes(t.protocol) || "http:" == t.protocol && "https:" == location.protocol || !(allowQueryStrings || !t.search || "instant" in e.dataset) || t.hash && t.pathname + t.search == location.pathname + location.search || "noInstant" in e.dataset) || void 0
}

function preload(e) {
    prefetchers.href = e
}

function stopPreloading() {
    prefetchers.removeAttribute("href")
}