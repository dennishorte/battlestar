<template>
  <ModalBase id="error-modal" class="error-modal">
    <template #header>
      Error
    </template>

    <div class="error-modal-body"/>

    <template #footer>
      <button class="btn btn-primary" @click="reload">reload page</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase'


export default {
  name: 'ErrorModal',

  components: {
    ModalBase,
  },

  methods: {
    reload() {
      window.location.reload()
    }
  },
}
</script>


<style>
.error-modal .modal-content {
  color: #842029!important;
  background-color: #f8d7da!important;
  border-color: #f5c2c7!important;
}

.error-modal .modal-header {
  border-color: #f5c2c7!important;
}

.error-modal .modal-footer {
  border-color: #f5c2c7!important;
}
</style>
