<template>
  <span :class="chipClass">{{ label }}</span>
</template>

<script setup>
defineProps({
  chipClass: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>
