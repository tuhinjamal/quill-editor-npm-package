import { ref as p, onMounted as D, createElementBlock as J, openBlock as Z, createElementVNode as v, withDirectives as z, withModifiers as h, vShow as V, normalizeStyle as ee } from "vue";
import te from "quill";
const ne = (f, w) => {
  const x = f.__vccOpts || f;
  for (const [k, d] of w)
    x[k] = d;
  return x;
}, le = { class: "editor-container" }, oe = {
  __name: "QuillEditor",
  props: ["modelValue", "Placeholder"],
  emits: ["update:modelValue"],
  setup(f, { emit: w }) {
    const x = f, k = w, d = p("desktop"), q = () => {
      const e = window.innerWidth;
      e < 600 ? d.value = "mobile" : e >= 600 && e < 1024 ? d.value = "tablet" : e >= 1024 && e < 1440 ? d.value = "laptop" : d.value = "desktop";
    };
    D(() => {
      q(), window.addEventListener("resize", q);
    });
    const L = p(null), T = p(null), X = p(null);
    let a;
    const M = p(0), S = p(!1), i = p(null), E = p(!1), g = p(0), y = p(0);
    D(() => {
      a = new te(L.value, {
        theme: "snow",
        placeholder: x.Placeholder,
        modules: {
          toolbar: [
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ header: [1, 2, 3, 4, 5, 6, !1] }],
            [{ align: [] }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" }
            ],
            ["link", "image", "video"],
            ["clean"]
          ]
        }
      });
      const e = a.getModule("toolbar").container, t = document.createElement("button");
      t.title = "Insert Table", t.innerHTML = "&#9016;", t.classList.add("ql-insertTable"), t.onclick = (r) => {
        r.preventDefault();
        const C = a.getSelection();
        H(0, M, C);
      }, e.appendChild(t);
      const n = document.createElement("button");
      n.title = "Delete Last Row", n.innerHTML = "&#7035;", n.onclick = (r) => {
        r.preventDefault(), K();
      }, e.appendChild(n);
      const l = document.createElement("button");
      l.title = "Delete Last Column", l.innerHTML = "&#9030;", l.onclick = (r) => {
        r.preventDefault(), F();
      }, e.appendChild(l), a.root.innerHTML = x.modelValue || "", a.on("text-change", () => {
        k("update:modelValue", a.root.innerHTML), A();
      });
      const o = document.createElement("button");
      o.title = "Merge Cells", o.innerHTML = "←→", o.onclick = (r) => {
        r.preventDefault(), B();
      }, e.appendChild(o);
      const c = document.createElement("button");
      c.title = "Clear Cell", c.innerHTML = "X", c.onclick = (r) => {
        r.preventDefault(), N();
      }, e.appendChild(c);
      const s = document.createElement("button");
      s.title = "Insert Column Left", s.innerHTML = "←", s.onclick = (r) => {
        r.preventDefault(), _();
      }, e.appendChild(s);
      const u = document.createElement("button");
      u.title = "Insert Column Right", u.innerHTML = "→", u.onclick = (r) => {
        r.preventDefault(), I();
      }, e.appendChild(u);
      const m = document.createElement("button");
      m.title = "Delete Column", m.innerHTML = "&#1154;", m.onclick = (r) => {
        r.preventDefault(), R();
      }, e.appendChild(m);
      const b = document.createElement("button");
      b.title = "Delete Table", b.innerHTML = "🗑️", b.onclick = (r) => {
        r.preventDefault(), U();
      }, e.appendChild(b), a.root.addEventListener("keydown", G), a.root.addEventListener("click", O), a.root.addEventListener("contextmenu", W), A();
    });
    const P = (e = 2, t = 2) => new Promise((n, l) => {
      const o = document.createElement("div");
      o.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    `;
      const c = document.createElement("div");
      c.setAttribute("tabindex", "0"), c.style.cssText = `
      background: white;
      padding: 20px 20px 15px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 90vw;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `, c.innerHTML = `
      <button id="close-btn" style="
        position: absolute;
        top: 8px;
        right: 8px;
        border: none;
        background: none;
        font-size: 18px;
        cursor: pointer;
      ">&times;</button>

      <h3 style="margin-bottom: 10px;">Insert Table</h3>
      <label>Rows: 
        <input type="number" id="table-rows" min="1" value="${e}" 
          style="margin-bottom: 10px; width: 100%; padding: 5px;">
      </label><br/>
      <label>Columns: 
        <input type="number" id="table-cols" min="1" value="${t}" 
          style="margin-bottom: 10px; width: 100%; padding: 5px;">
      </label><br/>
      <div style="text-align: right; margin-top: 10px;">
        <button id="cancel-btn" style="
          margin-right: 10px;
          background-color: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        ">Cancel</button>
        <button id="confirm-btn" style="
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        ">Insert</button>
      </div>
    `, o.appendChild(c), document.body.appendChild(o);
      const s = () => {
        document.body.removeChild(o), c.removeEventListener("keydown", b);
      }, u = () => {
        s(), l("Modal closed or cancelled.");
      }, m = () => {
        const r = parseInt(document.getElementById("table-rows").value, 10), C = parseInt(document.getElementById("table-cols").value, 10);
        if (isNaN(r) || isNaN(C) || r <= 0 || C <= 0) {
          alert("Please enter valid numbers.");
          return;
        }
        s(), n({ rows: r, columns: C });
      };
      o.querySelector("#close-btn").onclick = u, o.querySelector("#cancel-btn").onclick = u, o.querySelector("#confirm-btn").onclick = m, o.onclick = (r) => {
        r.target === o && u();
      }, setTimeout(() => c.focus(), 0);
      const b = (r) => {
        r.key === "Enter" && (r.preventDefault(), m());
      };
      c.addEventListener("keydown", b);
    }), H = async (e, t, n = null) => {
      const l = typeof t == "object" && "value" in t ? t.value : t;
      try {
        const o = await P(2, l || 2), c = Q(o.rows, o.columns);
        $(c, n), A(), M.value = o.columns;
      } catch (o) {
        console.log("Modal closed:", o);
      }
    }, Q = (e, t) => {
      const n = document.createElement("table");
      n.setAttribute("class", "quill-table"), n.setAttribute("border", "1"), n.setAttribute("cellspacing", "0"), n.setAttribute("cellpadding", "5"), n.style.width = "100%", n.style.borderCollapse = "collapse";
      for (let l = 0; l < e; l++) {
        const o = document.createElement("tr");
        for (let c = 0; c < t; c++) {
          const s = document.createElement("td");
          s.innerHTML = "<br>", s.style.minWidth = "50px", s.style.border = "1px solid #ccc", o.appendChild(s);
        }
        n.appendChild(o);
      }
      return n;
    }, $ = (e, t) => {
      const n = document.createElement("div");
      n.appendChild(e);
      const l = n.innerHTML, o = t ? t.index : a.getLength();
      a.clipboard.dangerouslyPasteHTML(o, l);
    }, A = () => {
      L.value.querySelectorAll("table").forEach((t) => {
        t.style.width = "100%", t.style.borderCollapse = "collapse", t.style.margin = "10px 0", t.querySelectorAll("td, th").forEach((l) => {
          l.style.border = "1px solid #aaa", l.style.padding = "6px", l.style.textAlign = "center", l.style.position = "relative", l.style.cursor = "text", j(l);
        });
      });
    };
    function j(e) {
      const t = document.createElement("div");
      t.className = "resize-grip", e.appendChild(t);
      let n, l;
      t.addEventListener("mousedown", (s) => {
        s.stopPropagation(), n = s.clientX, l = parseInt(
          document.defaultView.getComputedStyle(e).width,
          10
        ), document.documentElement.addEventListener("mousemove", o), document.documentElement.addEventListener("mouseup", c);
      });
      function o(s) {
        e.style.width = `${l + s.clientX - n}px`;
      }
      function c() {
        document.documentElement.removeEventListener("mousemove", o), document.documentElement.removeEventListener("mouseup", c);
      }
    }
    function O(e) {
      const t = e.target.closest("td");
      if (t) {
        i.value = t, S.value = !0;
        const n = t.getBoundingClientRect(), l = 10;
        T.value.style.top = `${n.top + window.scrollY - l}px`, T.value.style.left = `${n.left + window.scrollX + l}px`;
      } else
        S.value = !1;
    }
    const _ = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((n) => {
        const l = n.children[e].cloneNode(!0);
        l.innerText = "", n.insertBefore(l, n.children[e]);
      });
    }, I = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((n) => {
        const l = n.children[e].cloneNode(!0);
        l.innerText = "", n.insertBefore(l, n.children[e + 1]);
      });
    };
    function W(e) {
      const t = e.target.closest("td, th");
      t && (e.preventDefault(), i.value = t, E.value = !0, g.value = e.pageX, y.value = e.pageY);
    }
    const B = () => {
      const e = i.value, t = e.nextElementSibling;
      e && t && (e.colSpan = (e.colSpan || 1) + 1, e.innerHTML += " " + t.innerHTML, t.remove());
    }, Y = () => {
      var e, t;
      (t = (e = i.value) == null ? void 0 : e.parentElement) == null || t.remove();
    }, R = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((n) => n.deleteCell(e));
    }, N = () => {
      i.value.innerText = "";
    };
    function K() {
      const e = a.root.querySelectorAll("table"), t = e[e.length - 1], n = t.querySelectorAll("tr");
      n.length > 1 ? t.deleteRow(n.length - 1) : t.remove();
    }
    function F() {
      const e = a.root.querySelectorAll("table");
      e[e.length - 1].querySelectorAll("tr").forEach((n) => {
        const l = n.querySelectorAll("td, th");
        l.length > 0 && n.deleteCell(l.length - 1);
      });
    }
    function U() {
      const e = a.root.querySelectorAll("table"), t = e[e.length - 1];
      t && t.remove();
    }
    const G = (e) => {
      if (!["Enter", "Tab"].includes(e.key)) return;
      const t = window.getSelection();
      if (!t || t.rangeCount === 0) return;
      const l = t.getRangeAt(0).startContainer, o = l.nodeType === Node.TEXT_NODE ? l.parentElement : l, c = o == null ? void 0 : o.closest("td");
      if (!c) return;
      const s = c.parentElement, u = s == null ? void 0 : s.closest("table");
      if (!u) return;
      const m = s === u.querySelector("tr:last-child"), b = c === s.querySelector("td:last-child");
      m && b && (e.preventDefault(), H(1, M));
    };
    return D(() => {
      window.addEventListener("click", () => E.value = !1);
    }), onUnmounted(() => {
      window.removeEventListener("click", () => E.value = !1);
    }), (e, t) => (Z(), J("div", le, [
      v("div", {
        ref_key: "quillEditor",
        ref: L,
        class: "quill-editor"
      }, null, 512),
      z(v("div", {
        ref_key: "tableControls",
        ref: T,
        class: "table-controls"
      }, [
        v("button", {
          onClick: h(_, ["prevent"])
        }, "⬅ Col ➕ |"),
        v("button", {
          onClick: h(I, ["prevent"])
        }, "➕ Col ➡")
      ], 512), [
        [V, S.value]
      ]),
      z(v("ul", {
        ref_key: "contextMenu",
        ref: X,
        class: "context-menu",
        style: ee({
          top: d.value === "mobile" ? y.value - 80 + "px" : d.value === "tablet" ? y.value - 150 + "px" : d.value === "laptop" ? y.value - 500 + "px" : y.value - 400 + "px",
          left: d.value === "mobile" ? g.value - 80 + "px" : d.value === "tablet" ? g.value - 150 + "px" : d.value === "laptop" ? g.value - 100 + "px" : g.value + "px",
          position: "fixed",
          zIndex: 9999
        })
      }, [
        v("li", {
          class: "cursor-pointer",
          onClick: h(B, ["prevent"])
        }, "Merge Cells"),
        v("li", {
          class: "cursor-pointer",
          onClick: h(Y, ["prevent"])
        }, "Delete Row"),
        v("li", {
          class: "cursor-pointer",
          onClick: h(R, ["prevent"])
        }, " Delete Column "),
        v("li", {
          class: "cursor-pointer",
          onClick: h(N, ["prevent"])
        }, "Clear Cell")
      ], 4), [
        [V, E.value]
      ])
    ]));
  }
}, re = /* @__PURE__ */ ne(oe, [["__scopeId", "data-v-3f2a8068"]]), ae = {
  install(f) {
    f.component("QuillEditor", re);
  }
};
export {
  re as QuillEditor,
  ae as default
};
