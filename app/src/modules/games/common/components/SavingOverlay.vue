<template>
  <div class="saving-overlay" :class="saving ? 'show' : ''">
  </div>
</template>


<script>
import { mapState } from 'vuex'


export default {
  name: 'SavingOverlay',

  computed: {
    ...mapState('game', {
      saving: 'saving',
    })
  },
}
</script>


<style scoped>
.saving-overlay {
  display:    none;
  position:   fixed;
  z-index:    1000;
  top:        0;
  left:       0;
  height:     100%;
  width:      100%;
  background: rgba( 255, 255, 255, .8 )
  url('https://icons8.com/preloaders/preloaders/813/Misterious%20mist.gif')
  50% 50%
  no-repeat;
}

.show {
  display: block;
}
</style>
