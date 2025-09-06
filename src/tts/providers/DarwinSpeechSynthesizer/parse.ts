// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import type {VoiceParams} from '../../../types.ts'

/**
 * Returns a command tag string.
 * 
 * A command tag is used to fine tune the way a line is spoken in an utterance.
 * The value sign can be an empty string, "+" or "-". We typically only use it for pitch.
 */
function getCommandTag(type: string, value: number = 1, valueSign: string = '', useValue: boolean = true) {
  if (useValue === false) {
    return null
  }
  const clampedValue = Math.min(Math.max(value, 0), 10000)
  return `[[${type} ${valueSign}${clampedValue}]]`
}

/**
 * Returns a reset tag.
 * 
 * This clears all currently active command tags.
 */
function getResetTag() {
  return `[[rset]]`
}

/**
 * Removes injected utterance commands from input text.
 * 
 * This is used to prevent people from 
 */
function stripCommandTags(prompt: string) {
  return prompt.replace(/(\[\[([^]]*)\]\])/, '')
}

/**
 * Returns a utterance prompt that includes all settings in the form of tags.
 * 
 * This function does two things: it sanitizes the input (removes all tags that might be in the prompt)
 * and applies our predefined modifiers for a given voice. For example, if a voice is determined to be
 * a bit slow by default, we crank up its "rate" value in ./sets.ts and apply it to the prompt here.
 */
export function getUtterancePrompt(prompt: string, params: VoiceParams, useVolume = false, usePitch = false, useRate = true) {
  // The commands that precede all lines in the prompt.
  const commands = [
    getCommandTag('volm', params.volume, '', useVolume),
    getCommandTag('rate', params.rate, '', useRate),
    getCommandTag('pbas', params.pitch, '+', usePitch),
  ]
  const commandTags = commands.filter(h => h).join('')
  return stripCommandTags(prompt).split('\n').map(line => `${getResetTag()} ${commandTags} ${line}`).join(' ')
}

/**
 * Parses a single voice line and returns metadata.
 * 
 * This pertains to the lines printed when typing `say -v ?` - the voice list.
 * For example:
 * 
 *   Rishi               en_IN    # Hello! My name is Rishi.
 * 
 * Throws an error if the voice line does not conform to the expected format.
 */
export function parseVoiceLine(line: string) {
  // Split line into a section containing the name and language, and the example sentence.
  const [header, example] = line.split(/#\s/)
  
  // Headers always contain a language code; this is either like en_US or like ar_001.
  const items = header.trim().match(/^(.+?) ([a-z]{2}_([A-Z]{2}|[0-9]{3}))$/)
  if (!items) {
    throw new Error(`could not parse line: "${line}", "${items}"/"${example}"`)
  }
  // Voice names can have language information inside quotation marks, e.g. "Reed (Portuguese (Brazil))".
  const name = items[1].trim().match(/^(.+?)(\((.+?)\))?$/)
  if (name == null) {
    return null
  }

  // Split language by main and subcategory.
  const language = items[2].trim().split(/[_-]/)

  return {
    name: name[1].trim(),
    locale: name[3] ? name[3].trim() : null,
    language,
    example: example.trim()
  }
}
