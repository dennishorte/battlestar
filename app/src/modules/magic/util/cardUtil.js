const CardUtil = {}

CardUtil.isLand = function(card) {
  return card.type_line.toLowerCase().includes('land')
}

CardUtil.isArtifact = function(card) {
  return card.type_line.toLowerCase().includes('artifact')
}

CardUtil.frameColor = function(card) {
  if (card.colors.length === 1) {
    switch (card.colors[0]) {
      case 'R': return 'red';
      case 'W': return 'white';
      case 'U': return 'blue';
      case 'G': return 'green';
      case 'B': return 'black';
      default:
        throw new Error('Unknown single color: ' + card.colors[0])
    }
  }

  else if (card.colors.length > 1) {
    return 'gold'
  }

  else if (this.isLand(card)) {
    return 'land'
  }

  else {
    return 'artifact'
  }
}

export default CardUtil
