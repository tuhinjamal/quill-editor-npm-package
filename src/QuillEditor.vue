<template>
  <div class="editor-container">
    <div ref="quillEditor" class="quill-editor" />
    <!-- Hover insert buttons -->
    <div v-show="showControls" ref="tableControls" class="table-controls">
      <!--
        <button @click.prevent="insertRowAbove">
        ➕ Row ↑
        </button>
        <button @click.prevent="insertRowBelow">
        ➕ Row ↓
        </button> 
      -->
      <button @click.prevent="insertColLeft">⬅ Col ➕ |</button>

      <button @click.prevent="insertColRight">➕ Col ➡</button>
    </div>
    <!-- Custom context menu -->
    <ul
      v-show="showContextMenu"
      ref="contextMenu"
      class="context-menu"
      :style="{
        top:
          screenType === 'mobile'
            ? contextMenuY - 80 + 'px'
            : screenType === 'tablet'
            ? contextMenuY - 150 + 'px'
            : screenType === 'laptop'
            ? contextMenuY - 500 + 'px'
            : contextMenuY - 400 + 'px',
        left:
          screenType === 'mobile'
            ? contextMenuX - 80 + 'px'
            : screenType === 'tablet'
            ? contextMenuX - 150 + 'px'
            : screenType === 'laptop'
            ? contextMenuX - 100 + 'px'
            : contextMenuX + 'px',
        position: 'fixed',
        zIndex: 9999,
      }"
    >
      <li class="cursor-pointer" @click.prevent="mergeCells">Merge Cells</li>
      <li class="cursor-pointer" @click.prevent="deleteRow">Delete Row</li>
      <li class="cursor-pointer" @click.prevent="deleteColumn">
        Delete Column
      </li>
      <li class="cursor-pointer" @click.prevent="clearCell">Clear Cell</li>
    </ul>
  </div>
</template>

<script setup>
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { onMounted, ref, onUnmounted } from "vue";

const props = defineProps(["modelValue", "Placeholder"]);

const emit = defineEmits(["update:modelValue"]);

// Setup
const screenType = ref("desktop");

const updateScreenType = () => {
  const width = window.innerWidth;

  if (width < 600) {
    screenType.value = "mobile";
  } else if (width >= 600 && width < 1024) {
    screenType.value = "tablet";
  } else if (width >= 1024 && width < 1440) {
    screenType.value = "laptop";
  } else {
    screenType.value = "desktop";
  }
};

onMounted(() => {
  updateScreenType();
  window.addEventListener("resize", updateScreenType);
});

const quillEditor = ref(null);
const tableControls = ref(null);
const contextMenu = ref(null);

let quill;
let initialColumns = 0;
let columnSetOnce = false;

const noOfColumn = ref(0);

const showControls = ref(false);
const selectedCell = ref(null);

const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);

