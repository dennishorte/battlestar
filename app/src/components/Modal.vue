<template>
   <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="header">
                {{ title }}
              </slot>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" ref="closeButton"></button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer-pre"></slot>

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
  name: 'Modal',

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
  },

  created() {
    window.addEventListener('keydown', (e) => {
      if (e.key == 'Escape') {
        this.$refs.closeButton.click()
      }
    });
  },
}
</script>


<style scoped>
</style>
