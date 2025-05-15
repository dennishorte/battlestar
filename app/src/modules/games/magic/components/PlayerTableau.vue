<template>
  <div class="tableau" :class="extraClasses">

    <div class="tableau-col" :class="extraColumnClasses">
      <div class="tableau-zone">
        <div class="zone-header">
          <div class="zone-name">{{ player.name }}</div>

          <div class="zone-menu">
            <TableauZoneMenu>
              <DropdownButton @click="countersCloseup">counters</DropdownButton>
              <DropdownButton @click="rollDie">roll a die</DropdownButton>
              <DropdownDivider />
              <DropdownButton @click="passToThisPlayer">pass to this player</DropdownButton>
              <DropdownDivider />
              <DropdownButton @click="concede">concede</DropdownButton>
              <DropdownButton @click="drawGame">draw game</DropdownButton>
            </TableauZoneMenu>
          </div>
        </div>
        <PlayerCounters :player="player" />
      </div>

      <TableauZone :zone="getZone('library')" :library-view="true">
        <template #menu>
          <DropdownButton @click="viewNext">view next</DropdownButton>
          <DropdownButton @click="viewTopN">view top n</DropdownButton>
          <DropdownButton @click="viewAll">view all</DropdownButton>
          <DropdownButton @click="revealNext">reveal next</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="draw">draw</DropdownButton>
          <DropdownButton @click="drawSeven">draw 7</DropdownButton>
          <DropdownButton @click="mulligan">mulligan</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="shuffle('library')">shuffle</DropdownButton>
          <DropdownButton @click="shuffleBottom">shuffle bottom</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="moveAll($event, 'library')">move all</DropdownButton>
          <DropdownButton @click="moveRevealed">move revealed</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('exile')" />
    </div>

    <div class="tableau-col" :class="extraColumnClasses">
      <TableauZone :zone="getZone('hand')" :show-mana-cost="player.name === actor.name">
        <template #menu>
          <DropdownButton @click="revealHand">reveal</DropdownButton>
          <DropdownButton @click="hideHand">hide</DropdownButton>
          <DropdownButton @click="shuffle('hand')">shuffle</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="importCard('hand')">import card</DropdownButton>
          <DropdownButton @click="makeToken('hand')">make token</DropdownButton>
          <DropdownButton @click="moveAll($event, 'hand')">move all</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('command')">
        <template #menu>
          <DropdownButton @click="importCard('command')">import card</DropdownButton>
          <DropdownButton @click="makeToken('command')">make token</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('graveyard')" :show-grave-powers="true">
        <template #menu>
          <DropdownButton @click="moveAll($event, 'graveyard')">move all</DropdownButton>
        </template>
      </TableauZone>
    </div>

    <div class="tableau-col" :class="extraColumnClasses">
      <TableauZone :zone="getZone('attacking')" :show-power="true" v-if="isAttacker">
        <template #menu>
          <DropdownButton @click="importCard('attacking')">import card</DropdownButton>
          <DropdownButton @click="makeToken('attacking')">make token</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('blocking')" :show-power="true" v-if="isDefender">
        <template #menu>
          <DropdownButton @click="importCard('blocking')">import card</DropdownButton>
          <DropdownButton @click="makeToken('blocking')">make token</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('creatures')" :show-power="true">
        <template #menu>
          <DropdownButton @click="importCard('creatures')">import card</DropdownButton>
          <DropdownButton @click="makeToken('creatures')">make token</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="moveAll($event, 'creatures')">move all</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('battlefield')">
        <template #menu>
          <DropdownButton @click="importCard('battlefield')">import card</DropdownButton>
          <DropdownButton @click="makeToken('battlefield')">make token</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="moveAll($event, 'battlefield')">move all</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('land')">
        <template #menu>
          <DropdownButton @click="importCard('land')">import card</DropdownButton>
          <DropdownButton @click="makeToken('land')">make token</DropdownButton>
          <DropdownDivider />
          <DropdownButton @click="tapAll($event, 'land')">tap all</DropdownButton>
          <DropdownButton @click="moveAll($event, 'land')">move all</DropdownButton>
        </template>
      </TableauZone>

      <TableauZone :zone="getZone('stack')">
        <template #menu>
          <DropdownButton @click="importCard('stack')">import card</DropdownButton>
          <DropdownButton @click="makeToken('stack')">make token</DropdownButton>
        </template>
      </TableauZone>
    </div>

    <!-- Die Roll Modal -->
    <ModalBase :id="`magic-die-roll-modal-${player.name}`" @ok="rollDieDo">
      <template #header>Roll a Die</template>
      <input class="form-control" placeholder="number of faces" v-model.number="dieFaces" />
    </ModalBase>

    <!-- Shuffle Bottom Modal -->
    <ModalBase :id="`magic-shuffle-bottom-${player.name}`" @ok="shuffleBottomDo">
      <template #header>Shuffle Bottom of Library</template>
      <input class="form-control" placeholder="number to shuffle" v-model.number="shuffleBottomCount" />
    </ModalBase>

    <!-- Top N Modal -->
    <ModalBase :id="`magic-top-n-modal-${player.name}`" @ok="viewTopNDo">
      <template #header>View Top Cards of Library</template>
      <input class="form-control" placeholder="number to view" v-model.number="topNCount" />
    </ModalBase>

    <!-- Make Token Modal -->
    <ModalBase :id="`make-token-modal-${player.name}`" @ok="makeTokenDo">
      <template #header>Make Tokens</template>
      <input class="form-control" v-model="token.name" placeholder="name" />
      <input class="form-control mt-2" v-model="token.annotation" placeholder="annotation" />
      <select class="form-select mt-2" v-model="token.zoneId">
        <option v-for="zoneId in importZoneIds" :key="zoneId">{{ zoneId }}</option>
      </select>
      <input class="form-control mt-2" v-model.number="token.count" placeholder="count" />
      <div class="form-check mt-2 bigger-font">
        <input class="form-check-input" type="checkbox" v-model="token.morph" />
        <label class="form-check-label">morphed</label>
      </div>
    </ModalBase>

    <ImportCardModal :id="`import-card-modal-${player.name}`" :zone-suggestion="importZoneId" @import-card="importCardDo" />

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div id="move-revealed-toast" class="toast" ref="moveRevealedToast">
        <div class="toast-header">
          <button type="button" class="btn-close" data-bs-dismiss="toast"/>
        </div>
        <div class="toast-body">
          Click on a zone to move all revealed cards from the library.
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { Toast } from 'bootstrap'
import { computed } from 'vue'
import { mapGetters } from 'vuex'

