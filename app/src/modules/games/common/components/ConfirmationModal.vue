<template>
  <b-modal
    :id="modalId"
    :title="title"
    ok-title="Do it Anyway"
    @ok="callback"
  >
    <slot></slot>
  </b-modal>
</template>


<script>
export default {
  name: 'ConfirmationModal',

  props: {
    callback: {
      type: Function,
      default: () => {},
    },

    modalId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: 'Are you sure?',
    },
  },
}
</script>
