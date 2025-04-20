<!-- src/QuillEditor.vue -->
<template>
  <div :class="['quill-wrapper', customClass]">
    <div ref="editorRef"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Ensure style bundling works

const props = defineProps({
  modelValue: String,
  contentType: { type: String, default: "html" },
  theme: { type: String, default: "snow" },
  toolbar: { type: [String, Array, Object], default: "full" },
  customClass: String,
  textChange: Function,
  Placeholder: String,
});

const emit = defineEmits(["update:modelValue"]);
const editorRef = ref(null);
let quill = null;

onMounted(() => {
  const modules = {
    toolbar:
      props.toolbar === "full"
        ? [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "code-block"],
            [{ header: [1, 2, 3, false] }],
            [{ align: [] }],
            ["clean"],
          ]
        : props.toolbar,
  };

  quill = new Quill(editorRef.value, {
    theme: props.theme,
    placeholder: props.Placeholder,
    modules,
  });

  quill.on("text-change", () => {
    const value =
      props.contentType === "html"
        ? editorRef.value.querySelector(".ql-editor").innerHTML
        : quill.getText();
    emit("update:modelValue", value);
    props.textChange?.(value);
  });

  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (quill && newVal !== quill.root.innerHTML) {
      quill.root.innerHTML = newVal;
    }
  }
);
</script>

<style scoped>
.quill-wrapper {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
}
</style>