import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import ImportCardModal from './ImportCardModal'
import ModalBase from '@/components/ModalBase'
import PlayerCounters from './PlayerCounters'
import TableauZone from './TableauZone'
import TableauZoneMenu from './TableauZoneMenu'


export default {
  name: 'PlayerTableau',

  components: {
    DropdownButton,
    DropdownDivider,
    ImportCardModal,
    ModalBase,
    PlayerCounters,
    TableauZone,
    TableauZoneMenu,
  },

  inject: ['actor', 'do', 'game'],

  props: {
    player: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      dieFaces: 2,
      importZoneId: '',
      shuffleBottomCount: 5,
      topNCount: 1,
      token: {
        annotation: '',
        count: 1,
        name: '',
        zoneId: '',
        morph: false,
      },
    }
  },

  provide() {
    return {
      player: computed(() => this.player),
    }
  },

  computed: {
    ...mapGetters('magic/game', {
      importZoneIds: 'importZoneIds',
    }),

    actorPlayer() {
      return this.game.getPlayerByName(this.actor.name)
    },

    extraClasses() {
      return this.player.name !== this.actor.name ? 'tableau-reverse' : ''
    },

    extraColumnClasses() {
      return this.player.name !== this.actor.name ? 'tableau-col-reverse' : ''
    },

    isCombatPhase() {
      return this.game.utilCombatPhases().includes(this.game.getPhase())
    },

    isAttacker() {
      return this.isCombatPhase && this.game.getPlayerTurn() === this.player
    },

    isDefender() {
      return this.isCombatPhase && this.game.getPlayerTurn() !== this.player
    },
  },

  methods: {
    concede() {
      this.do(this.player, { name: 'concede' })
    },

    countersCloseup() {
      this.$modal('counter-closeup-modal').show()
    },

    draw() {
      this.do(this.player, { name: 'draw' })
    },

    drawGame() {
      this.do(this.actorPlayer, { name: 'draw game' })
    },

    drawSeven() {
      this.do(this.player, { name: 'draw 7' })
    },

    getZone(name) {
      return this.game.getZoneByPlayer(this.player, name)
    },

    hideHand() {
      const zoneId = `players.${this.player.name}.hand`
      this.do(this.actorPlayer, { name: 'hide all', zoneId })
    },

    importCard(zoneName) {
      this.importZoneId = `players.${this.player.name}.${zoneName}`
      this.$modal(`import-card-modal-${this.player.name}`).show()
    },

    importCardDo(data) {
      data.card = data.card.toJSON()
      this.do(null, {
        name: 'import card',
        data,
      })
    },

    makeToken(zoneName) {
      this.token.zoneId = `players.${this.player.name}.${zoneName}`
      this.$modal(`make-token-modal-${this.player.name}`).show()
    },

    makeTokenDo() {
      this.do(null, {
        name: 'create token',
        data: {
          name: this.token.name,
          annotation: this.token.annotation,
          count: this.token.count,
          zoneId: this.token.zoneId,
          morph: this.token.morph,
        }
      })
    },

    moveAll(event, zone) {
      event.stopPropagation()
      const zoneId = `players.${this.player.name}.${zone}`
      this.$store.commit('magic/game/setMovingAllSource', zoneId)
      const toast = new Toast(this.$refs.moveRevealedToast)
      toast.show()
    },

    moveRevealed(event) {
      event.stopPropagation()
      const zoneId = `players.${this.player.name}.library`
      this.$store.commit('magic/game/setMovingRevealedSource', zoneId)
      const toast = new Toast(this.$refs.moveRevealedToast)
      toast.show()
    },

    mulligan() {
      this.do(this.player, { name: 'mulligan' })
    },

    passToThisPlayer() {
      this.do(this.actorPlayer, { name: 'pass priority', target: this.player.name })
      this.$store.dispatch('game/save')
    },

    revealHand() {
      const zoneId = `players.${this.player.name}.hand`
      this.do(this.actorPlayer, { name: 'reveal all', zoneId })
    },

    revealNext() {
      const zoneId = `players.${this.player.name}.library`
      this.do(this.actorPlayer, { name: 'reveal next', zoneId })
    },

    rollDie() {
      this.$modal(`magic-die-roll-modal-${this.player.name}`).show()
    },

    rollDieDo() {
      this.do(this.player, { name: 'roll die', faces: this.dieFaces })
    },

    shuffle(zoneName) {
      const zoneId = `players.${this.player.name}.${zoneName}`
      this.do(this.actorPlayer, { name: 'shuffle', zoneId })
    },

    shuffleBottom() {
      this.$modal(`magic-shuffle-bottom-${this.player.name}`).show()
    },

    shuffleBottomDo() {
      const zoneId = `players.${this.player.name}.library`
      this.do(this.actorPlayer, {
        name: 'shuffle bottom',
        zoneId,
        count: this.shuffleBottomCount,
      })
    },

    tapAll(event, zone) {
      const zoneId = `players.${this.player.name}.${zone}`
      this.do(this.actorPlayer, {
        name: 'tap all',
        zoneId,
      })
    },

    viewAll() {
      const zoneId = `players.${this.player.name}.library`
      this.do(this.actorPlayer, { name: 'view all', zoneId })
    },

    viewNext() {
      const zoneId = `players.${this.player.name}.library`
      this.do(this.actorPlayer, { name: 'view next', zoneId })
    },

    viewTopN() {
      this.$modal(`magic-top-n-modal-${this.player.name}`).show()
    },

    viewTopNDo() {
      const zoneId = `players.${this.player.name}.library`
      this.do(this.actorPlayer, { name: 'view top k', count: this.topNCount, zoneId })
    },
  }
}
</script>


<style>
.bigger-font {
  font-size: 1.25em;
}

.tableau-zone {
  border: 1px solid var(--bs-secondary);
  border-radius: .25em;
  padding: .25em;
}

.tableau-zone:not(:first-of-type) {
  margin-top: .25em;
}

.zone-count {

}

.zone-header {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.zone-menu {
  position: absolute;
  top: -.25em;
  right: -.25em;
}

.zone-name {
  font-weight: bold;
}
</style>

<style scoped>
.tableau {
  display: flex;
  flex-direction: row;

  border: 1px solid var(--bs-secondary);
  background-color: var(--bs-light);
  border-radius: .25em;

  font-size: .8em;
  padding: .25em;

  min-width: 37.5em;
  max-width: 37.5em;
}

.tableau-reverse {
  flex-direction: row-reverse;
}

.tableau-col {
  width: 33%;
}

.tableau-col:not(:first-of-type) {
  margin-left: .25em;
}

.tableau-col-reverse:not(:first-of-type) {
  margin-left: 0;
  margin-right: .25em;
}
</style>
