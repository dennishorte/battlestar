<template>
  <div class="data">
    <b-container>
      <b-row>
        <b-col>
          <InnovationData />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>


<script>
import InnovationData from './InnovationData'

export default {
  name: 'Data',

  components: {
    InnovationData,
  },
}
</script>


<style scoped>
</style>
