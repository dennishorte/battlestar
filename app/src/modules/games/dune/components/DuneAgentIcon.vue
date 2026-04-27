<template>
  <span class="dune-agent-icon"
        :class="`dune-agent-icon-${type}`"
        :style="{ '--agent-icon-base': size }" />
</template>


<script>
export default {
  name: 'DuneAgentIcon',

  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: '1em',
    },
  },
}
</script>


<style scoped>
.dune-agent-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

.dune-agent-icon-purple {
  background-color: #6a3d8a;
  border-radius: 50%;
  width: calc(.8 * var(--agent-icon-base));
  height: calc(.8 * var(--agent-icon-base));
}

.dune-agent-icon-yellow {
  background-color: #b8860b;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  width: calc(.9 * var(--agent-icon-base));
  height: calc(.8 * var(--agent-icon-base));
}

.dune-agent-icon-green {
  background-color: #3a7d3a;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  width: calc(.9 * var(--agent-icon-base));
  height: calc(.85 * var(--agent-icon-base));
}
</style>
