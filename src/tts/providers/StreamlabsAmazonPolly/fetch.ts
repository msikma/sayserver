// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import fs from 'node:fs/promises'
import path from 'node:path'
import UserAgent from 'user-agents'
import type {PollySpeakJSON} from './types.ts'

// The URL that will generate TTS for us.
const baseURL: string = 'https://streamlabs.com/polly/speak'
// This referrer field must be set for the endpoint to respond.
const referer: string = 'https://streamlabs.com/'

/**
 * Requests the Streamlink Amazon Polly generation endpoint and returns the generated data.
 * 
 * This data will include a link to the generated audio file.
 */
export async function getSpeakData(prompt: string, voiceName: string): Promise<PollySpeakJSON> {
  const body = new URLSearchParams({
    text: prompt,
    voice: voiceName
  })
  const userAgent = getUserAgent()
  const res = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      'Referer': referer,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body,
  })
  const data = await res.json() as PollySpeakJSON
  return data
}

/**
 * Downloads the generated audio and saves it to the temporary directory.
 */
export async function downloadSpeakAudio(targetDir: string, data: PollySpeakJSON) {
  const url = data.speak_url
  const target = getSpeakFileTarget(targetDir, url)
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  await fs.writeFile(target, Buffer.from(arrayBuffer))
  return target
}

/**
 * Returns the filename we should save the speak audio to.
 */
function getSpeakFileTarget(targetDir: string, speakURL: string) {
  const url = new URL(speakURL)
  const ext = url.searchParams.get('OutputFormat')
  const target = path.join(targetDir, `out.${ext ?? 'mp3'}`)
  return target
}

/**
 * Returns a user agent.
 * 
 * A real user agent is required for the endpoint to respond.
 */
function getUserAgent() {
  const userAgent = new UserAgent({deviceCategory: 'desktop'})
  return userAgent.toString()
}