// Example handler
onMounted(() => {
  quill = new Quill(quillEditor.value, {
    theme: "snow",
    placeholder: props.Placeholder,
    modules: {
      toolbar: [
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  });

  const toolbarContainer = quill.getModule("toolbar").container;
  const insertTableBtn = document.createElement("button");

  insertTableBtn.title = "Insert Table";
  insertTableBtn.innerHTML = "&#9016;";
  insertTableBtn.classList.add("ql-insertTable");

  insertTableBtn.onclick = (e) => {
    e.preventDefault();

    const savedRange = quill.getSelection(); // Save cursor position

    insertTable(0, noOfColumn, savedRange);
  };
  toolbarContainer.appendChild(insertTableBtn);

  // Additional buttons
  const deleteRowBtn = document.createElement("button");

  deleteRowBtn.title = "Delete Last Row";
  deleteRowBtn.innerHTML = "&#7035;";
  deleteRowBtn.onclick = (e) => {
    e.preventDefault();
    deleteLastRow();
  };
  toolbarContainer.appendChild(deleteRowBtn);

  const deleteColBtn = document.createElement("button");

  deleteColBtn.title = "Delete Last Column";
  deleteColBtn.innerHTML = "&#9030;";
  deleteColBtn.onclick = (e) => {
    e.preventDefault();
    deleteLastColumn();
  };
  toolbarContainer.appendChild(deleteColBtn);

  quill.root.innerHTML = props.modelValue || "";
  quill.on("text-change", () => {
    emit("update:modelValue", quill.root.innerHTML);
    styleTables();
  });

  // add button to toolbar merge cells button
  const mergeCellsBtn = document.createElement("button");

  mergeCellsBtn.title = "Merge Cells";
  mergeCellsBtn.innerHTML = "←→";
  mergeCellsBtn.onclick = (e) => {
    e.preventDefault();
    mergeCells();
  };
  toolbarContainer.appendChild(mergeCellsBtn);

  // add button to toolbar clear cell button
  const clearCellBtn = document.createElement("button");

  clearCellBtn.title = "Clear Cell";
  clearCellBtn.innerHTML = "X";
  clearCellBtn.onclick = (e) => {
    e.preventDefault();
    clearCell();
  };
  toolbarContainer.appendChild(clearCellBtn);

  // add button to toolbar insert column left button
  const insertColLeftBtn = document.createElement("button");

  insertColLeftBtn.title = "Insert Column Left";
  insertColLeftBtn.innerHTML = "←";
  insertColLeftBtn.onclick = (e) => {
    e.preventDefault();
    insertColLeft();
  };

  toolbarContainer.appendChild(insertColLeftBtn);

  // add button to toolbar insert column right button
  const insertColRightBtn = document.createElement("button");

  insertColRightBtn.title = "Insert Column Right";
  insertColRightBtn.innerHTML = "→";
  insertColRightBtn.onclick = (e) => {
    e.preventDefault();
    insertColRight();
  };
  toolbarContainer.appendChild(insertColRightBtn);

  // add button to toolbar delete row button
  // const deleteRowBtn2 = document.createElement("button")

  // deleteRowBtn2.title = "Delete Row"
  // deleteRowBtn2.innerHTML = "&#7035;"
  // deleteRowBtn2.onclick = e => {
  //   e.preventDefault()
  //   deleteRow()
  // }
  // toolbarContainer.appendChild(deleteRowBtn2)

  // add button to toolbar delete column button
  const deleteColBtn2 = document.createElement("button");

  deleteColBtn2.title = "Delete Column";
  deleteColBtn2.innerHTML = "&#1154;";
  deleteColBtn2.onclick = (e) => {
    e.preventDefault();
    deleteColumn();
  };
  toolbarContainer.appendChild(deleteColBtn2);

  // add button to toolbar delete table button
  const deleteTableBtn = document.createElement("button");

  deleteTableBtn.title = "Delete Table";
  deleteTableBtn.innerHTML = "🗑️";
  deleteTableBtn.onclick = (e) => {
    e.preventDefault();
    deleteTable();
  };
  toolbarContainer.appendChild(deleteTableBtn);

  quill.root.addEventListener("keydown", handleKeyPress);
  quill.root.addEventListener("click", handleCellHover);
  quill.root.addEventListener("contextmenu", handleContextMenu);

  styleTables();
});

// ---- Table Insert Logic ----

// const insertTable = async (noOfRows, noOfColumns, savedRange = null) => {
//   const columnsInitialValue =
//     typeof noOfColumns === "object" && "value" in noOfColumns
//       ? noOfColumns.value
//       : noOfColumns

//   const form = ref({ rows: 2, columns: columnsInitialValue || 2 })

//   try {
//     await ElMessageBox({
//       title: "Insert Table",
//       message: () =>
//         h("div", { style: "padding: 10px 0" }, [
//           h(
//             ElForm,
//             { labelPosition: "top", size: "small" },
//             () => [
//               h(ElFormItem, { label: "Rows" }, () =>
//                 h(ElInputNumber, {
//                   modelValue: form.value.rows,
//                   "onUpdate:modelValue": val => (form.value.rows = val),
//                   min: 1,
//                 }),
//               ),
//               h(ElFormItem, { label: "Columns" }, () =>
//                 h(ElInputNumber, {
//                   modelValue: form.value.columns,
//                   "onUpdate:modelValue": val => {
//                     form.value.columns = val
//                     if (!columnSetOnce) {
//                       initialColumns = val
//                       columnSetOnce = true
//                     }
//                   },
//                   min: 1,
//                 }),
//               ),
//             ],
//           ),
//         ]),
//       confirmButtonText: "Insert",
//       cancelButtonText: "Cancel",
//       beforeClose: (action, instance, done) => {
//         if (action === "confirm" && (!form.value.rows || !form.value.columns)) {
//           ElMessage.error("Please enter valid numbers.")

//           return
//         }
//         done()
//       },
//     })

//     const table = createTable(form.value.rows, form.value.columns)

//     // insertNodeAtCursor(table)
//     insertNodeAtCursor(table, savedRange)

//     styleTables()
//     noOfColumn.value = form.value.columns
//   } catch {}
// }
const createCustomTableModal = (defaultRows = 2, defaultCols = 2) => {
  return new Promise((resolve, reject) => {
    const overlay = document.createElement("div");

    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    `;

    const modal = document.createElement("div");

    modal.setAttribute("tabindex", "0"); // so it can receive keydown
    modal.style.cssText = `
      background: white;
      padding: 20px 20px 15px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 90vw;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
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
        <input type="number" id="table-rows" min="1" value="${defaultRows}" 
          style="margin-bottom: 10px; width: 100%; padding: 5px;">
      </label><br/>
      <label>Columns: 
        <input type="number" id="table-cols" min="1" value="${defaultCols}" 
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
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const removeModal = () => {
      document.body.removeChild(overlay);
      modal.removeEventListener("keydown", handleKeyDown);
    };

    const rejectModal = () => {
      removeModal();
      reject("Modal closed or cancelled.");
    };

    const confirmInsert = () => {
      const rows = parseInt(document.getElementById("table-rows").value, 10);
      const cols = parseInt(document.getElementById("table-cols").value, 10);

      if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert("Please enter valid numbers.");

        return;
      }

      removeModal();
      resolve({ rows, columns: cols });
    };

    // Bindings
    overlay.querySelector("#close-btn").onclick = rejectModal;
    overlay.querySelector("#cancel-btn").onclick = rejectModal;
    overlay.querySelector("#confirm-btn").onclick = confirmInsert;

    overlay.onclick = (e) => {
      if (e.target === overlay) rejectModal();
    };

    // Focus modal container
    setTimeout(() => modal.focus(), 0);

    // Only catch Enter when inside modal
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        confirmInsert();
      }
    };

    modal.addEventListener("keydown", handleKeyDown);
  });
};

