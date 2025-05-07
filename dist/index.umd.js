(function(p,l){typeof exports=="object"&&typeof module<"u"?l(exports,require("vue"),require("quill")):typeof define=="function"&&define.amd?define(["exports","vue","quill"],l):(p=typeof globalThis<"u"?globalThis:p||self,l(p.Vue3QuillEditor={},p.Vue,p.Quill))})(this,function(p,l,B){"use strict";const R=(h,C)=>{const v=h.__vccOpts||h;for(const[E,m]of C)v[E]=m;return v},z={class:"editor-container"},S=R({__name:"QuillEditor",props:["modelValue","Placeholder"],emits:["update:modelValue"],setup(h,{emit:C}){const v=h,E=C,m=l.ref("desktop"),q=()=>{const e=window.innerWidth;e<600?m.value="mobile":e>=600&&e<1024?m.value="tablet":e>=1024&&e<1440?m.value="laptop":m.value="desktop"};l.onMounted(()=>{q(),window.addEventListener("resize",q)});const w=l.ref(null),k=l.ref(null),X=l.ref(null);let a;const T=l.ref(0),M=l.ref(!1),d=l.ref(null),g=l.ref(!1),D=l.ref(0),x=l.ref(0);l.onMounted(()=>{a=new B(w.value,{theme:"snow",placeholder:v.Placeholder,modules:{toolbar:[[{size:[]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"sub"},{script:"super"}],[{header:[1,2,3,4,5,6,!1]}],[{align:[]}],[{list:"ordered"},{list:"bullet"},{indent:"-1"},{indent:"+1"}],["link","image","video"],["clean"]]}});const e=a.getModule("toolbar").container,t=document.createElement("button");t.title="Insert Table",t.innerHTML="&#9016;",t.classList.add("ql-insertTable"),t.onclick=i=>{i.preventDefault();const y=a.getSelection();A(0,T,y)},e.appendChild(t);const n=document.createElement("button");n.title="Delete Last Row",n.innerHTML="&#7035;",n.onclick=i=>{i.preventDefault(),F()},e.appendChild(n);const o=document.createElement("button");o.title="Delete Last Column",o.innerHTML="&#9030;",o.onclick=i=>{i.preventDefault(),U()},e.appendChild(o),a.root.innerHTML=v.modelValue||"",a.on("text-change",()=>{E("update:modelValue",a.root.innerHTML),L()});const r=document.createElement("button");r.title="Merge Cells",r.innerHTML="←→",r.onclick=i=>{i.preventDefault(),H()},e.appendChild(r);const c=document.createElement("button");c.title="Clear Cell",c.innerHTML="X",c.onclick=i=>{i.preventDefault(),I()},e.appendChild(c);const s=document.createElement("button");s.title="Insert Column Left",s.innerHTML="←",s.onclick=i=>{i.preventDefault(),N()},e.appendChild(s);const u=document.createElement("button");u.title="Insert Column Right",u.innerHTML="→",u.onclick=i=>{i.preventDefault(),_()},e.appendChild(u);const b=document.createElement("button");b.title="Delete Column",b.innerHTML="&#1154;",b.onclick=i=>{i.preventDefault(),V()},e.appendChild(b);const f=document.createElement("button");f.title="Delete Table",f.innerHTML="🗑️",f.onclick=i=>{i.preventDefault(),G()},e.appendChild(f),a.root.addEventListener("keydown",J),a.root.addEventListener("click",W),a.root.addEventListener("contextmenu",Y),L()});const Q=(e=2,t=2)=>new Promise((n,o)=>{const r=document.createElement("div");r.style.cssText=`
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    `;const c=document.createElement("div");c.setAttribute("tabindex","0"),c.style.cssText=`
      background: white;
      padding: 20px 20px 15px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 90vw;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `,c.innerHTML=`
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
    `,r.appendChild(c),document.body.appendChild(r);const s=()=>{document.body.removeChild(r),c.removeEventListener("keydown",f)},u=()=>{s(),o("Modal closed or cancelled.")},b=()=>{const i=parseInt(document.getElementById("table-rows").value,10),y=parseInt(document.getElementById("table-cols").value,10);if(isNaN(i)||isNaN(y)||i<=0||y<=0){alert("Please enter valid numbers.");return}s(),n({rows:i,columns:y})};r.querySelector("#close-btn").onclick=u,r.querySelector("#cancel-btn").onclick=u,r.querySelector("#confirm-btn").onclick=b,r.onclick=i=>{i.target===r&&u()},setTimeout(()=>c.focus(),0);const f=i=>{i.key==="Enter"&&(i.preventDefault(),b())};c.addEventListener("keydown",f)}),A=async(e,t,n=null)=>{const o=typeof t=="object"&&"value"in t?t.value:t;try{const r=await Q(2,o||2),c=j(r.rows,r.columns);O(c,n),L(),T.value=r.columns}catch(r){console.log("Modal closed:",r)}},j=(e,t)=>{const n=document.createElement("table");n.setAttribute("class","quill-table"),n.setAttribute("border","1"),n.setAttribute("cellspacing","0"),n.setAttribute("cellpadding","5"),n.style.width="100%",n.style.borderCollapse="collapse";for(let o=0;o<e;o++){const r=document.createElement("tr");for(let c=0;c<t;c++){const s=document.createElement("td");s.innerHTML="<br>",s.style.minWidth="50px",s.style.border="1px solid #ccc",r.appendChild(s)}n.appendChild(r)}return n},O=(e,t)=>{const n=document.createElement("div");n.appendChild(e);const o=n.innerHTML,r=t?t.index:a.getLength();a.clipboard.dangerouslyPasteHTML(r,o)},L=()=>{w.value.querySelectorAll("table").forEach(t=>{t.style.width="100%",t.style.borderCollapse="collapse",t.style.margin="10px 0",t.querySelectorAll("td, th").forEach(o=>{o.style.border="1px solid #aaa",o.style.padding="6px",o.style.textAlign="center",o.style.position="relative",o.style.cursor="text",$(o)})})};function $(e){const t=document.createElement("div");t.className="resize-grip",e.appendChild(t);let n,o;t.addEventListener("mousedown",s=>{s.stopPropagation(),n=s.clientX,o=parseInt(document.defaultView.getComputedStyle(e).width,10),document.documentElement.addEventListener("mousemove",r),document.documentElement.addEventListener("mouseup",c)});function r(s){e.style.width=`${o+s.clientX-n}px`}function c(){document.documentElement.removeEventListener("mousemove",r),document.documentElement.removeEventListener("mouseup",c)}}function W(e){const t=e.target.closest("td");if(t){d.value=t,M.value=!0;const n=t.getBoundingClientRect(),o=10;k.value.style.top=`${n.top+window.scrollY-o}px`,k.value.style.left=`${n.left+window.scrollX+o}px`}else M.value=!1}const N=()=>{const e=Array.from(d.value.parentNode.children).indexOf(d.value);d.value.closest("table").querySelectorAll("tr").forEach(n=>{const o=n.children[e].cloneNode(!0);o.innerText="",n.insertBefore(o,n.children[e])})},_=()=>{const e=Array.from(d.value.parentNode.children).indexOf(d.value);d.value.closest("table").querySelectorAll("tr").forEach(n=>{const o=n.children[e].cloneNode(!0);o.innerText="",n.insertBefore(o,n.children[e+1])})};function Y(e){const t=e.target.closest("td, th");t&&(e.preventDefault(),d.value=t,g.value=!0,D.value=e.pageX,x.value=e.pageY)}const H=()=>{const e=d.value,t=e.nextElementSibling;e&&t&&(e.colSpan=(e.colSpan||1)+1,e.innerHTML+=" "+t.innerHTML,t.remove())},K=()=>{var e,t;(t=(e=d.value)==null?void 0:e.parentElement)==null||t.remove()},V=()=>{const e=Array.from(d.value.parentNode.children).indexOf(d.value);d.value.closest("table").querySelectorAll("tr").forEach(n=>n.deleteCell(e))},I=()=>{d.value.innerText=""};function F(){const e=a.root.querySelectorAll("table"),t=e[e.length-1],n=t.querySelectorAll("tr");n.length>1?t.deleteRow(n.length-1):t.remove()}function U(){const e=a.root.querySelectorAll("table");e[e.length-1].querySelectorAll("tr").forEach(n=>{const o=n.querySelectorAll("td, th");o.length>0&&n.deleteCell(o.length-1)})}function G(){const e=a.root.querySelectorAll("table"),t=e[e.length-1];t&&t.remove()}const J=e=>{if(!["Enter","Tab"].includes(e.key))return;const t=window.getSelection();if(!t||t.rangeCount===0)return;const o=t.getRangeAt(0).startContainer,r=o.nodeType===Node.TEXT_NODE?o.parentElement:o,c=r==null?void 0:r.closest("td");if(!c)return;const s=c.parentElement,u=s==null?void 0:s.closest("table");if(!u)return;const b=s===u.querySelector("tr:last-child"),f=c===s.querySelector("td:last-child");b&&f&&(e.preventDefault(),A(1,T))};return l.onMounted(()=>{window.addEventListener("click",()=>g.value=!1)}),l.onUnmounted(()=>{window.removeEventListener("click",()=>g.value=!1)}),(e,t)=>(l.openBlock(),l.createElementBlock("div",z,[l.createElementVNode("div",{ref_key:"quillEditor",ref:w,class:"quill-editor"},null,512),l.withDirectives(l.createElementVNode("div",{ref_key:"tableControls",ref:k,class:"table-controls"},[l.createElementVNode("button",{onClick:l.withModifiers(N,["prevent"])},"⬅ Col ➕ |"),l.createElementVNode("button",{onClick:l.withModifiers(_,["prevent"])},"➕ Col ➡")],512),[[l.vShow,M.value]]),l.withDirectives(l.createElementVNode("ul",{ref_key:"contextMenu",ref:X,class:"context-menu",style:l.normalizeStyle([{top:(m.value==="mobile"||m.value==="tablet"||m.value==="laptop",x.value+20+"px"),left:D.value+"px",position:"fixed",zIndex:9999},{"background-color":"white","border-radius":"8px","box-shadow":"0 5px 15px rgba(0, 0, 0, 0.3)","list-style":"none","list-style-type":"none","text-align":"left",padding:"5px",cursor:"pointer"}])},[l.createElementVNode("li",{class:"cursor-pointer",onClick:l.withModifiers(H,["prevent"])},"Merge Cells"),l.createElementVNode("li",{class:"cursor-pointer",onClick:l.withModifiers(K,["prevent"])},"Delete Row"),l.createElementVNode("li",{class:"cursor-pointer",onClick:l.withModifiers(V,["prevent"])}," Delete Column "),l.createElementVNode("li",{class:"cursor-pointer",onClick:l.withModifiers(I,["prevent"])},"Clear Cell")],4),[[l.vShow,g.value]])]))}},[["__scopeId","data-v-9f1d6f7b"]]),P={install(h){h.component("QuillEditor",S)}};p.QuillEditor=S,p.default=P,Object.defineProperties(p,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
