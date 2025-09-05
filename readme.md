[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fsayserver.svg)](https://badge.fury.io/js/@dada78641%2Fsayserver)

# SayServer

**Web service for generating TTS (text-to-speech).**

This package is built with streaming use cases in mind and makes a few opinionated choices. Every TTS request requires a *seed* (often a username), which is used to consistently select from a pool of random voices—so each user has their own unique "voice." For non-user messages, you can explicitly choose a specific voice instead.

The server can provide both **locally generated** TTS and **remote content**—for example, voices from the public Streamlabs Polly server.

## Usage

The server runs using [PM2](https://pm2.keymetrics.io/). See [the API documentation](/api.md) on how to call the server.

## Supported sources

* [SpeechSynthesizer](https://developer.apple.com/documentation/avfaudio/avspeechsynthesizer/) for local generation on macOS (`os.platform` must be `"darwin"`).
* Amazon Polly for remote generation, using the Streamlabs proxy.

## External links

* [lazypy.ro TTS tester](https://lazypy.ro/tts/)
* [macOS `say` command documentation](https://ss64.com/mac/say.html)
  * [Techniques for Customizing Synthesized Speech](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/SpeechSynthesisProgrammingGuide/FineTuning/FineTuning.html)
* [`wsay`, Windows "say"](https://github.com/p-groarke/wsay)

## License

MIT license.
