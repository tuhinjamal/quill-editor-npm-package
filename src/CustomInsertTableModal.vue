<template>
  <div v-if="visible" class="custom-modal-backdrop">
    <div class="custom-modal">
      <h3>Insert Table</h3>
      <form @submit.prevent="confirm">
        <label>
          Rows:
          <input type="number" v-model.number="rows" min="1" required />
        </label>
        <label>
          Columns:
          <input type="number" v-model.number="columns" min="1" required />
        </label>
        <div class="buttons">
          <button type="submit">Insert</button>
          <button type="button" @click="$emit('cancel')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const visible = ref(props.modelValue);
const rows = ref(1);
const columns = ref(1);

watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);
watch(visible, (val) => emit("update:modelValue", val));

function confirm() {
  if (rows.value && columns.value) {
    emit("confirm", { rows: rows.value, columns: columns.value });
    visible.value = false;
  }
}
</script>

<style scoped>
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
}
.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
