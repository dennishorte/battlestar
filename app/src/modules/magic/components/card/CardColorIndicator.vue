<template>
  <div class="frame-color-indicator" @click="emit('show-color-picker')">

    <!-- ms-2x makes it easier for users to click when editing -->
    <i
      v-if="props.card.hasColorIndicator(props.index)"
      class="ms ms-ci"
      :class="[
        ...props.card.colorIndicatorClasses(props.index),
        props.isEditable ? 'ms-2x' : '',
      ]"
    />

    <!--
         If there is no color indicator, show a generic all-color indicator when editing
         so users can click on it to open the color picker.
    -->
    <i v-else-if="props.isEditable" class="ms ms-ci ms-ci-5 ms-2x opacity-10" />
  </div>
</template>


<script setup>
const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['show-color-picker'])
</script>
