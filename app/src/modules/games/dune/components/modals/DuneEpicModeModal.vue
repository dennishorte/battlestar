<template>
  <ModalBase id="dune-epic-mode-modal">
    <template #header>Epic mode</template>

    <div class="epic-modal">
      <p>
        This game is using Epic mode. Rise of Ix is still in play, and there are
        still 10 rounds. These are the differences from a regular game.
      </p>

      <div v-for="row in differences" :key="row.title" class="diff">
        <div class="diff-title">{{ row.title }}</div>
        <div class="diff-pair">
          <div class="side">
            <div class="side-label">Regular</div>
            <div>{{ row.regular }}</div>
          </div>
          <div class="side side-epic">
            <div class="side-label">Epic</div>
            <div>{{ row.epic }}</div>
          </div>
        </div>
      </div>

      <h3>The two cards Epic adds</h3>

      <div class="card-note">
        <div class="card-name">Economic Supremacy</div>
        <p>The extra Conflict III. Skirmish I, Skirmish II, and Trade Monopoly stay out of the deck.</p>
        <ul>
          <li><strong>1st:</strong> 1 victory point. You may pay 6 Solari for another, and you may pay 4 spice for another.</li>
          <li><strong>2nd:</strong> 1 victory point.</li>
          <li><strong>3rd:</strong> 2 spice and 2 Solari.</li>
        </ul>
      </div>

      <div class="card-note">
        <div class="card-name">Control the Spice</div>
        <p>Replaces one copy of Dune, the Desert Planet. It has a Spice Trade agent icon.</p>
        <ul>
          <li><strong>Agent:</strong> you may pay 1 spice to trash a card and gain 1 troop.</li>
          <li><strong>Reveal:</strong> 1 persuasion and 1 spice.</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

const DIFFERENCES = [
  {
    title: 'Victory points',
    regular: 'The first player to reach 10 victory points wins.',
    epic: 'The first player to reach 12 victory points wins.',
  },
  {
    title: 'Conflict deck',
    regular: 'One Conflict I, then five Conflict II, then four Conflict III.',
    epic: 'No Conflict I. Five Uprising Conflict II cards, then five Conflict III cards: the four Uprising ones, plus Economic Supremacy.',
  },
  {
    title: 'Starting deck',
    regular: 'Two copies of Dune, the Desert Planet.',
    epic: 'One of those copies is replaced by Control the Spice. The other stays.',
  },
  {
    title: 'Troops',
    regular: '3 in the garrison and 9 in supply.',
    epic: '5 in the garrison and 7 in supply. The troop pool is still 12.',
  },
  {
    title: 'Intrigue',
    regular: 'Nobody draws an Intrigue card during setup. Viscount Hundro Moritani, if he is in the game, looks at the top two and keeps one at the start.',
    epic: 'Each player draws one Intrigue card. Hundro looks at the top two and keeps one only after everyone else has drawn.',
  },
]

export default {
  name: 'DuneEpicModeModal',

  components: { ModalBase },

  computed: {
    differences() {
      return DIFFERENCES
    },
  },
}
</script>


<style scoped>
.epic-modal {
  font-size: .9em;
  line-height: 1.45;
  color: #2c2416;
}

.epic-modal p {
  margin: 0 0 .75em;
}

.diff {
  margin-bottom: .7em;
}

.diff-title {
  font-weight: 700;
  color: #8b6914;
  margin-bottom: .25em;
}

.diff-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .45em;
}

.side {
  padding: .4em .5em;
  border-radius: .25em;
  border: 1px solid #e4dcc8;
  background: #faf8f4;
}

.side-epic {
  border-color: #d4c8a8;
  background: #fdf8ee;
}

.side-label {
  font-size: .72em;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: #8a7a62;
  margin-bottom: .15em;
}

.side-epic .side-label {
  color: #8b6914;
}

h3 {
  font-size: 1em;
  font-weight: 700;
  margin: .9em 0 .4em;
  color: #8b6914;
}

.card-note {
  margin-bottom: .7em;
}

.card-note:last-child {
  margin-bottom: 0;
}

.card-name {
  font-weight: 700;
}

.card-note p {
  margin: .15em 0 .25em;
}

ul {
  margin: 0 0 0 1.15em;
  padding: 0;
}

li {
  margin-bottom: .15em;
}

:deep(.modal-dialog) {
  max-width: 560px;
}
</style>
