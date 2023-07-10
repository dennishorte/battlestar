<template>
  <div class="admin-options">
    Admin Options

    <div @click="ui.fn.toggleGameStats">toggle game stats</div>
    <div @click="ui.fn.toggleWaitingPanel">toggle waiting panel</div>
  </div>
</template>


<script>
export default {
  name: 'AdminOptions',

  inject: ['ui'],
}
</script>
