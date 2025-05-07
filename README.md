Here's a **README.md** template for your `@tuhinjamal/vue3-quill-editor` package. You can customize it further based on your preferences or specific features. This template covers basic installation, usage, features, and configuration.

---

# Vue 3 Quill Editor

A powerful and customizable Quill editor component for Vue 3. It provides table management features (like inserting and deleting rows/columns), context menus, and other enhancements to the Quill text editor.

## Features

- **Table Management**: Insert rows, columns, merge cells, delete rows/columns.
- **Context Menu**: Right-click context menu for additional table operations.
- **Customizable Toolbar**: Add your own toolbar buttons.
- **Responsive Design**: Automatically adjusts the editor size based on the screen size (mobile, tablet, desktop).
- **Easy Integration**: Simple to install and use in any Vue 3 project.

## Installation

You can install the `vue3-quill-editor` package from npm.

```bash
npm install @tuhinjamal/vue3-quill-editor
```

## Usage

1. **Import and Register the Component:**

   In your `main.js` or `main.ts` file, import the editor and use it as a plugin.

   ```javascript
   import { createApp } from "vue";
   import App from "./App.vue";
   import Vue3QuillEditor from "@tuhinjamal/vue3-quill-editor";

   const app = createApp(App);
   app.use(Vue3QuillEditor);
   app.mount("#app");
   ```

2. **Using the Quill Editor in Your Components:**

   Now, you can use the `QuillEditor` component in your Vue components.

   ```html
   <template>
     <div>
       <QuillEditor v-model="content" placeholder="Type here..." />
     </div>
   </template>

   <script>
     export default {
       data() {
         return {
           content: "",
         };
       },
     };
   </script>
   ```

   - **`v-model`**: Binds the editor content to a data variable.
   - **`placeholder`**: A customizable placeholder for the editor.

## Props

- **`modelValue`**: The value of the editor (bind it with `v-model`).
- **`Placeholder`**: The placeholder text that will appear when the editor is empty.

## Methods & Features

### Table Management

- **Insert Table**: Use the toolbar to insert a table with a custom number of rows and columns.
- **Insert Row Above / Below**: Use buttons to insert a row above or below the selected row.
- **Insert Column Left / Right**: Use buttons to insert a column on the left or right of the selected column.
- **Delete Row / Column**: Use the context menu or toolbar to delete the selected row or column.
- **Merge Cells**: Merge two adjacent cells together using the context menu.
- **Clear Cell**: Clear the content of a selected cell.

### Custom Context Menu

- Right-click to bring up a context menu with options like:

  - Merge Cells
  - Delete Row
  - Delete Column
  - Clear Cell

### Responsive Design

The editor automatically adjusts its size based on the screen width. It works well on:

- **Mobile**: Automatically resizes to fit smaller screens.
- **Tablet**: Adjusts to fit mid-sized screens.
- **Laptop/Desktops**: Ensures the editor looks great on larger screens.

### Customizable Toolbar

Add custom toolbar buttons such as:

- Insert Table
- Insert Row/Column
- Merge Cells
- Clear Cell
- Delete Row/Column

## Events

- **`update:modelValue`**: Emits the content of the editor when it changes. This is how you bind the editor to a variable using `v-model`.

## Example

Here’s an example where you use the Quill editor inside a component and bind it to a `content` variable:

```html
<template>
  <div>
    <QuillEditor v-model="content" placeholder="Start typing..." />
    <p>Content:</p>
    <pre>{{ content }}</pre>
  </div>
</template>

<script>
  import { ref } from "vue";
  import QuillEditor from "@tuhinjamal/vue3-quill-editor";

  export default {
    components: {
      QuillEditor,
    },
    setup() {
      const content = ref("");
      return { content };
    },
  };
</script>
```

## Customization

You can customize the Quill editor by modifying the `modules` configuration when initializing Quill, adding or removing toolbar options, or using custom toolbar buttons.

### Example of Customizing the Toolbar:

```javascript
const quill = new Quill(quillEditor.value, {
  theme: "snow",
  placeholder: "Your custom placeholder...",
  modules: {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      ["clean"],
    ],
  },
});
```

## License

MIT License. See the [LICENSE](LICENSE) file for details.

---

This **README.md** provides a comprehensive overview of how to use your `vue3-quill-editor` package. You can further extend this with more examples, customization details, and feature explanations as needed.

Let me know if you'd like further customization or need additional sections in the README!
