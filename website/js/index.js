const copyClickCode = (ele) => {
  const input = document.createElement('textarea');
  input.value = ele.dataset.mdicContent;
  const nDom = ele.previousElementSibling;
  const nDelay = ele.dataset.mdicNotifyDelay;
  const cDom = nDom.previousElementSibling;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 9999);
  document.execCommand('copy');
  document.body.removeChild(input);
  if (nDom.style.display === 'none') {
    nDom.style.display = 'block';
    cDom && (cDom.style.display = 'none');
    setTimeout(() => {
      nDom.style.display = 'none';
      cDom && (cDom.style.display = 'block');
    }, nDelay);
  }
};
$(document).ready(async () => {

  async function getUser() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }

  try {
    const user = await getUser();
    console.log(user);
    $("#logout").html("Logout (" + user.userDetails + ")");
    $(".member").show();
    $(".nonmember").hide();
  }
  catch (ex) {
    $(".member").hide();
    $(".nonmember").show();
  }

  function getUrlVars() {
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  const parameters = getUrlVars();
  if (parameters["taskId"]) {
    $("#taskId").val(parameters["taskId"]);
  }

  const md = markdownit({
    highlight: function (str, lang) { // markdown高亮
      try {
        return hljs.highlightAuto(str).value;
      } catch (__) { }

      return ""; // use external default escaping
    }
  });
  md.use(texmath, { // markdown katex公式
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  });
  const x = {
    getCodeLang(str = '') {
      const res = str.match(/ class="language-(.*?)"/);
      return (res && res[1]) || '';
    },
    getFragment(str = '') {
      return str ? `<span class="u-mdic-copy-code_lang">${str}</span>` : '';
    },
  };
  const strEncode = (str = '') => {
    if (!str || str.length === 0) {
      return '';
    }
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '\'')
      .replace(/"/g, '&quot;');
  };
  const getCodeLangFragment = (oriStr = '') => {
    return x.getFragment(x.getCodeLang(oriStr));
  };

  const enhanceCode = (render, options = {}) => (...args) => {
    /* args = [tokens, idx, options, env, slf] */
    const {
      btnText = 'Copy Code', // button text
      successText = 'Code Success', // copy-success text
      successTextDelay = 2000, // successText show time [ms]
      showCodeLanguage = true, // false | show code language
    } = options;
    const [tokens = {}, idx = 0] = args;
    const cont = strEncode(tokens[idx].content || '');
    const originResult = render.apply(this, args);
    const tpls = [
      '<br/>',
      '<div class="m-mdic-copy-wrapper">',
      `<div class="u-mdic-copy-notify" style="display:none;">${successText}</div>`,
      '<button ',
      'class="u-mdic-copy-btn j-mdic-copy-btn" ',
      `data-mdic-content="${cont}" `,
      `data-mdic-notify-delay="${successTextDelay}" `,
      `onclick="copyClickCode(this)">${btnText}</button>`,
      '</div>',
    ];
    const LAST_TAG = '</pre>';
    const newResult = originResult.replace(LAST_TAG, `${tpls.join('')}${LAST_TAG}`);
    return newResult;
  };

  const codeBlockRender = md.renderer.rules.code_block;
  const fenceRender = md.renderer.rules.fence;
  md.renderer.rules.code_block = enhanceCode(codeBlockRender);
  md.renderer.rules.fence = enhanceCode(fenceRender);

  md.renderer.rules.image = function (tokens, idx, options, env, slf) {
    var token = tokens[idx];
    token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
    token.attrSet("onload", "messagsEle.scrollTo(0, messagsEle.scrollHeight);this.removeAttribute('onload')");
    return slf.renderToken(tokens, idx, options)
  }

  const configFileInput = $("#configFileInput");
  configFileInput.change(() => {
    if (configFileInput.prop('files').length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        console.log("Config loaded!");
        $("#config").val(reader.result);
      });
      reader.readAsText(configFileInput.prop('files')[0]);
    }
    this.value = null;
  });

  const options = { mimeType: 'audio/webm;' };
  let recordedChunks = [];
  let mediaRecorder;

  const handleSuccess = stream => {
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    });
    mediaRecorder.addEventListener('stop', () => {
      startVoiceConversation($("#language").val(),
        new Blob(recordedChunks, { type: 'audio/webm' }));
    });
    mediaRecorder.start();
  };

  $('#recButton').addClass("notRec");
  $('#recButton').click(() => {
    if ($('#recButton').hasClass('notRec')) {
      $('#recButton').removeClass("notRec");
      $('#recButton').addClass("Rec");
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
    }
    else {
      $('#recButton').removeClass("Rec");
      $('#recButton').addClass("notRec");
      mediaRecorder.stop();
      recordedChunks = [];
    }
  });

  const msgerForm = get(".msger-inputarea");
  const msgerInput = get(".msger-input");
  const msgerChat = get(".msger-chat");

  // const questions = {
  //   1: "你可以做到啲咩？",
  //   2: "海洋公園有啲咩玩？",
  //   3: "海洋公園有啲咩食？",
  //   4: "海洋公園有啲咩動物？"
  // };

  // 「」
  const qnaMap = {
    "海洋公園有咩園區？": "海洋公園有兩個主要樂園，第一個係「海濱樂園」，入面有「威威天地」、「亞洲動物天地」同「夢幻水都」；"
                      + "第二個係「高峰樂園」，入面有「滑浪飛船」、「熱帶激流」、「動感快車」、「翻天覆地」同「極速之旅 ── VR太空探索」。"
                      + "你可以選擇搭纜車或者海洋列車上去，沿途可以欣賞到壯觀嘅山海美景。",
    "海洋公園有啲咩玩？": "海洋公園有好多嘢玩㗎。小朋友可以喺「威威天地」玩「彈彈屋」、「幻彩旋轉馬」。"
                      + "到咗「高峰樂園」，你可以玩「滑浪飛船」、「動感快車」，仲有「極速之旅 ── VR太空探索」。"
                      + "鍾意動物嘅可以去「亞洲動物天地」睇大熊貓、「尋鯊探秘」睇鯊魚，仲有「冰極天地」睇企鵝。"
                      + "園內有互動體驗，可以近距離接觸動物，了解佢哋嘅日常生活同保護野生動物嘅知識。海洋公園有好多嘢等緊你慢慢發掘！",
    "海洋公園有啲咩食？": "喺海洋公園，你可以搵到好多唔同嘅食肆選擇。例如，喺「夢幻水都」區，有「海龍王餐廳」同「爐炭燒」兩間特色餐廳。"
                      + "另外，如果你想嘆啲輕鬆嘅小食，「香港老大街」嘅「歡樂小食」同「動感天地」嘅「動感美食坊」都係好選擇。",
    "海洋公園有啲咩動物？": "海洋公園有好多種動物，例如「澳洲歷奇」有無尾熊、「亞洲動物天地」有大熊貓，同「冰極天地」有企鵝，全部都好可愛！"
                      + "園內有互動體驗，可以近距離接觸動物，了解佢哋嘅生活同保護野生動物嘅知識。"
                      + "你可以喺「約會海象」摸海象、餵食；喺「豚聚一刻」同海豚玩水，甚至成為一小時嘅名譽大熊貓護理員。"
                      + "參加「神秘深海之夜」，可以喺「海洋奇觀」內露營，徹夜觀賞超過5000條魚，可以同鯆魚、鎚頭鯊相伴。"
  };

  $("#question1Button").click(() => {
    askQuestion("海洋公園有咩園區？");
  });
  $("#question2Button").click(() => {
    askQuestion("海洋公園有啲咩玩？");
  });
  $("#question3Button").click(() => {
    askQuestion("海洋公園有啲咩食？");
  });
  $("#question4Button").click(() => {
    askQuestion("海洋公園有啲咩動物？");
  });

  function askQuestion(question) {
    var answer = qnaMap[question];
    appendMessage(PERSON_NAME, PERSON_IMG, "right", question);
    appendMessage(BOT_NAME, BOT_IMG, "left", answer);
    startSpeakingText($("#language").val(), answer);
    // startTextConversation($("#language").val(), answer);
  }

  // Icons made by Freepik from www.flaticon.com
  const BOT_IMG = "images/bot.png";
  const PERSON_IMG = "images/user.png";
  const BOT_NAME = "BOT";
  const PERSON_NAME = "You";

  msgerForm.addEventListener("submit", event => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    botResponse();
    msgerInput.value = "";
  });

  function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    message = `<div class='markdown-body'>${md.render(text)}</div>`;
    const msgHTML = `
<div class="msg ${side}-msg">
  <div class="msg-img" style="background-image: url(${img})"></div>

  <div class="msg-bubble">
    <div class="msg-info">
      <div class="msg-info-name">${name}</div>
      <div class="msg-info-time">${formatDate(new Date())}</div>
    </div>

    <div class="msg-text">${message}</div>
  </div>
</div>
`;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }

  function botResponse() {
    const msgText = msgerInput.value;
    startTextConversation($("#language").val(), msgText);
  }

  //Handle query
  const $query = $('#query');
  $query.on('change', () => {
    appendMessage(PERSON_NAME, PERSON_IMG, "right", $query.val());
  });

  const $reply = $('#reply');
  let value = "";
  $reply.on('change', () => {
    newValue = $reply.val();
    console.log(newValue);
    console.log(value);
    if (newValue && value !== newValue) {
      appendMessage(BOT_NAME, BOT_IMG, "left", newValue);
      value = newValue;
    }
  });

  // Utils
  function get(selector, root = document) {
    return root.querySelector(selector);
  }

  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }

  function csvToArrayOfObjects(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].replace(/["]/g, "").split(',');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j].replace(/["]/g, "");
      }
      result.push(obj);
    }
    return result.sort((p1, p2) => p1.act.localeCompare(p2.act));
  }

  const promptsSelect = $("#awesome-chatgpt-prompts");
  fetch('https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv')
    .then(response => response.text())
    .then(csvData => {
      const arrayOfObjects = csvToArrayOfObjects(csvData);
      console.log(arrayOfObjects);
      arrayOfObjects.map((item) => {
        promptsSelect.append(new Option(item.act, item.prompt));
      });
      promptsSelect.on("change", () => {
        $("#prompt").val(promptsSelect.val());
      });
      promptsSelect.on("click", () => {
        $("#prompt").val(promptsSelect.val());
      });
    });

  function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
  }

  async function startCapture(displayMediaOptions) {
    let captureStream = null;
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }

  function saveVideoToJpg() {
    const canvas = document.createElement('canvas');
    // canvas.width = videoElem.videoWidth;
    // canvas.height = videoElem.videoHeight;
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.getContext('2d').drawImage(videoElem, 0, 0);
    const img = canvas.toDataURL('image/jpeg');
    $.post("/api/screens", img, (result) => {
      console.log(result);
    }).fail((err) => {
      console.log(err);
    });
    return img;
  }


  const videoElem = document.getElementById('shared-screen');
  let capturer;
  let capturing = false;
  $('#share-screen').on('click', () => {
    if (capturing) {
      capturing = false;
      clearInterval(capturer);
      stopCapture();
    } else {
      capturing = true;
      startCapture({
        video: {
          displaySurface: "window",
        },
        audio: false,
      }).then((stream) => {
        videoElem.srcObject = stream;
        capturer = setInterval(saveVideoToJpg, 5000);
        stream.getVideoTracks()[0].onended = function () {
          capturing = false;
          clearInterval(capturer);
        };
      }).catch((err) => {
        console.log(err);
      });
    }
  });

});
