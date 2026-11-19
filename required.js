(() => {
    const KEY = "resign-docs-v1";
    const docs = [...document.querySelectorAll(".doc")];
    const list = document.getElementById("docs");
    const status = document.getElementById("status");
    const pct = document.getElementById("pct");
    const ring = document.querySelector(".ring");
    const ringFg = document.getElementById("ringFg");
    const empty = document.getElementById("empty");
    const chips = [...document.querySelectorAll(".chip")];

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

    const save = () => {
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ }
    };

    function render() {
        const total = docs.length;
        const done = docs.filter(d => d.classList.contains("is-done")).length;
        const value = Math.round((done / total) * 100);

        status.textContent = done === total
            ? "All documents collected. You’re ready to go."
            : `${done} of ${total} collected`;
        pct.textContent = value + "%";
        ringFg.style.strokeDashoffset = 100 - value;
        ring.classList.toggle("is-complete", done === total);

        const filter = list.dataset.filter;
        const visible = docs.filter(d =>
            filter === "all" ||
            (filter === "done" && d.classList.contains("is-done")) ||
            (filter === "pending" && !d.classList.contains("is-done"))
        ).length;
        empty.hidden = visible > 0;
    }

    docs.forEach(doc => {
        const input = doc.querySelector("input");
        const toggle = doc.querySelector(".toggle");
        const id = doc.dataset.id;

        input.checked = !!saved[id];
        doc.classList.toggle("is-done", input.checked);

        input.addEventListener("change", () => {
            doc.classList.toggle("is-done", input.checked);
            if (input.checked) saved[id] = true; else delete saved[id];
            save();
            render();
        });

        toggle.addEventListener("click", () => {
            const open = doc.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open);
            toggle.setAttribute("aria-label", open ? "Hide details" : "Show details");
        });
    });

    chips.forEach(chip => chip.addEventListener("click", () => {
        list.dataset.filter = chip.dataset.filter;
        chips.forEach(c => {
            const on = c === chip;
            c.classList.toggle("is-active", on);
            c.setAttribute("aria-pressed", on);
        });
        render();
    }));

    document.getElementById("reset").addEventListener("click", () => {
        saved = {};
        save();
        docs.forEach(d => {
            d.querySelector("input").checked = false;
            d.classList.remove("is-done");
        });
        render();
    });

    render();
})();