const insertTable = async (noOfRows, noOfColumns, savedRange = null) => {
  const columnsInitialValue =
    typeof noOfColumns === "object" && "value" in noOfColumns
      ? noOfColumns.value
      : noOfColumns;

  try {
    const form = await createCustomTableModal(2, columnsInitialValue || 2);

    const table = createTable(form.rows, form.columns);

    insertNodeAtCursor(table, savedRange);

    styleTables();
    noOfColumn.value = form.columns;
  } catch (err) {
    console.log("Modal closed:", err);
  }
};

const createTable = (rows, cols) => {
  const table = document.createElement("table");

  table.setAttribute("class", "quill-table");
  table.setAttribute("border", "1");
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "5");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");

      td.innerHTML = "<br>"; // Use <br> instead of &nbsp; to maintain consistent height
      td.style.minWidth = "50px";
      td.style.border = "1px solid #ccc";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  return table;
};

const insertNodeAtCursor = (node, range) => {
  const temp = document.createElement("div");

  temp.appendChild(node);

  const html = temp.innerHTML;

  const index = range ? range.index : quill.getLength();

  quill.clipboard.dangerouslyPasteHTML(index, html);
};

const styleTables = () => {
  const tables = quillEditor.value.querySelectorAll("table");

  tables.forEach((table) => {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.margin = "10px 0";

    const cells = table.querySelectorAll("td, th");

    cells.forEach((cell) => {
      cell.style.border = "1px solid #aaa";
      cell.style.padding = "6px";
      cell.style.textAlign = "center";
      cell.style.position = "relative";
      cell.style.cursor = "text";
      enableResize(cell);
    });
  });
};

