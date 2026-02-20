describe('Space Combat', () => {
  describe('Anti-Fighter Barrage', () => {
    test.todo('AFB fires before first combat round')
    test.todo('AFB only targets fighters')
    test.todo('destroyer AFB rolls based on ability value')
    test.todo('AFB hits assigned by defender')
  })

  describe('Combat Rounds', () => {
    test.todo('each ship rolls one die per combat value')
    test.todo('hit scored when roll >= combat value')
    test.todo('attacker and defender roll simultaneously')
    test.todo('combat continues until one side eliminated')
    test.todo('multiple rounds of combat')
  })

  describe('Hit Assignment', () => {
    test.todo('player chooses which units take hits')
    test.todo('must assign all hits')
    test.todo('sustain damage cancels one hit')
    test.todo('damaged unit destroyed by next hit')
    test.todo('cannot sustain damage if already damaged')
  })

  describe('Retreat', () => {
    test.todo('defender can announce retreat after round 1')
    test.todo('attacker cannot retreat')
    test.todo('retreat moves ships to adjacent system')
    test.todo('cannot retreat to system with enemy ships')
    test.todo('retreat requires valid adjacent system')
  })

  describe('Nebula', () => {
    test.todo('defender in nebula gets +1 to combat rolls')
    test.todo('defender ships in nebula cannot retreat')
  })
})
