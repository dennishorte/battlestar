'use strict'

const adaptive_tactics = require('./adaptive-tactics.js')
const advanced_weaponry = require('./advanced-weaponry.js')
const allied_armada = require('./allied-armada.js')
const ambitious = require('./ambitious.js')
const ambush = require('./ambush.js')
const backed_by_choam = require('./backed-by-choam.js')
const battlefield_research = require('./battlefield-research.js')
const bindu_suspension = require('./bindu-suspension.js')
const blackmail = require('./blackmail.js')
const breakthrough = require('./breakthrough.js')
const bribery = require('./bribery.js')
const buy_access = require('./buy-access.js')
const bypass_protocol = require('./bypass-protocol.js')
const calculated_hire = require('./calculated-hire.js')
const calculating = require('./calculating.js')
const call_to_arms = require('./call-to-arms.js')
const cannon_turrets = require('./cannon-turrets.js')
const change_allegiences = require('./change-allegiences.js')
const charisma = require('./charisma.js')
const choam_profits = require('./choam-profits.js')
const choam_shares = require('./choam-shares.js')
const coercive_negotiation = require('./coercive-negotiation.js')
const contingency_plan = require('./contingency-plan.js')
const controlled = require('./controlled.js')
const corner_the_market = require('./corner-the-market.js')
const councilors_ambition = require('./councilors-ambition.js')
const councilors_dispensation = require('./councilors-dispensation.js')
const counterattack = require('./counterattack.js')
const crysknife = require('./crysknife.js')
const cull = require('./cull.js')
const cunning = require('./cunning.js')
const demand_respect = require('./demand-respect.js')
const depart_for_arrakis = require('./depart-for-arrakis.js')
const desert_mouse = require('./desert-mouse.js')
const desert_support = require('./desert-support.js')
const detonation = require('./detonation.js')
const devious = require('./devious.js')
const devour = require('./devour.js')
const discerning = require('./discerning.js')
const disguised_bureaucrat = require('./disguised-bureaucrat.js')
const dispatch_an_envoy = require('./dispatch-an-envoy.js')
const distraction = require('./distraction.js')
const diversion = require('./diversion.js')
const double_cross = require('./double-cross.js')
const economic_positioning = require('./economic-positioning.js')
const emperors_invitation = require('./emperors-invitation.js')
const expedite = require('./expedite.js')
const false_orders = require('./false-orders.js')
const favored_subject = require('./favored-subject.js')
const find_weakness = require('./find-weakness.js')
const finesse = require('./finesse.js')
const glimpse_the_path = require('./glimpse-the-path.js')
const go_to_ground = require('./go-to-ground.js')
const grand_conspiracy = require('./grand-conspiracy.js')
const grasp_arrakis = require('./grasp-arrakis.js')
const gruesome_sacrifice = require('./gruesome-sacrifice.js')
const guild_authorization = require('./guild-authorization.js')
const harvest_cells = require('./harvest-cells.js')
const honor_guard = require('./honor-guard.js')
const illicit_dealings = require('./illicit-dealings.js')
const imperium_politics = require('./imperium-politics.js')
const impress = require('./impress.js')
const infiltrate = require('./infiltrate.js')
const insider_information = require('./insider-information.js')
const insidious = require('./insidious.js')
const inspire_awe = require('./inspire-awe.js')
const intelligence_report = require('./intelligence-report.js')
const ixian_probe = require('./ixian-probe.js')
const know_their_ways = require('./know-their-ways.js')
const leverage = require('./leverage.js')
const machine_culture = require('./machine-culture.js')
const manipulate = require('./manipulate.js')
const market_opportunity = require('./market-opportunity.js')
const master_tactician = require('./master-tactician.js')
const mercenaries = require('./mercenaries.js')
const opportunism = require('./opportunism.js')
const ornithopter = require('./ornithopter.js')
const plans_within_plans = require('./plans-within-plans.js')
const poison_snooper = require('./poison-snooper.js')
const private_army = require('./private-army.js')
const questionable_methods = require('./questionable-methods.js')
const quid_pro_quo = require('./quid-pro-quo.js')
const rapid_engineering = require('./rapid-engineering.js')
const rapid_mobilization = require('./rapid-mobilization.js')
const reach_agreement = require('./reach-agreement.js')
const recruitment_mission = require('./recruitment-mission.js')
const refocus = require('./refocus.js')
const reinforcements = require('./reinforcements.js')
const resourceful = require('./resourceful.js')
const return_the_favor = require('./return-the-favor.js')
const ripples_in_the_sand = require('./ripples-in-the-sand.js')
const sacred_pools = require('./sacred-pools.js')
const sadistic = require('./sadistic.js')
const second_wave = require('./second-wave.js')
const secret_forces = require('./secret-forces.js')
const secret_of_the_sisterhood = require('./secret-of-the-sisterhood.js')
const secure_spice_trade = require('./secure-spice-trade.js')
const seize_production = require('./seize-production.js')
const shaddams_favor = require('./shaddams-favor.js')
const shadow_alliance = require('./shadow-alliance.js')
const shadowy_bargain = require('./shadowy-bargain.js')
const shrewd = require('./shrewd.js')
const sietch_ritual = require('./sietch-ritual.js')
const sinister = require('./sinister.js')
const sleeper_unit = require('./sleeper-unit.js')
const special_mission = require('./special-mission.js')
const spice_is_power = require('./spice-is-power.js')
const spring_the_trap = require('./spring-the-trap.js')
const staged_incident = require('./staged-incident.js')
const strategic_push = require('./strategic-push.js')
const strategic_stockpiling = require('./strategic-stockpiling.js')
const strongarm = require('./strongarm.js')
const study_melange = require('./study-melange.js')
const tactical_option = require('./tactical-option.js')
const tenuous_bond = require('./tenuous-bond.js')
const the_sleeper_must_awaken = require('./the-sleeper-must-awaken.js')
const the_strong_survive = require('./the-strong-survive.js')
const tiebreaker = require('./tiebreaker.js')
const tleilaxu_puppet = require('./tleilaxu-puppet.js')
const to_the_victor = require('./to-the-victor.js')
const unexpected_allies = require('./unexpected-allies.js')
const unnatural = require('./unnatural.js')
const urgent_mission = require('./urgent-mission.js')
const viscious_talents = require('./viscious-talents.js')
const war_chest = require('./war-chest.js')
const water_of_life = require('./water-of-life.js')
const water_peddlers_union = require('./water-peddlers-union.js')
const weirding_combat = require('./weirding-combat.js')
const windfall = require('./windfall.js')
const withdrawal_agreement = require('./withdrawal-agreement.js')
const withdrawn = require('./withdrawn.js')

