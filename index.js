// index.js
import QuillEditor from "./src/QuillEditor.vue";
import "quill/dist/quill.snow.css";

const Vue3QuillEditor = {
  install(app) {
    app.component("QuillEditor", QuillEditor);
  },
};

export default Vue3QuillEditor;
export { QuillEditor };
