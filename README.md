# Azure OpenAI Live2D Virtual Assistant

This is a sample implementation of an application that displays models output by Live2D Cubism from Cubism Web Samples with Azure OpenAI and Azure Text to Speech.

It is used in conjunction with the Cubism Web Framework and Live2D Cubism Core.

## Directory structure
```
.
├─ .vscode          # Project settings directory for Visual Studio Code
├─ Core             # Directory containing Live2D Cubism Core
├─ Framework        # Directory containing source code such as rendering and animation functions
├─ website          # Directory containing source code for the web
├─ cdktf            # Directory containing source code for Azure deployment.
```

## Getting Started

### Prerequisites

- `\website\config.json`: Only fill in `ttsregion` and `ttsapikey`. `openaiurl` and `openaipikey` can be left blank as we are not using AI feature.
- **Azure Speech service**: No special requirement (location, pricing tier) is needed as we are only using the TTS synthesis service.

### How to run

1. Set up the repository
 ```
  git clone https://github.com/chikin030611/AzureOpenAILive2DChatbot-AzureStaticSite.git

  cd website

  npm install

  npm run build

  npm run serve
```
2. Find the `website/` folder and open it up.
3. At the top left corner, select file.
4. Select `website\config.json`

### How to use

By pressing question buttons on top of the chatbox, a question is asked. Avatar will speak aloud the answer.

Whenever a question is asked, avatar sends the certain preset answer text to Azure Speech service which will later send back a WAVE audio file to client. The Live2D model sync the lips and plays the audio.

