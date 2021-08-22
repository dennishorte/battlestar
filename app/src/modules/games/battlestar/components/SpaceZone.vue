<template>
<div class="space-zone">

  <b-row no-gutters>
    <b-col class="space-components" md="2">
      <div class="galactica-components">
        <ul>
          <li>raptor</li>
          <li>viper</li>
          <li>civilian</li>
        </ul>
      </div>

      <div class="cylon-components">
        <ul>
          <li>basestar</li>
          <li>raider</li>
          <li>heavy raider</li>
        </ul>
      </div>
    </b-col>

    <b-col class="space-regions p-2 border border-warning">

      <b-row no-gutters>
        <b-col class="space-region" md="4" offset-md="2">
          hello
        </b-col>

        <b-col class="space-region" md="4">
          hello
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col class="space-region" md="4">
          hello
        </b-col>

        <b-col class="space-galactica" md="4">
          galactica
        </b-col>

        <b-col class="space-region" md="4">
          hello
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col class="space-region" md="4" offset-md="2">
          hello
        </b-col>

        <b-col class="space-region" md="4">
          hello
        </b-col>
      </b-row>

    </b-col>
  </b-row>



</div>
</template>


<script>
export default {
  name: 'SpaceZone',
}
</script>

<style>
.space-zone {
    background-color: #33a;
}



.space-region {
    min-height: 5em;
    border-style: solid;
    border-width: 1px;
    border-radius: .5em;

    color: #ddf;
    background-color: #44b;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
