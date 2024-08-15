# Azure OpenAI Live2D 虛擬助手

\* 此README使用了AI由英文翻譯為中文。如有任何句子不通順的問題，建議參考英文版。

這是一個應用程式的範例實現，該應用程式顯示由 Live2D Cubism 從 Cubism Web Samples 輸出的模型，並結合 Azure OpenAI 和 Azure 語音合成。

它與 Cubism Web Framework 和 Live2D Cubism Core 一起使用。

## 目錄結構
```
.
├─ .vscode          # Visual Studio Code 的專案設定目錄
├─ Core             # 包含 Live2D Cubism Core 的目錄
├─ Framework        # 包含渲染和動畫功能等源代碼的目錄
├─ website          # 包含網頁源代碼的目錄
├─ cdktf            # 包含 Azure 部署源代碼的目錄
```

## 入門指南

### 先決條件

- **Azure 語音服務**：不需要特殊要求（位置、定價等級），因為我們只使用 TTS 合成服務。

### 如何運行

1. 設置存儲庫
 ```
# 複製存儲庫
git clone https://github.com/chikin030611/AzureOpenAILive2DChatbot-AzureStaticSite.git

# 切換到 'website' 文件夾
cd AzureOpenAILive2DChatbot-AzureStaticSite/website

# 安裝 package.json 中指定的必要依賴
npm install

# 構建項目
npm run build

# 本地服務項目
npm run serve

```
2. 找到 `\website\config.json` ，並填寫`ttsregion`和`ttsapikey` (**Azure 語音服務**)。 `openaiurl` 和 `openaipikey` 可以留空，因為我們不使用 AI 功能。
3. 找到 `website/` 文件夾並打開它。
4. 在左上角，選擇文件。
5. 選擇 `website\config.json`

### 如何使用

按下聊天框頂部的問題按鈕，會提出一個問題。虛擬助手會大聲說出答案。

每當提出問題時，虛擬助手會將預設的答案文本發送到 Azure 語音服務，然後 Azure 語音服務會將 WAVE 音頻文件發送回客戶端。Live2D 模型會同步嘴唇並播放音頻。

## 工作原理

工作原理類似於 [Live2DCSharpSDK](https://github.com/chikin030611/Live2D-dotnet)。請參閱該存儲庫中的 README 中的 "How It Works" 部分。
