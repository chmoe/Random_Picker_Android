const Haptics = (() => {
    let moduleRef = null;

    function isCapacitorNative() {
        return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
    }

    async function loadModule() {
        if (!isCapacitorNative()) return null;
        if (moduleRef) return moduleRef;
        try {
            moduleRef = await import("@capacitor/haptics");
            return moduleRef;
        } catch {
            return null;
        }
    }

    async function pressStart() {
        const mod = await loadModule();
        if (mod?.Haptics) {
            await mod.Haptics.selectionStart();
            await mod.Haptics.selectionChanged();
            return;
        }
        if (navigator.vibrate) navigator.vibrate(8);
    }

    async function clickImpact(level = "medium") {
        const mod = await loadModule();
        if (mod?.Haptics && mod.ImpactStyle) {
            const style =
                level === "light" ? mod.ImpactStyle.Light :
                    level === "heavy" ? mod.ImpactStyle.Heavy :
                        mod.ImpactStyle.Medium;

            await mod.Haptics.impact({ style });
            return;
        }
        if (navigator.vibrate) navigator.vibrate(level === "heavy" ? 20 : 12);
    }

    async function success() {
        const mod = await loadModule();
        if (mod?.Haptics && mod.NotificationType) {
            await mod.Haptics.notification({ type: mod.NotificationType.Success });
            await mod.Haptics.selectionEnd();
            return;
        }
        if (navigator.vibrate) navigator.vibrate([12, 40, 18]);
    }

    async function warn() {
        const mod = await loadModule();
        if (mod?.Haptics && mod.NotificationType) {
            await mod.Haptics.notification({ type: mod.NotificationType.Warning });
            await mod.Haptics.selectionEnd();
            return;
        }
        if (navigator.vibrate) navigator.vibrate([18, 40, 18, 40, 12]);
    }

    return {
        pressStart,
        clickImpact,
        success,
        warn,
    };
})();

const Theme = (() => {
    const themes = [
        { bg: "#fffdf7", p1: "#ff9acb", p2: "#7fb4ff", p3: "#ffe27a" },
        { bg: "#fffefc", p1: "#ffb3d9", p2: "#8fd3ff", p3: "#fff1a8" },
        { bg: "#ffffff", p1: "#ff8fc2", p2: "#6ecbff", p3: "#ffed9e" },
        { bg: "#fefeff", p1: "#ffa8c6", p2: "#9aa7ff", p3: "#ffe58f" },
        { bg: "#fffdfa", p1: "#ff9fcf", p2: "#7ecbff", p3: "#fff3b0" },
    ];

    function applyRandomTheme() {
        const selected = themes[Math.floor(Math.random() * themes.length)];
        const root = document.documentElement;
        root.style.setProperty("--bg", selected.bg);
        root.style.setProperty("--p1", selected.p1);
        root.style.setProperty("--p2", selected.p2);
        root.style.setProperty("--p3", selected.p3);
    }

    return { applyRandomTheme };
})();

Theme.applyRandomTheme();

const Utils = (() => {
    function parseList(text) {
        return (text || "")
            .replace(/，/g, ",")
            .replace(/\n/g, ",")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
    }

    function clampInt(n, min, max) {
        const x = Number.isFinite(n) ? Math.floor(n) : min;
        return Math.min(Math.max(x, min), max);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function resetAnimation(el, className) {
        if (!el) return;
        el.classList.remove(className);
        void el.offsetWidth;
        el.classList.add(className);
    }

    async function copyText(text) {
        if (!text) return { success: false, mode: "empty" };
        try {
            await navigator.clipboard.writeText(text);
            return { success: true, mode: "native" };
        } catch {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            try {
                ta.focus();
                ta.select();
                const ok = document.execCommand("copy");
                return { success: ok, mode: ok ? "fallback" : "error" };
            } catch {
                return { success: false, mode: "error" };
            } finally {
                ta.remove();
            }
        }
    }

    return {
        parseList,
        clampInt,
        shuffle,
        resetAnimation,
        copyText,
    };
})();

const Toast = (() => {
    const host = document.getElementById("toastHost");
    let timer = null;

    function escapeHTML(str) {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function show(message, opts = {}) {
        const { type = "success", emoji = "✨", detail = "", duration = 1400 } = opts;
        if (!host) return;

        host.innerHTML = "";
        if (timer) clearTimeout(timer);

        const el = document.createElement("div");
        el.className = "toast";
        el.dataset.type = type;
        el.innerHTML = `
        <span class="emoji" aria-hidden="true">${emoji}</span>
        <div class="msg">
          ${escapeHTML(message)}
          ${detail ? `<span class="sub">${escapeHTML(detail)}</span>` : ""}
        </div>
      `;
        host.appendChild(el);

        requestAnimationFrame(() => el.classList.add("show"));

        timer = setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => {
                if (host.contains(el)) host.removeChild(el);
            }, 220);
        }, duration);
    }

    return { show };
})();

