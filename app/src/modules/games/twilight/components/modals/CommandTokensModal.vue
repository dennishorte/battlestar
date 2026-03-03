<template>
  <ModalBase id="twilight-command-tokens">
    <template #header>Command Tokens</template>

    <div class="ct-info">
      <p>Each player has a pool of command tokens distributed across three areas.</p>

      <h6>Tactics Pool</h6>
      <p>
        Spend one token to perform a <strong>tactical action</strong> — activate a system
        to move ships, invade planets, or produce units. The token is placed on the
        activated system and prevents you from activating it again this round.
      </p>

      <h6>Strategy Pool</h6>
      <p>
        Spend one token to use the <strong>secondary ability</strong> of another player's
        strategy card when they perform their strategic action.
      </p>

      <h6>Fleet Supply</h6>
      <p>
        Limits the number of <strong>non-fighter ships</strong> you can have in each system.
        A fleet supply of 3 means at most 3 non-fighter ships per system. Fighters
        (and ground forces) do not count against this limit.
      </p>

      <h6>Gaining Tokens</h6>
      <ul>
        <li><strong>Leadership primary</strong> — gain 3 tokens, then spend influence to buy more (3 influence each).</li>
        <li><strong>Leadership secondary</strong> — spend influence to buy tokens (3 influence each).</li>
        <li><strong>Status phase</strong> — gain 2 tokens and redistribute all tokens freely among your three pools.</li>
      </ul>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'CommandTokensModal',
  components: { ModalBase },
}
</script>

<style scoped>
.ct-info h6 {
  margin-top: .75em;
  margin-bottom: .25em;
  font-weight: 700;
}

.ct-info p {
  margin-bottom: .5em;
}

.ct-info ul {
  padding-left: 1.25em;
  margin-bottom: .5em;
}

.ct-info li {
  margin-bottom: .25em;
}
</style>
