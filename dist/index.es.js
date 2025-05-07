import { ref as u, onMounted as A, onUnmounted as J, createElementBlock as Z, openBlock as ee, createElementVNode as v, withDirectives as z, withModifiers as h, vShow as V, normalizeStyle as te } from "vue";
import ne from "quill";
const le = (f, E) => {
  const x = f.__vccOpts || f;
  for (const [w, p] of E)
    x[w] = p;
  return x;
}, oe = { class: "editor-container" }, re = {
  __name: "QuillEditor",
  props: ["modelValue", "Placeholder"],
  emits: ["update:modelValue"],
  setup(f, { emit: E }) {
    const x = f, w = E, p = u("desktop"), D = () => {
      const e = window.innerWidth;
      e < 600 ? p.value = "mobile" : e >= 600 && e < 1024 ? p.value = "tablet" : e >= 1024 && e < 1440 ? p.value = "laptop" : p.value = "desktop";
    };
    A(() => {
      D(), window.addEventListener("resize", D);
    });
    const k = u(null), L = u(null), X = u(null);
    let a;
    const T = u(0), M = u(!1), i = u(null), C = u(!1), q = u(0), g = u(0);
    A(() => {
      a = new ne(k.value, {
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
        const y = a.getSelection();
        H(0, T, y);
      }, e.appendChild(t);
      const n = document.createElement("button");
      n.title = "Delete Last Row", n.innerHTML = "&#7035;", n.onclick = (r) => {
        r.preventDefault(), K();
      }, e.appendChild(n);
      const l = document.createElement("button");
      l.title = "Delete Last Column", l.innerHTML = "&#9030;", l.onclick = (r) => {
        r.preventDefault(), F();
      }, e.appendChild(l), a.root.innerHTML = x.modelValue || "", a.on("text-change", () => {
        w("update:modelValue", a.root.innerHTML), S();
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
      const d = document.createElement("button");
      d.title = "Insert Column Right", d.innerHTML = "→", d.onclick = (r) => {
        r.preventDefault(), I();
      }, e.appendChild(d);
      const m = document.createElement("button");
      m.title = "Delete Column", m.innerHTML = "&#1154;", m.onclick = (r) => {
        r.preventDefault(), R();
      }, e.appendChild(m);
      const b = document.createElement("button");
      b.title = "Delete Table", b.innerHTML = "🗑️", b.onclick = (r) => {
        r.preventDefault(), U();
      }, e.appendChild(b), a.root.addEventListener("keydown", G), a.root.addEventListener("click", O), a.root.addEventListener("contextmenu", W), S();
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
      }, d = () => {
        s(), l("Modal closed or cancelled.");
      }, m = () => {
        const r = parseInt(document.getElementById("table-rows").value, 10), y = parseInt(document.getElementById("table-cols").value, 10);
        if (isNaN(r) || isNaN(y) || r <= 0 || y <= 0) {
          alert("Please enter valid numbers.");
          return;
        }
        s(), n({ rows: r, columns: y });
      };
      o.querySelector("#close-btn").onclick = d, o.querySelector("#cancel-btn").onclick = d, o.querySelector("#confirm-btn").onclick = m, o.onclick = (r) => {
        r.target === o && d();
      }, setTimeout(() => c.focus(), 0);
      const b = (r) => {
        r.key === "Enter" && (r.preventDefault(), m());
      };
      c.addEventListener("keydown", b);
    }), H = async (e, t, n = null) => {
      const l = typeof t == "object" && "value" in t ? t.value : t;
      try {
        const o = await P(2, l || 2), c = Q(o.rows, o.columns);
        $(c, n), S(), T.value = o.columns;
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
    }, S = () => {
      k.value.querySelectorAll("table").forEach((t) => {
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
        i.value = t, M.value = !0;
        const n = t.getBoundingClientRect(), l = 10;
        L.value.style.top = `${n.top + window.scrollY - l}px`, L.value.style.left = `${n.left + window.scrollX + l}px`;
      } else
        M.value = !1;
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
      t && (e.preventDefault(), i.value = t, C.value = !0, q.value = e.pageX, g.value = e.pageY);
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
      const s = c.parentElement, d = s == null ? void 0 : s.closest("table");
      if (!d) return;
      const m = s === d.querySelector("tr:last-child"), b = c === s.querySelector("td:last-child");
      m && b && (e.preventDefault(), H(1, T));
    };
    return A(() => {
      window.addEventListener("click", () => C.value = !1);
    }), J(() => {
      window.removeEventListener("click", () => C.value = !1);
    }), (e, t) => (ee(), Z("div", oe, [
      v("div", {
        ref_key: "quillEditor",
        ref: k,
        class: "quill-editor"
      }, null, 512),
      z(v("div", {
        ref_key: "tableControls",
        ref: L,
        class: "table-controls"
      }, [
        v("button", {
          onClick: h(_, ["prevent"])
        }, "⬅ Col ➕ |"),
        v("button", {
          onClick: h(I, ["prevent"])
        }, "➕ Col ➡")
      ], 512), [
        [V, M.value]
      ]),
      z(v("ul", {
        ref_key: "contextMenu",
        ref: X,
        class: "context-menu",
        style: te([{
          top: (p.value === "mobile" || p.value === "tablet" || p.value === "laptop", g.value + 20 + "px"),
          left: q.value + "px",
          position: "fixed",
          zIndex: 9999
        }, { "background-color": "white", "border-radius": "8px", "box-shadow": "0 5px 15px rgba(0, 0, 0, 0.3)", "list-style": "none", "list-style-type": "none", "text-align": "left", padding: "5px", cursor: "pointer" }])
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
        [V, C.value]
      ])
    ]));
  }
}, ce = /* @__PURE__ */ le(re, [["__scopeId", "data-v-9f1d6f7b"]]), ie = {
  install(f) {
    f.component("QuillEditor", ce);
  }
};
export {
  ce as QuillEditor,
  ie as default
};
