// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {Command} from './types.ts'

/**
 * Returns a command for compressing an audio file for transfer.
 */
export function compressAudioFile(bin: string, inputFile: string, outputFile: string): Command {
  return [bin, `-y`, `-i`, `${inputFile}`, `-c:a`, `libopus`, `-b:a`, `24k`, `${outputFile}`]
}

/**
 * Returns a command for probing the metadata from an audio file.
 */
export function probeAudioFile(bin: string, inputFile: string): Command {
  return [bin, `-show_format`, `-show_streams`, `-print_format`, `json`, `${inputFile}`]
}
