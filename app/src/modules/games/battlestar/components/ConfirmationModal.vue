<template>
  <b-modal
    id="confirmation-modal"
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

    title: {
      type: String,
      default: 'Are you sure?',
    },
  }
}
</script>