const Quotes = (() => {
    const quotes = [
        "今日も、きっといい日になる。",
        "小さな幸せ、見つけよう。",
        "無理しないで、ゆっくりでいい。",
        "だいじょうぶ、ちゃんと進んでる。",
        "ときめきを大切に。",
        "ふわっと、気楽にいこう。",
        "やさしい時間になりますように。",
        "今日は、ちょっと運がいいかも。",
        "選ぶのも、運命のうち。",
        "きらきら、忘れないで。",
    ];

    function getDailyJpQuote() {
        const now = new Date();
        const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
        }
        return quotes[hash % quotes.length];
    }

    return { getDailyJpQuote };
})();

const Viewport = (() => {
    const root = document.documentElement;

    function setDynamicVh() {
        const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
        root.style.setProperty("--vh", `${vh}px`);
    }

    function updateSafeInsets() {
        const vv = window.visualViewport;
        if (!vv) {
            root.style.setProperty("--safe-top", "0px");
            root.style.setProperty("--safe-bottom", "0px");
            return;
        }

        const safeTop = Math.max(0, vv.offsetTop);
        const safeBottom = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);

        root.style.setProperty("--safe-top", `${safeTop}px`);
        root.style.setProperty("--safe-bottom", `${safeBottom}px`);
    }

    function init() {
        const handleResize = () => {
            setDynamicVh();
            updateSafeInsets();
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", handleResize);
            window.visualViewport.addEventListener("scroll", updateSafeInsets);
        }
    }

    return { init };
})();

const Sparkles = (() => {
    let globalEnabled = false;

    function createSpark(className) {
        const spark = document.createElement("span");
        spark.className = className;
        document.body.appendChild(spark);
        spark.addEventListener("animationend", () => spark.remove(), { once: true });
        return spark;
    }

    function scatterFromButton(button) {
        if (!button) return;
        Utils.resetAnimation(button, "shine-run");
        const rect = button.getBoundingClientRect();
        const count = 6;

        for (let i = 0; i < count; i++) {
            const spark = createSpark("spark");
            const x = rect.left + rect.width * (0.2 + Math.random() * 0.6);
            const y = rect.top + rect.height * (0.25 + Math.random() * 0.5);
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;

            const dx = (Math.random() * 2 - 1) * 60;
            const dy = -(30 + Math.random() * 60);
            spark.style.setProperty("--dx", `${dx}px`);
            spark.style.setProperty("--dy", `${dy}px`);
            spark.style.animation = `floatSpark ${520 + Math.random() * 220}ms var(--ease-soft) ${Math.random() * 60}ms both`;
        }
    }

    function burstAroundElement(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const count = 10;

        for (let i = 0; i < count; i++) {
            const spark = createSpark("title-spark");
            const sx = cx + (Math.random() * 2 - 1) * 30;
            const sy = cy + (Math.random() * 2 - 1) * 10;
            spark.style.left = `${sx}px`;
            spark.style.top = `${sy}px`;

            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 70;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 30;

            spark.style.setProperty("--dx", `${dx}px`);
            spark.style.setProperty("--dy", `${dy}px`);
            spark.style.animationDelay = `${Math.random() * 90}ms`;
        }
    }

    function burstAtPoint(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const spark = createSpark("spark");
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;

            const dx = (Math.random() * 2 - 1) * 80;
            const dy = (Math.random() * 2 - 1) * 80;
            spark.style.setProperty("--dx", `${dx}px`);
            spark.style.setProperty("--dy", `${dy}px`);
            spark.style.animation = `floatSpark ${460 + Math.random() * 320}ms var(--ease-soft) ${Math.random() * 80}ms both`;
        }
    }

    function enableGlobalClicks() {
        if (globalEnabled) return;
        globalEnabled = true;
        document.addEventListener("click", (event) => {
            const x = event.clientX + window.scrollX;
            const y = event.clientY + window.scrollY;
            burstAtPoint(x, y, 7);
        }, { passive: true });
    }

    return {
        scatterFromButton,
        burstAroundElement,
        burstAtPoint,
        enableGlobalClicks,
    };
})();

