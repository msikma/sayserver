// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import path from 'node:path'
import {voiceSets} from './sets.ts'
import {getSpeakData, downloadSpeakAudio} from './fetch.ts'
import type {RemoteProvider, Voice} from '../../../types.ts'

export default class StreamlabsAmazonPolly implements RemoteProvider {
  private static _name: string = 'StreamlabsAmazonPolly'
  private static _type: string = 'remote'
  private static _title: string = 'Amazon Polly'

  async generateUtterance(target: string, voice: Voice, prompt: string) {
    const data = await getSpeakData(prompt, voice.name)
    const audio = await downloadSpeakAudio(path.dirname(target), data)
    return {
      target: audio,
      cmd: [''],
      prompt,
    }
  }

  static getVoiceSetInfo() {
    const sets: string[] = []
    const voices: string[] = []
    for (const [name, set] of Object.entries(voiceSets)) {
      sets.push(name)
      for (const voice of set.voices) {
        voices.push(typeof voice === 'string' ? voice : voice.name!)
      }
    }
    return {
      name: this._name,
      data: {
        type: this._type,
        sets,
        voices,
      }
    }
  }

  getVoiceSets() {
    return voiceSets
  }

  static get name() {
    return StreamlabsAmazonPolly._name
  }

  get type() {
    return StreamlabsAmazonPolly._type
  }

  static isUsable(): boolean {
    return true
  }
}