// ---- Resize Columns ----
function enableResize(cell) {
  const grip = document.createElement("div");

  grip.className = "resize-grip";
  cell.appendChild(grip);

  let startX, startWidth;

  grip.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    startX = e.clientX;
    startWidth = parseInt(
      document.defaultView.getComputedStyle(cell).width,
      10
    );
    document.documentElement.addEventListener("mousemove", doDrag);
    document.documentElement.addEventListener("mouseup", stopDrag);
  });

  function doDrag(e) {
    cell.style.width = `${startWidth + e.clientX - startX}px`;
  }

  function stopDrag() {
    document.documentElement.removeEventListener("mousemove", doDrag);
    document.documentElement.removeEventListener("mouseup", stopDrag);
  }
}

// --- Insert Buttons on Hover ---
function handleCellHover(e) {
  const cell = e.target.closest("td");
  if (cell) {
    selectedCell.value = cell;
    showControls.value = true;

    const rect = cell.getBoundingClientRect();
    const offset = 10;

    tableControls.value.style.top = `${rect.top + window.scrollY - offset}px`;
    tableControls.value.style.left = `${rect.left + window.scrollX + offset}px`;
  } else {
    showControls.value = false;
  }
}

// --- Insert Logic ---
const insertRowAbove = () => {
  const row = selectedCell.value?.parentElement;
  if (row) {
    const newRow = row.cloneNode(true);

    newRow.querySelectorAll("td").forEach((cell) => (cell.innerText = ""));
    row.parentElement.insertBefore(newRow, row);
  }
};

const insertRowBelow = () => {
  const row = selectedCell.value?.parentElement;
  if (row) {
    const newRow = row.cloneNode(true);

    newRow.querySelectorAll("td").forEach((cell) => (cell.innerText = ""));
    row.parentElement.insertBefore(newRow, row.nextSibling);
  }
};

const insertColLeft = () => {
  const colIndex = Array.from(selectedCell.value.parentNode.children).indexOf(
    selectedCell.value
  );
  const table = selectedCell.value.closest("table");

  table.querySelectorAll("tr").forEach((row) => {
    const cell = row.children[colIndex].cloneNode(true);

    cell.innerText = "";
    row.insertBefore(cell, row.children[colIndex]);
  });
};

const insertColRight = () => {
  const colIndex = Array.from(selectedCell.value.parentNode.children).indexOf(
    selectedCell.value
  );
  const table = selectedCell.value.closest("table");

  table.querySelectorAll("tr").forEach((row) => {
    const cell = row.children[colIndex].cloneNode(true);

    cell.innerText = "";
    row.insertBefore(cell, row.children[colIndex + 1]);
  });
};

// --- Context Menu Logic ---
function handleContextMenu(e) {
  const cell = e.target.closest("td, th");
  if (!cell) return;

  e.preventDefault();
  selectedCell.value = cell;
  showContextMenu.value = true;
  contextMenuX.value = e.pageX;
  contextMenuY.value = e.pageY;
}

const mergeCells = () => {
  const cell = selectedCell.value;
  const nextCell = cell.nextElementSibling;
  if (cell && nextCell) {
    cell.colSpan = (cell.colSpan || 1) + 1;
    cell.innerHTML += " " + nextCell.innerHTML;
    nextCell.remove();
  }
};

const deleteRow = () => {
  selectedCell.value?.parentElement?.remove();
};

const deleteColumn = () => {
  const colIndex = Array.from(selectedCell.value.parentNode.children).indexOf(
    selectedCell.value
  );
  const table = selectedCell.value.closest("table");

  table.querySelectorAll("tr").forEach((row) => row.deleteCell(colIndex));
};

const clearCell = () => {
  selectedCell.value.innerText = "";
};

// --- Default Delete Last Row/Col (from your logic) ---
function deleteLastRow() {
  const tables = quill.root.querySelectorAll("table");
  const table = tables[tables.length - 1];
  const rows = table.querySelectorAll("tr");
  if (rows.length > 1) table.deleteRow(rows.length - 1);
  else table.remove();
}

