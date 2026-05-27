<template>
  <div class="log-mode-toggle">
    <button
      type="button"
      class="mode-btn"
      :class="{ active: modelValue === 'summary' }"
      @click="$emit('update:modelValue', 'summary')">
      Summary
    </button>
    <button
      type="button"
      class="mode-btn"
      :class="{ active: modelValue === 'detail' }"
      @click="$emit('update:modelValue', 'detail')">
      Detail
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'summary',
  },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.log-mode-toggle {
  display: flex;
  gap: 4px;
  padding: 6px 8px 4px;
  flex-shrink: 0;
  background-color: var(--summary-toggle-bg, transparent);
  border-bottom: var(--summary-toggle-border-bottom, none);
}

.mode-btn {
  flex: 1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border: 1px solid var(--summary-toggle-btn-border, #bbb);
  border-radius: 3px;
  background-color: var(--summary-toggle-btn-bg, #fafafa);
  color: var(--summary-toggle-btn-color, #333);
  cursor: pointer;
  transition: background-color 0.1s;
}

.mode-btn:hover {
  background-color: var(--summary-toggle-btn-hover-bg, #eee);
}

.mode-btn.active {
  background-color: var(--summary-toggle-btn-active-bg, #444);
  color: var(--summary-toggle-btn-active-color, white);
  border-color: var(--summary-toggle-btn-active-border, #444);
}
</style>
