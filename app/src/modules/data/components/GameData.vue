<template>
  <div class="data">
    <GameHeader />

    <div class="container">
      <div class="row">
        <div class="col">
          <ul>
            <li><router-link to="/data/agricola/cards">Agricola Cards</router-link></li>
            <li><router-link to="/data/agricola/results">Agricola Results</router-link></li>
            <li><router-link to="/data/innovation/cards">Innovation Cards</router-link></li>
            <li><router-link to="/data/innovation/results">Innovation Results</router-link></li>
            <li><router-link to="/data/tyrants/cards">Tyrants Cards</router-link></li>
            <li><router-link to="/data/tyrants/hexTiles">Tyrants Demonweb Hex Tiles</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import GameHeader from '../../../components/GameHeader.vue'

export default {
  name: 'GameData',

  components: {
    GameHeader,
  },
}
</script>


<style scoped>
</style>
