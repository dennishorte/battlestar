<template>
  <EditableContent
    v-bind="editor"
    :class="{
      'scar-tape': scarred,
    }"
    @click="handleClick"
  />
</template>


<script setup>
import { computed, unref } from 'vue'
import EditableContent from '@/components/EditableContent.vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  scarred: {
    type: [Boolean, Object], // Accept both Boolean and Ref<Boolean>
    required: true,
  },

  handleClick: {
    type: Function,
    required: true
  },
})

const scarred = computed(() => unref(props.scarred))
</script>
