<template>
  <div class="data">
    <Header />

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
import Header from '../../../components/Header'
import InnovationData from './InnovationData'

export default {
  name: 'Data',

  components: {
    Header,
    InnovationData,
  },
}
</script>


<style scoped>
</style>