const PickerApp = (() => {
    const elements = {
        inputCard: document.getElementById("inputCard"),
        btnToggleInput: document.getElementById("btnToggleInput"),
        inputBox: document.getElementById("inputBox"),
        pickCount: document.getElementById("pickCount"),
        btnPick: document.getElementById("btnPick"),
        btnCopy: document.getElementById("btnCopy"),
        resultCard: document.querySelector(".result"),
        resultValue: document.getElementById("resultValue"),
        resultMeta: document.getElementById("resultMeta"),
        cuteTitle: document.getElementById("cuteTitle"),
        titleSub: document.getElementById("titleSub"),
    };

    const state = {
        picked: [],
    };

    function setCollapsed(collapsed) {
        const { inputCard, btnToggleInput } = elements;
        if (!inputCard || !btnToggleInput) return;
        inputCard.classList.toggle("is-collapsed", collapsed);
        inputCard.setAttribute("aria-expanded", String(!collapsed));
        btnToggleInput.textContent = collapsed ? "展开" : "收起";
    }

    function expandInput() {
        setCollapsed(false);
    }

    function toggleInput() {
        if (!elements.inputCard) return;
        const collapsed = elements.inputCard.classList.contains("is-collapsed");
        setCollapsed(!collapsed);
        Toast.show(collapsed ? "已展开输入" : "已收起输入", {
            type: "success",
            emoji: collapsed ? "🫧" : "🧸",
        });
    }

    function triggerResultPop() {
        if (!elements.resultCard) return;
        Utils.resetAnimation(elements.resultCard, "pop");
    }

    function showCopyTick() {
        const el = document.createElement("div");
        el.className = "copy-tick show";
        el.innerHTML = "✅";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
    }

    function renderResult(list, total) {
        const { resultValue, resultMeta } = elements;
        if (!resultValue || !resultMeta) return;

        const MAX_SHOW = 8;
        const shown = list.slice(0, MAX_SHOW);
        const hidden = Math.max(0, list.length - shown.length);

        resultValue.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.className = "result-lines";

        shown.forEach((txt, idx) => {
            const line = document.createElement("div");
            line.className = "result-line";
            line.style.animationDelay = `${idx * 60}ms`;
            line.textContent = txt;
            wrapper.appendChild(line);
        });

        if (shown.length === 0) {
            const line = document.createElement("div");
            line.className = "result-line";
            line.textContent = "—";
            wrapper.appendChild(line);
        }

        resultValue.appendChild(wrapper);

        if (hidden > 0) {
            resultMeta.textContent = `已抽取 ${list.length} 个（共 ${total} 项），还有 ${hidden} 项未显示（复制可得完整）`;
        } else {
            resultMeta.textContent = `已抽取 ${list.length} 个（共 ${total} 项）`;
        }
    }

    function pickRandom() {
        if (!elements.inputBox || !elements.pickCount || !elements.btnCopy) return;
        const list = Utils.parseList(elements.inputBox.value);

        if (list.length === 0) {
            state.picked = [];
            renderResult([], 0);
            if (elements.resultMeta) {
                elements.resultMeta.textContent = "请先输入内容（用逗号隔开）";
            }
            elements.btnCopy.disabled = true;
            Toast.show("请先输入内容", {
                type: "warn",
                emoji: "🍋",
                detail: "用逗号隔开，例如：小明,小红,小蓝",
            });
            Haptics.warn();
            return;
        }

        const requested = Number(elements.pickCount.value);
        const clamped = Utils.clampInt(requested, 1, list.length);

        if (!Number.isFinite(requested) || requested <= 0) {
            elements.pickCount.value = "1";
            Toast.show("抽取数量不合法", {
                type: "warn",
                emoji: "🍯",
                detail: "已自动设置为 1",
            });
        } else if (requested > list.length) {
            elements.pickCount.value = String(list.length);
            Toast.show("抽取数量过大", {
                type: "warn",
                emoji: "🌼",
                detail: `已自动调整为最大值 ${list.length}`,
            });
        }

        const pool = Utils.shuffle([...list]);
        state.picked = pool.slice(0, clamped);

        renderResult(state.picked, list.length);
        elements.btnCopy.disabled = false;

        Sparkles.scatterFromButton(elements.btnPick);
        triggerResultPop();

        setCollapsed(true);
        Toast.show(`已抽取 ${state.picked.length} 个`, {
            type: "success",
            emoji: "🎀",
            detail: "输入区已自动收起",
        });
        Haptics.success();
    }

    async function copyResult() {
        if (!state.picked.length) {
            Toast.show("暂无可复制内容", { type: "warn", emoji: "🫧" });
            return;
        }

        const text = state.picked.join("\n");

        const { success, mode } = await Utils.copyText(text);
        if (!success) {
            Toast.show("复制失败", { type: "error", emoji: "🥲", detail: "当前环境不支持剪贴板权限" });
            return;
        }

        showCopyTick();
        const detail = mode === "fallback" ? "兼容模式复制" : "已复制完整结果";
        Toast.show("复制成功", { type: "success", emoji: "📋", detail });

        if (mode === "fallback") {
            await Haptics.clickImpact("light");
        }

        if (elements.resultMeta) {
            elements.resultMeta.textContent = "已复制完整结果到剪贴板 ✅";
        }
    }

    function bindTitleInteractions() {
        if (!elements.cuteTitle) return;

        const handler = () => {
            Sparkles.burstAroundElement(elements.cuteTitle);
            Toast.show("きらきら ✨", { type: "success", emoji: "💫", detail: "祝你今天也有小幸运" });
        };

        elements.cuteTitle.addEventListener("click", handler);
        elements.cuteTitle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handler();
            }
        });
    }

    function bindInputCardInteractions() {
        const { inputCard, inputBox, btnToggleInput } = elements;
        if (!inputCard || !inputBox || !btnToggleInput) return;

        inputCard.addEventListener("click", (e) => {
            const collapsed = inputCard.classList.contains("is-collapsed");
            if (!collapsed) return;
            if (e.target && e.target.id === "btnToggleInput") return;
            expandInput();
            Toast.show("已展开输入", { type: "success", emoji: "🫧", detail: "继续编辑后再抽取" });
        });

        inputBox.addEventListener("focus", () => {
            if (inputCard.classList.contains("is-collapsed")) {
                expandInput();
            }
        });

        btnToggleInput.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleInput();
        });
    }

    function bindControls() {
        const { pickCount, btnPick, btnCopy, inputBox } = elements;
        if (!btnPick || !btnCopy || !pickCount || !inputBox) return;

        pickCount.addEventListener("blur", () => {
            const list = Utils.parseList(inputBox.value);
            const max = Math.max(list.length, 1);
            pickCount.value = String(Utils.clampInt(Number(pickCount.value), 1, max));
        });

        btnPick.addEventListener("pointerdown", () => {
            Haptics.pressStart();
        });

        btnPick.addEventListener("click", async () => {
            await Haptics.clickImpact("medium");
            pickRandom();
        });

        btnCopy.addEventListener("click", copyResult);
    }

    function initDailyQuote() {
        if (elements.titleSub) {
            elements.titleSub.textContent = Quotes.getDailyJpQuote();
        }
    }

    function init() {
        if (!elements.inputCard || !elements.inputBox || !elements.btnPick || !elements.btnCopy) return;
        initDailyQuote();
        bindInputCardInteractions();
        bindControls();
        bindTitleInteractions();
        setCollapsed(false);
    }

    return { init };
})();

Viewport.init();
Sparkles.enableGlobalClicks();
PickerApp.init();
