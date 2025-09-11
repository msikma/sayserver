// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {VoiceSets} from '../../../types.ts'

export const voiceSets: VoiceSets = {
  // Amazon Polly
  polly_male: {
    voices: [
      'Brian', // The famous one.
      'Geraint',
      'Russell',
      'Joey',
      'Justin',
      'Matthew'
    ],
    gender: 'male',
    generation: null,
    params: null
  },
  polly_female: {
    voices: [
      'Amy',
      'Emma',
      'Nicole',
      'Ivy',
      'Joanna',
      'Kendra',
      'Kimberly',
      'Salli',
      'Raveena'
    ],
    gender: 'female',
    generation: null,
    params: null
  },
}
