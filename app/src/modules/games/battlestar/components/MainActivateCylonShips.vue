<template>
  <div class="main-activate-cylon-ships description">

    <b-tabs content-class="mt-2">

      <b-tab title="Raiders" active>
        <p>
          When activated, each Cylon raider carries out only one of the
          actions listed below, taking only the first action that it is able
          to perform (in numerical priority, with “Attack a Viper” taking
          the highest priority and “Attack Galactica” taking the lowest).
        </p>

        <ol>
          <li>
            The raider attacks a viper in its space Attack a Viper:
            area. It attacks an unmanned viper if able; otherwise it attacks a piloted viper.
          </li>

          <li>
            If there are no vipers in its area, the Destroy Civilian Ship:
            raider destroys one civilian ship in its area. The current
            player chooses a civilian ship in the area and flips it over.
            The resources listed on its face are lost, and the token is
            removed from the game.
          </li>

          <li>
            If there are no civilian ships in the area, the viper Move:
            moves one space area towards the nearest civilian ship. If
            several civilian ships are equidistant, it moves clockwise
            around Galactica.
          </li>

          <li>
            If there are no civilian ships on the game Attack Galactica:
            board, the raider attacks Galactica (see “Attacking” on
            page 24).
          </li>
        </ol>

        <p>
          If there are no raiders on the game board when raiders are
          activated, two raiders are launched from each basestar. If
          there are no basestars in play, then nothing happens.
        </p>
      </b-tab>

      <b-tab title="Raiders Launch">
        <p>
          When the launch raiders icon appears, each basestar
          launches three raiders. If there are no basestars in play, then
          nothing happens.
        </p>

        <p>
          Whenever a raider (or heavy raider) is launched, the current
          player takes a ship of the specified type from among those
          not currently on the game board. He then places it in the
          launching basestar’s area. If all of the raiders are on the game
          board, then no more raiders may be launched.
        </p>
      </b-tab>

      <b-tab title="Hvy Raiders">
        <p>
          Heavy raiders never attack. They always move towards the
          nearest space area containing a viper launch icon. If a heavy
          raider starts its movement in a space with a viper launch
          icon, the centurions on it board Galactica.
        </p>
        <p>
          When centurions from a heavy raider board Galactica,
          that heavy raider is removed from the game board, and a
          centurion token is placed on the start space of the Boarding
          Party track. Whenever there are any centurion tokens on the
          Boarding Party track and heavy raiders are activated (even
          by a revealed Cylon player), each centurion token moves one
          space towards the “Humans Lose” space. If a centurion token
          reaches the end of the track, then the Cylons win the game.
        </p>
        <p>
          The human players can attempt to destroy centurions by
          activating the “Armory” location on the game board.
          If there are no heavy raiders on the game board when heavy
          raiders are activated, one heavy raider is launched from
          each basestar. If there are no basestars in play, then nothing
          happens.
        </p>
      </b-tab>

      <b-tab title="Basestar Attacks">
        <p>
          When a Cylon basestar is activated, the basestar attacks
          Galactica. The current player rolls a die for each basestar on
          the game board to find out if the attack damages Galactica.
        </p>
      </b-tab>

      <b-tab title="Damage Rolls">
        <b-img :src="damageImage" />
      </b-tab>

    </b-tabs>

  </div>
</template>


<script>
export default {
  name: 'MainActivateCylonShips',

  data() {
    return {
      damageImage: require('../assets/images/attacktable.jpg'),
    }
  },
}
</script>


<style scoped>
  .description {
  color: #444;
  font-size: .7em;
  }
</style
>
