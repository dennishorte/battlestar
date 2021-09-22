const imageConcrete = require('../assets/images/concrete_seamless.png')
const imageFirstAidKit = require('../assets/images/first_aid_kit.png')
const imageSpace = require('../assets/images/space.jpg')
const imageYouAreACylon = require('../assets/images/you-are-a-cylon.png')
const imageYouAreNotACylon = require('../assets/images/you-are-not-a-cylon.png')

const variants = {
  politics: {
    fgColor: 'black',
    bgColor: '#fff90050',
    bgImage: imageConcrete,
  },
  leadership: {
    fgColor: 'black',
    bgColor: '#19782150',
    bgImage: imageConcrete,
  },
  tactics: {
    fgColor: 'black',
    bgColor: '#9a06c750',
    bgImage: imageConcrete,
  },
  piloting: {
    fgColor: 'black',
    bgColor: '#f00e0250',
    bgImage: imageConcrete,
  },
  engineering: {
    fgColor: 'black',
    bgColor: '#042fbd50',
    bgImage: imageConcrete,
  },
  treachery: {
    fgColor: 'black',
    bgColor: '#e8b86f50',
    bgImage: imageConcrete,
  },

  activePlayer: {
    bgColor: '#FFE4C4',
  },

  space: {
    fgColor: 'white',
    bgColor: '',
    bgImage: imageSpace,
  },

  location: {
    fgColor: 'black',
    bgColor: '',
    bgImage: imageFirstAidKit,
  },

  youAreACylon: {
    fgColor: 'white',
    bgImage: imageYouAreACylon,
    bgSize: 'cover',
  },

  youAreNotACylon: {
    fgColor: 'white',
    bgImage: imageYouAreNotACylon,
    bgSize: 'cover',
  },
}

function fetch(variant) {
  return variants[variant] || {}
}

export default {
  fetch,
}
