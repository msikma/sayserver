// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {Command, Voice} from '../../../types.ts'

/**
 * Returns a command for generating a .wav file of an utterance.
 */
export function generateUtterance(bin: string, voice: Voice, outputFile: string, prompt: string): Command {
  return [bin, `--data-format=LEI24@48000`, `--file-format`, `WAVE`, `--voice`, `${voice.name}`, `-o`, `${outputFile}`, `${prompt}`]
}

/**
 * Produces a list of all voices on the system.
 */
export function getVoices(bin: string): Command {
  return [bin, '-v', '?']
}
