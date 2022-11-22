<template>
  <MagicWrapper>
    <PreGame v-if="inPreGame" />

    <div v-else class="magic-game">
      Magic
    </div>
  </MagicWrapper>
</template>


<script>
import MagicWrapper from '@/modules/magic/components/MagicWrapper'
import PreGame from './PreGame'


export default {
  name: 'Magic',

  components: {
    MagicWrapper,
    PreGame,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      game: this.data,
    }
  },

  computed: {
    inPreGame() {
      return true
    },
  },

  provide() {
    return {
      actor: this.actor,
      game: this.game,
    }
  },

  mounted() {
    document.title = this.game.settings.name || 'Game Center'
  },
}
</script>