function deleteLastColumn() {
  const tables = quill.root.querySelectorAll("table");
  const table = tables[tables.length - 1];

  table.querySelectorAll("tr").forEach((row) => {
    const cells = row.querySelectorAll("td, th");
    if (cells.length > 0) row.deleteCell(cells.length - 1);
  });
}
function deleteTable() {
  const tables = quill.root.querySelectorAll("table");
  const table = tables[tables.length - 1];
  if (table) table.remove();
}
function deleteAllTables() {
  const tables = quill.root.querySelectorAll("table");

  tables.forEach((table) => table.remove());
}

const handleKeyPress = (e) => {
  if (!["Enter", "Tab"].includes(e.key)) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const container = range.startContainer;

  // Ensure we're working with an Element for .closest()
  const element =
    container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

  const currentCell = element?.closest("td");
  if (!currentCell) return;

  const currentRow = currentCell.parentElement;
  const table = currentRow?.closest("table");
  if (!table) return;

  const isLastRow = currentRow === table.querySelector("tr:last-child");
  const isLastCol = currentCell === currentRow.querySelector("td:last-child");

  if (isLastRow && isLastCol) {
    e.preventDefault();
    insertTable(1, noOfColumn);
  }
};

onMounted(() => {
  window.addEventListener("click", () => (showContextMenu.value = false));
});
onUnmounted(() => {
  window.removeEventListener("click", () => (showContextMenu.value = false));
});
</script>

<style scoped>
td:hover {
  outline: 2px solid #007bff;
}

.table-controls {
  position: absolute;
  z-index: 10;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 90%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 20%);
}

.editor-container {
  position: relative;
  inline-size: 100%;
}

.quill-editor {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  block-size: 400px;
}

.table-controls {
  position: absolute;
  z-index: 10;
  display: none;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 90%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 20%);
}

.context-menu {
  position: absolute;
  z-index: 1000;
  padding: 0;
  border: 1px solid #ccc;
  margin: 0;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 10%);
  font-size: 12px;
  inline-size: 160px;
  list-style: none;
}

.context-menu li {
  padding: 10px;
  cursor: pointer;
  text-align: start;
}

.context-menu li:hover {
  background-color: #f4f4f4;
}

.resize-grip {
  position: absolute;
  background: #888;
  block-size: 10px;
  cursor: se-resize;
  inline-size: 10px;
  inset-block-end: 2px;
  inset-inline-end: 2px;
}

button.ql-insertTable,
button.ql-deleteRow,
button.ql-deleteCol {
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  margin-inline-end: 5px;
  padding-block: 4px;
  padding-inline: 8px;
}

button.ql-insertTable {
  font-size: 18px;
  font-weight: bold;
}

button.ql-deleteRow {
  font-size: 16px;
}

button.ql-deleteCol {
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:focus {
  outline: none;
}

.ql-insertTable {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding-block: 0;
  padding-inline: 6px;
}

.editor-container {
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.editor-toolbar {
  padding: 8px;
  background-color: #f3f3f3;
  border-block-end: 1px solid #ccc;
}

.quill-editor {
  padding: 10px;
  min-block-size: 250px;
}

@media (min-width: 320px) {
  .quill-editor {
    block-size: 300px;
    inline-size: 70vw;
  }
}

@media (min-width: 375px) {
  .quill-editor {
    inline-size: 75vw;
  }
}

@media (min-width: 425px) {
  .quill-editor {
    inline-size: 80vw;
  }
}

@media (min-width: 430px) and (max-width: 500px) {
  .quill-editor {
    inline-size: 82vw;
  }
}

@media (min-width: 510px) and (max-width: 600px) {
  .quill-editor {
    inline-size: 85vw;
  }
}

@media (min-width: 610px) and (max-width: 768px) {
  .quill-editor {
    inline-size: 88vw;
  }
}

@media (min-width: 780px) and (max-width: 1022px) {
  .quill-editor {
    inline-size: 90vw;
  }
}

@media (min-width: 1024px) {
  .quill-editor {
    block-size: 100dvh;
    inline-size: 34.1vw;
  }
}

@media (min-width: 1920px) {
  .quill-editor {
    block-size: 100dvh !important;
    inline-size: 39vw !important;
  }
}
</style>
