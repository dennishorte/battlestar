<template>
  <div class="innovation">
    <b-container>
      <b-row>
        <b-col class="game-log">

          <div class="selector">
            <WaitingPanel />
          </div>

          <div>
            <History />
          </div>
        </b-col>

        <b-col>
          Board
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>


<script>
import { inn } from 'battlestar-common'

import History from './History'
import WaitingPanel from './WaitingPanel'

export default {
  name: 'Innovation',

  components: {
    History,
    WaitingPanel,
  },

  props: {
    data: Object,
    actor: Object
  },

  data() {
    return {
      game: new inn.Innovation(this.data, this.actor.name),
    }
  },

  provide() {
    return {
      game: this.game,
    }
  },

  created() {
    this.game.testMode = true
    this.game.run()
  }
}
</script>

<style>
.innovation {
  background-color: cyan;
  width: 100%;
}

</style>
