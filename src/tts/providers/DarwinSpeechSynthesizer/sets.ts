// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {VoiceSets} from '../../../types.ts'

export const voiceSets: VoiceSets = {
  // Novelty voices from Classic Mac OS.
  novelty: {
    voices: [
      'Bad News',
      {
        name: 'Bells',
        params: {rate: 225}
      },
      // 'Boing',
      // 'Bubbles',
      // 'Bahh',
      {
        name: 'Cellos',
        params: {rate: 225}
      },
      'Good News',
      'Trinoids',
      // 'Jester',
      'Zarvox',
      // 'Whisper',
      {
        name: 'Organ',
        params: {rate: 225}
      },
    ],
    gender: 'none',
    generation: 1,
    params: {volume: 1, rate: 180, pitch: 0}
  },

  // Generation 1 voices from Classic Mac OS
  'gen1_male': {
    voices: [
      'Bruce',
      'Fred',
      'Junior',
      'Ralph'
    ],
    gender: 'male',
    generation: 1,
    params: {volume: 1, rate: 180, pitch: 0}
  },
  'gen1_female': {
    voices: [
      'Agnes',
      'Vicki',
      'Victoria',
      'Princess',
      'Kathy'
    ],
    gender: 'female',
    generation: 1,
    params: {volume: 1, rate: 180, pitch: 0}
  },

  // Generation 2 voices from modern macOS
  'gen2_male': {
    voices: [
      'Alex',
      'Tom',
      'Daniel',
      'Oliver',
      'Lee',
      'Otoya'
    ],
    gender: 'male',
    generation: 2,
    params: {volume: 0.8, rate: 180, pitch: 0}
  },
  'gen2_female': {
    voices: [
      'Allison',
      'Ava',
      'Samantha',
      'Susan',
      'Kate',
      'Serena',
      'Tessa',
      'Fiona',
      'Moira',
      'Veena',
      'Karen',
      'Kyoko',
      'Yuna'
    ],
    gender: 'female',
    generation: 2,
    params: {volume: 0.8, rate: 180, pitch: 0}
  },
}
