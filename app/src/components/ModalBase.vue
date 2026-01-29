<template>
  <div class="modal">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="header">
              {{ title }}
            </slot>
          </h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  ref="closeButton"/>
        </div>

        <div class="modal-body">
          <slot/>
        </div>

        <div class="modal-footer">
          <slot name="footer-pre"/>

          <slot name="footer">
            <button class="btn btn-secondary" @click="cancel" data-bs-dismiss="modal">cancel</button>
            <button class="btn btn-primary" @click="ok" data-bs-dismiss="modal">ok</button>
          </slot>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ModalBase',

  emits: ['cancel', 'ok'],

  props: {
    title: {
      type: String,
      default: ''
    },
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    ok() {
      this.$emit('ok')
    },

    handleKeydown(e) {
      if (e.key === 'Escape') {
        if (this.$refs.closeButton) {
          this.$refs.closeButton.click()
        }
      }
    },
  },

  created() {
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
}
</script>


<style scoped>
</style>
