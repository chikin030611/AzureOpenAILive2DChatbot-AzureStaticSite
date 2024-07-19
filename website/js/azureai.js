"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureAi = void 0;
var lapppal_1 = require("../src/lapppal");
var webm_to_wav_converter_1 = require("webm-to-wav-converter");
var languagetovoicemapping_1 = require("../src/languagetovoicemapping");
var AzureAi = /** @class */ (function () {
    function AzureAi() {
        var config = document.getElementById("config").value;
        if (config !== "") {
            var json = JSON.parse(config);
            this._openaiurl = json.openaiurl;
            this._openaipikey = json.openaipikey;
            this._ttsregion = json.ttsregion;
            this._ttsapikey = json.ttsapikey;
        }
        else {
            this._openaiurl = "api/chatgpt";
            this._openaipikey = "";
            this._ttsUrl = "api/text-to-speech";
            this._sttUrl = "api/speech-to-text";
            this._ttsapikey = "";
        }
        this._inProgress = false;
    }
    AzureAi.prototype.getOpenAiAnswer = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var conversations, messages, createPrompt, systemMessage, m, repsonse, json, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._openaiurl === undefined || this._inProgress || prompt === "")
                            return [2 /*return*/, ""];
                        this._inProgress = true;
                        conversations = document.getElementById("conversations").value;
                        messages = conversations ? JSON.parse(conversations) : [];
                        lapppal_1.LAppPal.printMessage(prompt);
                        createPrompt = function (system_message, messages) {
                            if (messages.length === 1)
                                messages.unshift(system_message);
                            return messages;
                        };
                        systemMessage = { "role": "system", "content": "You are a helpful assistant." };
                        messages.push({ role: "user", content: prompt });
                        m = {
                            "taskId": $("#taskId").val(),
                            "model": $("#model").val(),
                            "prompt": createPrompt(systemMessage, messages),
                            "max_tokens": +$("#max_tokens").val(),
                            "temperature": +$("#temperature").val(),
                            "frequency_penalty": +$("#frequency_penalty").val(),
                            "presence_penalty": +$("#presence_penalty").val(),
                            "top_p": +$("#top_p").val(),
                            "best_of": +$("#best_of").val(),
                            "stop": ["<|im_end|>"]
                        };
                        return [4 /*yield*/, fetch(this._openaiurl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'api-key': this._openaipikey,
                                },
                                body: JSON.stringify(m)
                            })];
                    case 1:
                        repsonse = _a.sent();
                        return [4 /*yield*/, repsonse.json()];
                    case 2:
                        json = _a.sent();
                        answer = json.choices[0].message.content;
                        messages.push({ role: "assistant", content: answer });
                        lapppal_1.LAppPal.printMessage(answer);
                        $("#reply").val(answer).trigger('change');
                        $("#cost").text("(Left: $" + json.left.toFixed(5) + " Just Used: $" + json.cost.toFixed(6) + ")");
                        document.getElementById("conversations").value = JSON.stringify(messages);
                        return [2 /*return*/, answer];
                }
            });
        });
    };
    AzureAi.prototype.getSpeechUrl = function (language, text) {
        return __awaiter(this, void 0, void 0, function () {
            var requestHeaders, voice, ssml, ttsUrl, response, blob, url, audio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestHeaders = new Headers();
                        if (this._ttsapikey !== "") {
                            requestHeaders.set('Content-Type', 'application/ssml+xml');
                            requestHeaders.set('X-Microsoft-OutputFormat', 'riff-8khz-16bit-mono-pcm');
                            requestHeaders.set('Ocp-Apim-Subscription-Key', this._ttsapikey);
                        }
                        else {
                            requestHeaders.set('Content-Type', 'application/json');
                        }
                        voice = languagetovoicemapping_1.LANGUAGE_TO_VOICE_MAPPING_LIST.find(function (c) { return c.voice.startsWith(language) && c.IsMale === false; }).voice;
                        ssml = "\n<speak version='1.0' xml:lang='".concat(language, "'>\n  <voice xml:lang='").concat(language, "' xml:gender='Female' name='").concat(voice, "'>\n    ").concat(text, "\n  </voice>\n</speak>");
                        ttsUrl = this._ttsregion ? "https://".concat(this._ttsregion, ".tts.speech.microsoft.com/cognitiveservices/v1") : this._ttsUrl;
                        return [4 /*yield*/, fetch(ttsUrl, {
                                method: 'POST',
                                headers: requestHeaders,
                                body: ssml
                            })];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        return [4 /*yield*/, response.blob()];
                    case 2:
                        blob = _a.sent();
                        url = window.URL.createObjectURL(blob);
                        audio = document.getElementById('voice');
                        audio.src = url;
                        lapppal_1.LAppPal.printMessage("Load Text to Speech url");
                        this._inProgress = false;
                        return [2 /*return*/, url];
                }
            });
        });
    };
    AzureAi.prototype.getTextFromSpeech = function (language, data) {
        return __awaiter(this, void 0, void 0, function () {
            var requestHeaders, wav, sttUrl, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lapppal_1.LAppPal.printMessage(language);
                        requestHeaders = new Headers();
                        requestHeaders.set('Accept', 'application/json;text/xml');
                        requestHeaders.set('Content-Type', 'audio/wav; codecs=audio/pcm; samplerate=16000');
                        requestHeaders.set('Ocp-Apim-Subscription-Key', this._ttsapikey);
                        return [4 /*yield*/, (0, webm_to_wav_converter_1.getWaveBlob)(data, false, { sampleRate: 16000 })];
                    case 1:
                        wav = _a.sent();
                        sttUrl = this._ttsregion ? "https://".concat(this._ttsregion, ".stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1") : this._sttUrl;
                        return [4 /*yield*/, fetch(sttUrl + "?language=".concat(language), {
                                method: 'POST',
                                headers: requestHeaders,
                                body: wav
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        $("#query").val(json.DisplayText).trigger('change');
                        return [2 /*return*/, json.DisplayText];
                }
            });
        });
    };
    return AzureAi;
}());
exports.AzureAi = AzureAi;
