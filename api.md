# SayServer API

The server binds to port 8227 by default. All endpoints start with `/api`.

## Services

* DarwinSpeechSynthesizer
* Streamlabs

## Endpoints

**Endpoint:**

```
GET /api/voices
```

**Description:**

Returns a list of supported voices and generators.

**Response:**

```js
{
  "services": {
    "DarwinSpeechSynthesizer": {
      "type": "local",
      "sets": [
        "novelty",
        "gen1_male",
        "gen2_male",
        "gen1_female",
        "gen2_female"
      ],
      "voices": [
        "Cellos",
        "Bad News",
        "..."
      ]
    },
    "Streamlabs": {
      "type": "remote",
      "sets": [
        "polly_male",
        "polly_female"
      ],
      "voices": [
        "Brian",
        "Joanna",
        "..."
      ]
    }
  }
}
```

---

**Endpoint:**

```
POST /api/generate
```

**Description:**

Returns generated TTS data as Base64-encoded binary data, along with metadata.

**Request:**

```js
{
  "prompt": "This is the text that will be uttered.",
  "service": "DarwinSpeechSynthesizer",
  "seed": "seed string",
  "set": ["novelty"], // either a single string, or an array of strings
  "voice": []
}
```

Both "set" and "voice" must be passed—if one is not needed, pass an empty array.

If one or more "voice" entries is passed, "set" is ignored (this is used to pick specific voices regardless of which set they're in).

If multiple voices or sets are applicable, one is randomly picked according to the seed string.

**Response:**

```js
{
  "output": {
    "audio": "...base64 string...",
    "utterance": {
      "prompt": "This is the text that will be uttered.",
      "seed": "seed string",
      "set": ["novelty"],
      "voice": [],
      "service": "DarwinSpeechSynthesizer",
      "resolvedVoice": {
        "name": "Pipe Organ",
        "gender": "none",
        "generation": 1,
        "params": {
          "volume": 1,
          "rate": 1,
          "pitch": 0
        }
      }
    },
    "metadata": {
      "duration": 1.85025,
      "size": 6146,
      "formatName": "ogg",
      "codecName": "opus",
      "sampleRate": 48000,
      "channels": 1,
      "channelLayout": "mono"
    }
  },
  "time": "2025-09-05T22:44:28.663Z"
}
```
