import { ref as u, onMounted as I, h as b, onUnmounted as ee, createElementBlock as te, openBlock as le, createElementVNode as d, withDirectives as V, withModifiers as h, vShow as N, normalizeStyle as ne } from "vue";
import { ElMessageBox as oe, ElMessage as re, ElForm as se, ElFormItem as X, ElInputNumber as P } from "element-plus";
import ce from "quill";
const ae = (v, y) => {
  const C = v.__vccOpts || v;
  for (const [x, E] of y)
    C[x] = E;
  return C;
}, ie = { class: "editor-container" }, ue = {
  __name: "QuillEditor",
  props: ["modelValue", "Placeholder"],
  emits: ["update:modelValue"],
  setup(v, { emit: y }) {
    const C = v, x = y, E = u(null), L = u(null), z = u(null);
    let a, O = 0, M = !1;
    const T = u(0), w = u(!1), i = u(null), g = u(!1), S = u(0), A = u(0);
    I(() => {
      a = new ce(E.value, {
        theme: "snow",
        placeholder: C.Placeholder,
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
      t.title = "Insert Table", t.innerHTML = "&#9016;", t.classList.add("ql-insertTable"), t.onclick = (s) => {
        s.preventDefault();
        const Z = a.getSelection();
        D(0, T, Z);
      }, e.appendChild(t);
      const l = document.createElement("button");
      l.title = "Delete Last Row", l.innerHTML = "&#7035;", l.onclick = (s) => {
        s.preventDefault(), W();
      }, e.appendChild(l);
      const n = document.createElement("button");
      n.title = "Delete Last Column", n.innerHTML = "&#9030;", n.onclick = (s) => {
        s.preventDefault(), K();
      }, e.appendChild(n), a.root.innerHTML = C.modelValue || "", a.on("text-change", () => {
        x("update:modelValue", a.root.innerHTML), k();
      });
      const r = document.createElement("button");
      r.title = "Merge Cells", r.innerHTML = "←→", r.onclick = (s) => {
        s.preventDefault(), B();
      }, e.appendChild(r);
      const c = document.createElement("button");
      c.title = "Clear Cell", c.innerHTML = "X", c.onclick = (s) => {
        s.preventDefault(), R();
      }, e.appendChild(c);
      const o = document.createElement("button");
      o.title = "Insert Column Left", o.innerHTML = "←", o.onclick = (s) => {
        s.preventDefault(), q();
      }, e.appendChild(o);
      const m = document.createElement("button");
      m.title = "Insert Column Right", m.innerHTML = "→", m.onclick = (s) => {
        s.preventDefault(), _();
      }, e.appendChild(m);
      const p = document.createElement("button");
      p.title = "Delete Column", p.innerHTML = "&#1154;", p.onclick = (s) => {
        s.preventDefault(), H();
      }, e.appendChild(p);
      const f = document.createElement("button");
      f.title = "Delete Table", f.innerHTML = "🗑️", f.onclick = (s) => {
        s.preventDefault(), G();
      }, e.appendChild(f), a.root.addEventListener("keydown", J), a.root.addEventListener("click", $), a.root.addEventListener("contextmenu", j), k();
    });
    const D = async (e, t, l = null) => {
      const n = typeof t == "object" && "value" in t ? t.value : t, r = u({ rows: 2, columns: n || 2 });
      try {
        await oe({
          title: "Insert Table",
          message: () => b("div", { style: "padding: 10px 0" }, [
            b(se, { labelPosition: "top", size: "small" }, () => [
              b(
                X,
                { label: "Rows" },
                () => b(P, {
                  modelValue: r.value.rows,
                  "onUpdate:modelValue": (o) => r.value.rows = o,
                  min: 1
                })
              ),
              b(
                X,
                { label: "Columns" },
                () => b(P, {
                  modelValue: r.value.columns,
                  "onUpdate:modelValue": (o) => {
                    r.value.columns = o, M || (O = o, M = !0);
                  },
                  min: 1
                })
              )
            ])
          ]),
          confirmButtonText: "Insert",
          cancelButtonText: "Cancel",
          beforeClose: (o, m, p) => {
            if (o === "confirm" && (!r.value.rows || !r.value.columns)) {
              re.error("Please enter valid numbers.");
              return;
            }
            p();
          }
        });
        const c = Q(r.value.rows, r.value.columns);
        U(c, l), k(), T.value = r.value.columns;
      } catch {
      }
    }, Q = (e, t) => {
      const l = document.createElement("table");
      l.setAttribute("class", "quill-table"), l.setAttribute("border", "1"), l.setAttribute("cellspacing", "0"), l.setAttribute("cellpadding", "5"), l.style.width = "100%", l.style.borderCollapse = "collapse";
      for (let n = 0; n < e; n++) {
        const r = document.createElement("tr");
        for (let c = 0; c < t; c++) {
          const o = document.createElement("td");
          o.innerHTML = "<br>", o.style.minWidth = "50px", o.style.border = "1px solid #ccc", r.appendChild(o);
        }
        l.appendChild(r);
      }
      return l;
    }, U = (e, t) => {
      const l = document.createElement("div");
      l.appendChild(e);
      const n = l.innerHTML, r = t ? t.index : a.getLength();
      a.clipboard.dangerouslyPasteHTML(r, n);
    }, k = () => {
      E.value.querySelectorAll("table").forEach((t) => {
        t.style.width = "100%", t.style.borderCollapse = "collapse", t.style.margin = "10px 0", t.querySelectorAll("td, th").forEach((n) => {
          n.style.border = "1px solid #aaa", n.style.padding = "6px", n.style.textAlign = "center", n.style.position = "relative", n.style.cursor = "text", Y(n);
        });
      });
    };
    function Y(e) {
      const t = document.createElement("div");
      t.className = "resize-grip", e.appendChild(t);
      let l, n;
      t.addEventListener("mousedown", (o) => {
        o.stopPropagation(), l = o.clientX, n = parseInt(
          document.defaultView.getComputedStyle(e).width,
          10
        ), document.documentElement.addEventListener("mousemove", r), document.documentElement.addEventListener("mouseup", c);
      });
      function r(o) {
        e.style.width = `${n + o.clientX - l}px`;
      }
      function c() {
        document.documentElement.removeEventListener("mousemove", r), document.documentElement.removeEventListener("mouseup", c);
      }
    }
    function $(e) {
      const t = e.target.closest("td");
      if (t) {
        i.value = t, w.value = !0;
        const l = t.getBoundingClientRect(), n = 10;
        L.value.style.top = `${l.top + window.scrollY - n}px`, L.value.style.left = `${l.left + window.scrollX + n}px`;
      } else
        w.value = !1;
    }
    const q = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((l) => {
        const n = l.children[e].cloneNode(!0);
        n.innerText = "", l.insertBefore(n, l.children[e]);
      });
    }, _ = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((l) => {
        const n = l.children[e].cloneNode(!0);
        n.innerText = "", l.insertBefore(n, l.children[e + 1]);
      });
    };
    function j(e) {
      const t = e.target.closest("td");
      t && (e.preventDefault(), i.value = t, g.value = !0, S.value = e.pageX, A.value = e.pageY);
    }
    const B = () => {
      const e = i.value, t = e.nextElementSibling;
      e && t && (e.colSpan = (e.colSpan || 1) + 1, e.innerHTML += " " + t.innerHTML, t.remove());
    }, F = () => {
      var e, t;
      (t = (e = i.value) == null ? void 0 : e.parentElement) == null || t.remove();
    }, H = () => {
      const e = Array.from(i.value.parentNode.children).indexOf(
        i.value
      );
      i.value.closest("table").querySelectorAll("tr").forEach((l) => l.deleteCell(e));
    }, R = () => {
      i.value.innerText = "";
    };
    function W() {
      const e = a.root.querySelectorAll("table"), t = e[e.length - 1], l = t.querySelectorAll("tr");
      l.length > 1 ? t.deleteRow(l.length - 1) : t.remove();
    }
    function K() {
      const e = a.root.querySelectorAll("table");
      e[e.length - 1].querySelectorAll("tr").forEach((l) => {
        const n = l.querySelectorAll("td, th");
        n.length > 0 && l.deleteCell(n.length - 1);
      });
    }
    function G() {
      const e = a.root.querySelectorAll("table"), t = e[e.length - 1];
      t && t.remove();
    }
    const J = (e) => {
      if (!["Enter", "Tab"].includes(e.key)) return;
      const t = window.getSelection();
      if (!t || t.rangeCount === 0) return;
      const n = t.getRangeAt(0).startContainer, r = n.nodeType === Node.TEXT_NODE ? n.parentElement : n, c = r == null ? void 0 : r.closest("td");
      if (!c) return;
      const o = c.parentElement, m = o == null ? void 0 : o.closest("table");
      if (!m) return;
      const p = o === m.querySelector("tr:last-child"), f = c === o.querySelector("td:last-child");
      p && f && (e.preventDefault(), D(1, T));
    };
    return I(() => {
      window.addEventListener("click", () => g.value = !1);
    }), ee(() => {
      window.removeEventListener("click", () => g.value = !1);
    }), (e, t) => (le(), te("div", ie, [
      d("div", {
        ref_key: "quillEditor",
        ref: E,
        class: "quill-editor"
      }, null, 512),
      V(d("div", {
        ref_key: "tableControls",
        ref: L,
        class: "table-controls"
      }, [
        d("button", {
          onClick: h(q, ["prevent"])
        }, "⬅ Col ➕ |"),
        d("button", {
          onClick: h(_, ["prevent"])
        }, "➕ Col ➡")
      ], 512), [
        [N, w.value]
      ]),
      V(d("ul", {
        ref_key: "contextMenu",
        ref: z,
        class: "context-menu",
        style: ne({
          top: A.value - 400 + "px",
          left: S.value - 400 + "px",
          position: "absolute"
        })
      }, [
        d("li", {
          class: "cursor-pointer",
          onClick: h(B, ["prevent"])
        }, "Merge Cells"),
        d("li", {
          class: "cursor-pointer",
          onClick: h(F, ["prevent"])
        }, "Delete Row"),
        d("li", {
          class: "cursor-pointer",
          onClick: h(H, ["prevent"])
        }, " Delete Column "),
        d("li", {
          class: "cursor-pointer",
          onClick: h(R, ["prevent"])
        }, "Clear Cell")
      ], 4), [
        [N, g.value]
      ])
    ]));
  }
}, de = /* @__PURE__ */ ae(ue, [["__scopeId", "data-v-b580d7e2"]]), fe = {
  install(v) {
    v.component("QuillEditor", de);
  }
};
export {
  de as QuillEditor,
  fe as default
};