const intrigueCards = [
  adaptive_tactics,
  advanced_weaponry,
  allied_armada,
  ambitious,
  ambush,
  backed_by_choam,
  battlefield_research,
  bindu_suspension,
  blackmail,
  breakthrough,
  bribery,
  buy_access,
  bypass_protocol,
  calculated_hire,
  calculating,
  call_to_arms,
  cannon_turrets,
  change_allegiences,
  charisma,
  choam_profits,
  choam_shares,
  coercive_negotiation,
  contingency_plan,
  controlled,
  corner_the_market,
  councilors_ambition,
  councilors_dispensation,
  counterattack,
  crysknife,
  cull,
  cunning,
  demand_respect,
  depart_for_arrakis,
  desert_mouse,
  desert_support,
  detonation,
  devious,
  devour,
  discerning,
  disguised_bureaucrat,
  dispatch_an_envoy,
  distraction,
  diversion,
  double_cross,
  economic_positioning,
  emperors_invitation,
  expedite,
  false_orders,
  favored_subject,
  find_weakness,
  finesse,
  glimpse_the_path,
  go_to_ground,
  grand_conspiracy,
  grasp_arrakis,
  gruesome_sacrifice,
  guild_authorization,
  harvest_cells,
  honor_guard,
  illicit_dealings,
  imperium_politics,
  impress,
  infiltrate,
  insider_information,
  insidious,
  inspire_awe,
  intelligence_report,
  ixian_probe,
  know_their_ways,
  leverage,
  machine_culture,
  manipulate,
  market_opportunity,
  master_tactician,
  mercenaries,
  opportunism,
  ornithopter,
  plans_within_plans,
  poison_snooper,
  private_army,
  questionable_methods,
  quid_pro_quo,
  rapid_engineering,
  rapid_mobilization,
  reach_agreement,
  recruitment_mission,
  refocus,
  reinforcements,
  resourceful,
  return_the_favor,
  ripples_in_the_sand,
  sacred_pools,
  sadistic,
  second_wave,
  secret_forces,
  secret_of_the_sisterhood,
  secure_spice_trade,
  seize_production,
  shaddams_favor,
  shadow_alliance,
  shadowy_bargain,
  shrewd,
  sietch_ritual,
  sinister,
  sleeper_unit,
  special_mission,
  spice_is_power,
  spring_the_trap,
  staged_incident,
  strategic_push,
  strategic_stockpiling,
  strongarm,
  study_melange,
  tactical_option,
  tenuous_bond,
  the_sleeper_must_awaken,
  the_strong_survive,
  tiebreaker,
  tleilaxu_puppet,
  to_the_victor,
  unexpected_allies,
  unnatural,
  urgent_mission,
  viscious_talents,
  war_chest,
  water_of_life,
  water_peddlers_union,
  weirding_combat,
  windfall,
  withdrawal_agreement,
  withdrawn,
]

module.exports = intrigueCards
