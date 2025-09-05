// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {UtteranceData, ResponseUtteranceData} from '../types.ts'

/**
 * Transforms an utterance into an object that can be output.
 */
export function transformUtterance(utterance: UtteranceData): ResponseUtteranceData {
  return {
    ...utterance,
    audio: utterance.audio.toString('base64')
  }
}
