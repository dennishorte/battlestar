const cards = [
  require('./Sinuhe.js'),
  require('./Homer.js'),
  require('./FuXi.js'),
  require('./Hatshepsut.js'),
  require('./Daedalus.js'),
  require('./Ptahhotep.js'),
  require('./Shennong.js'),
  require('./HuangDi.js'),
  require('./Imhotep.js'),
  require('./Tigernmas.js'),
  require('./Gilgamesh.js'),
  require('./SunshuAo.js'),
  require('./Sneferu.js'),
  require('./Hammurabi.js'),
  require('./SargonofAkkad.js'),
  require('./Plato.js'),
  require('./SunTzu.js'),
  require('./AlexandertheGreat.js'),
  require('./Confucius.js'),
  require('./ZhangHeng.js'),
  require('./Archimedes.js'),
  require('./Ptolemy.js'),
  require('./AugustusCaesar.js'),
  require('./XimenBao.js'),
  require('./CaiLun.js'),
  require('./MurasakiShikibu.js'),
  require('./ShenKuo.js'),
  require('./Saladin.js'),
  require('./Avicenna.js'),
  require('./TranHuangDao.js'),
  require('./SejongtheGreat.js'),
  require('./Rhazes.js'),
  require('./SuSong.js'),
  require('./Alhazen.js'),
  require('./AlKindi.js'),
  require('./LeonardaDaVinci.js'),
  require('./CristopherColumbus.js'),
  require('./JohannesKepler.js'),
  require('./YiSunSin.js'),
  require('./NiccoloMachiavelli.js'),
  require('./AminaSukhera.js'),
  require('./Michaelangelo.js'),
  require('./Takiyuddin.js'),
  require('./GalileoGalilei.js'),
  require('./WilliamShakespeare.js'),
  require('./SamueldeChamplain.js'),
  require('./JohannesVermeer.js'),
  require('./ChristiaanHuygens.js'),
  require('./BartolomeoCristofori.js'),
  require('./BartholomewRoberts.js'),
  require('./PetertheGreat.js'),
  require('./IsaacNewton.js'),
  require('./AntoineVanLeeuwenhoek.js'),
  require('./Shivaji.js'),
  require('./ChristopherPolhem.js'),
  require('./LudwigVanBeethoven.js'),
  require('./JohnHarrison.js'),
  require('./JohnLoudonMcAdam.js'),
  require('./AdamSmith.js'),
  require('./Tecumseh.js'),
  require('./NapoleonBonaparte.js'),
  require('./CatherinetheGreat.js'),
  require('./BenjanminFranklin.js'),
  require('./CarlFriedrichGauss.js'),
  require('./EdwardJenner.js'),
  require('./GeorgeStephenson.js'),
  require('./EmperorMeiji.js'),
  require('./RowlandHill.js'),
  require('./CharlesDarwin.js'),
  require('./AlfredNobel.js'),
  require('./FlorenceNightingale.js'),
  require('./JamesClerkMaxwell.js'),
  require('./JohnEricsson.js'),
  require('./RobertELee.js'),
  require('./QueenVictoria.js'),
  require('./DukeEllington.js'),
  require('./JohnVonNeumann.js'),
  require('./AlbertEinstein.js'),
  require('./EmmyNoether.js'),
  require('./ErwinRommel.js'),
  require('./MarieCurie.js'),
  require('./NikolaTesla.js'),
  require('./JPMorgan.js'),
  require('./CaresseCrosby.js'),
  require('./HGWells.js'),
  require('./NelsonMandela.js'),
  require('./MikhailKalashnikov.js'),
  require('./RuthHandler.js'),
  require('./CheGuevara.js'),
  require('./HedyLamar.js'),
  require('./Pele.js'),
  require('./GraceHopper.js'),
  require('./TaiichiOno.js'),
  require('./GeneRoddenberry.js'),
  require('./WernherVonBraun.js'),
  require('./JackieChan.js'),
  require('./StephenHawking.js'),
  require('./MartinScorsese.js'),
  require('./KimYuNa.js'),
  require('./SusanBlackmore.js'),
  require('./MargaretThatcher.js'),
  require('./AlexTrebek.js'),
  require('./ShigeruMiyamoto.js'),
  require('./MuhammadYunus.js'),
  require('./SergeyBrin.js')
].map(f => new f())

const byName = {}
for (const card of cards) {
  byName[card.name] = card
}

const byAge = {}
for (const i of [1,2,3,4,5,6,7,8,9,10]) {
  byAge[i] = []
}
for (const card of cards) {
  byAge[card.age].push(card)
}

module.exports = {
  cards,
  byName,
  byAge,
}
