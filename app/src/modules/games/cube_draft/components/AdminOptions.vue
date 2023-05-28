<template>
  <div class="admin-options">
    Admin Options

    <div @click="toggleWaitingPanel">toggle waiting panel</div>
  </div>
</template>


<script>
export default {
  name: 'AdminOptions',

  inject: ['ui'],

  methods: {
    toggleWaitingPanel() {
      this.ui.fn.toggleWaitingPanel()
    },
  },
}
</script>
