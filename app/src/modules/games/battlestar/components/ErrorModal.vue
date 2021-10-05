<template>
  <b-modal
    ref="error-modal"
    title="Error"
    ok-only>

    {{ errorMessage }}

  </b-modal>
</template>


<script>
export default {
  name: 'HacksModal',

  computed: {
    errorMessage() {
      return this.$store.getters['bsg/uiErrorMessage']
    },
  },

  watch: {
    errorMessage(value) {
      if (value) {
        this.$refs['error-modal'].show()
      }
    }
  },
}
</script>
