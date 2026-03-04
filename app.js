// タイプ定義：象限ごとの文言
const typeDefinitions = {
  A: {
    name: "対面ドリブン・オフィス型",
    subtitle: "対話と連携で加速する、オフィス主戦場タイプ",
    description:
      "集中しやすい場所はオフィス寄り、出社の目的は業務上の対面コミュニケーションやフィードバックに近いタイプです。対面での打ち合わせや、その場での認識合わせがあると仕事が前に進みやすく、上司やメンバーと直接話しながら評価・フィードバックや方向性のすり合わせをしていくことで力を発揮しやすいスタイルです。",
    hints:
      "重要な案件や調整が多い日は、あえて出社日の候補にするなど、「対話が価値になる時間」をオフィスに集める工夫がおすすめです。",
  },
  B: {
    name: "コミュニティ志向・オフィス型",
    subtitle: "人とのつながりでモチベーションが上がるタイプ",
    description:
      "集中しやすい場所はオフィス寄り、出社の目的は雑談や気軽なコミュニケーションに近いタイプです。同僚の顔が見える環境や、ちょっとした会話からヒントを得たり気分転換ができることで、仕事のペースが作りやすくなります。",
    hints:
      "雑談しやすいスペースや、同僚と隣り合える席を選んだり、出社日をチームメンバーと合わせておくことで、オフィスのメリットを活かしやすくなります。",
  },
  C: {
    name: "リモート主軸・要所対面型",
    subtitle: "ふだんはオンライン、要所は対面で押さえるタイプ",
    description:
      "集中しやすい場所は自宅寄り、出社の目的は業務上の対面コミュニケーションやフィードバックに近いタイプです。日常的な作業や思考時間は自宅などの落ち着いた環境でパフォーマンスを発揮しやすく、一方で重要な意思決定や難しい調整などは対面で行う価値を感じるスタイルです。",
    hints:
      "集中が必要なタスクは在宅日にまとめ、四半期レビューやプロジェクトキックオフなど「ここは対面にしたい」という場面だけ計画的に出社する、といったメリハリが合いやすいでしょう。",
  },
  D: {
    name: "ソロ集中・ゆるつながり型",
    subtitle: "普段は一人で、たまにゆるくつながりたいタイプ",
    description:
      "集中しやすい場所は自宅寄り、出社の目的は雑談や気軽なコミュニケーションに近いタイプです。一人で作業できる静かな環境の方が仕事を進めやすく感じやすい一方で、人とのつながりや雑談そのものも嫌いではなく、たまに会って近況を話したい気持ちもあるスタイルです。",
    hints:
      "在宅での集中環境を自分なりに整えつつ、出社日やオフラインイベントは「顔合わせの日」と割り切って、関係づくりや気分転換に使うとバランスが取りやすくなります。",
  },
  boundary: {
    name: "ハイブリッド・バランス型",
    subtitle: "どちらにも適応しやすい、しなやかスタイル",
    description:
      "自宅とオフィス、雑談と業務対面のどちらか一方に強く偏らず、状況に合わせて働き方を切り替えやすいタイプです。その日の仕事内容やメンバー構成、プライベートの予定などに応じて、「今日はオフィス」「今日は自宅」と柔軟に選びやすいスタイルです。",
    hints:
      "「このパターンの仕事は在宅」「このパターンは出社」といった自分なりの基準を少しずつ決めておくことで、よりストレスの少ない働き方を設計しやすくなります。",
  },
};

// DOM の取得
const form = document.getElementById("diagnosis-form");
const surveyForm = document.getElementById("survey-form");
const summarySection = document.getElementById("summary-section");
const resultSection = document.getElementById("result-section");
const coordDisplay = document.getElementById("coord-display");
const typeName = document.getElementById("type-name");
const typeSubtitle = document.getElementById("type-subtitle");
const typeDescription = document.getElementById("type-description");
const typeHints = document.getElementById("type-hints");

// SVG の点
const userPoint = document.getElementById("user-point");

// フォーム送信時の処理
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const q1Value = getRadioValue("q1");
  const q2Value = getRadioValue("q2");

  if (q1Value === null || q2Value === null) {
    alert("Q1とQ2の両方に回答してください。");
    return;
  }

  const x = Number(q1Value);
  const y = Number(q2Value);

  // 座標表示（不要ならこの行ごと削除可）
  coordDisplay.textContent = `(${x}, ${y})`;

  // タイプ判定
  const typeKey = judgeType(x, y);
  const typeInfo = typeDefinitions[typeKey];

  typeName.textContent = typeInfo.name;
  typeSubtitle.textContent = typeInfo.subtitle;
  typeDescription.textContent = typeInfo.description;
  typeHints.textContent = typeInfo.hints;

  // マップ上にプロット
  plotPoint(x, y);

  // 結果セクションを表示
  resultSection.classList.remove("hidden");

  // 将来拡張用：結果送信フック（現状は何もしない）
  // sendResult({ x, y, type: typeKey });
});

// ラジオボタンの値を取得
function getRadioValue(name) {
  const nodes = document.querySelectorAll(`input[name="${name}"]`);
  for (const node of nodes) {
    if (node.checked) {
      return node.value;
    }
  }
  return null;
}

// タイプ判定：境界型を優先
function judgeType(x, y) {
  if (x === 0 || y === 0) {
    return "boundary";
  }

  if (x > 0 && y > 0) return "A"; // オフィス集中 × 業務対面
  if (x > 0 && y < 0) return "B"; // オフィス集中 × 雑談
  if (x < 0 && y > 0) return "C"; // 自宅集中 × 業務対面
  if (x < 0 && y < 0) return "D"; // 自宅集中 × 雑談

  // 念のため
  return "boundary";
}

// SVG上に点を配置する
function plotPoint(x, y) {
  // x,y ∈ {-2,-1,0,1,2} を SVG座標 0〜200 に線形変換
  const minVal = -2;
  const maxVal = 2;
  const svgMin = 0;
  const svgMax = 200;

  const cx = mapRange(x, minVal, maxVal, svgMin, svgMax);
  // SVG は yが下に行くほど値が大きいので、上下を反転
  const cy = mapRange(-y, minVal, maxVal, svgMin, svgMax);

  userPoint.setAttribute("cx", cx);
  userPoint.setAttribute("cy", cy);
}

// 数値を別レンジに変換
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  );
}

// 将来の保存拡張用：今は何もしない
function sendResult(payload) {
  // 例：
  // fetch("https://script.google.com/macros/s/xxxxxxx/exec", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
}
function summarizeResult() {
  // Q1,Q2 の値を取得（既存の関数を使う）
  const q1Value = getRadioValue("q1");
  const q2Value = getRadioValue("q2");

  if (q1Value === null || q2Value === null) {
    alert("まず Q1 と Q2 に回答し、マップにプロットしてください。");
    return;
  }

  // アンケート側の回答を取得
  const formData = new FormData(surveyForm);
  const answers = {};

  // Q1,Q2 は数値 → 軸の意味用の日本語に変換
  answers.q1 = mapQ1Label(Number(q1Value));
  answers.q2 = mapQ2Label(Number(q2Value));

  // 単一選択 Q3,4,6,7
  ["q3", "q4", "q6", "q7"].forEach((name) => {
    const v = formData.get(name);
    if (v) answers[name] = v;
  });

  // 複数選択 Q5
  const q5Values = formData.getAll("q5");
  if (q5Values.length > 0) {
    answers.q5 = q5Values;
  }

  // 自由記述 Q8,9
  ["q8", "q9"].forEach((name) => {
    const v = formData.get(name);
    if (v && v.trim() !== "") {
      answers[name] = v.trim();
    }
  });

  // ❶ 四象限を再表示
  renderSummaryQuadrant(Number(q1Value), Number(q2Value));

  // ❷ 設問＋回答を画面に列挙
  renderAnswerList(answers);

  // ❷＋❸＋❹ をコピー用テキストに
  const copyText = buildCopyText(answers);
  const copyBuffer = document.getElementById("copy-buffer");
  copyBuffer.value = copyText;

  // クリップボードへコピー
  navigator.clipboard
    .writeText(copyText)
    .then(() => {
      document.getElementById("copy-message").classList.remove("hidden");
    })
    .catch(() => {
      document.getElementById("copy-message").classList.remove("hidden");
    });

  // ❶❷❹ を表示
  summarySection.classList.remove("hidden");
}
function mapQ1Label(x) {
  switch (x) {
    case -2:
      return "圧倒的に自宅で集中しやすい";
    case -1:
      return "やや自宅で集中しやすい";
    case 0:
      return "自宅・オフィスどちらとも言えない";
    case 1:
      return "ややオフィスで集中しやすい";
    case 2:
      return "圧倒的にオフィスで集中しやすい";
    default:
      return "";
  }
}

function mapQ2Label(y) {
  switch (y) {
    case -2:
      return "雑談・気軽なコミュニケーション目的の出社が近い";
    case -1:
      return "どちらかといえば雑談寄りの目的";
    case 0:
      return "雑談と業務対面のどちらとも言えない";
function renderSummaryQuadrant(x, y) {
  const point = document.getElementById("summary-user-point");
  const minVal = -2;
  const maxVal = 2;
  const svgMin = 0;
  const svgMax = 200;

  const cx = mapRange(x, minVal, maxVal, svgMin, svgMax);
  const cy = mapRange(-y, minVal, maxVal, svgMin, svgMax);

  point.setAttribute("cx", cx);
  point.setAttribute("cy", cy);
}
function renderAnswerList(answers) {
  const answerList = document.getElementById("answer-list");
  answerList.innerHTML = "";

  const questionText = {
    q1: "Q1. 仕事に最も集中しやすい場所はどちらですか？",
    q2: "Q2. 出社する主な目的として、どちらが近いですか？",
    q3: "Q3. 自宅またはオフィスでの集中を妨げる要因について教えてください。",
    q4: "Q4. 「集中が必要な業務」を行う際、最適だと思う場所を教えてください。",
    q5: "Q5. 出社することで得たいものを教えてください。",
    q6: "Q6. 雑談や偶発的なコミュニケーションをどの程度重視しますか？",
    q7: "Q7. 対面での評価やフィードバックをどの程度重要だと感じますか？",
    q8: "Q8. 理想的な勤務スタイル（出社と在宅の割合）についてご意見があれば教えてください。",
    q9: "Q9. 出社やリモートワークの運用に関して、ご希望や改善点があれば自由にお書きください。",
  };

  Object.keys(questionText).forEach((key) => {
    if (answers[key] === undefined) return;
    const p = document.createElement("p");
    const label = questionText[key];

    if (Array.isArray(answers[key])) {
      p.textContent = `${label} ${answers[key].join(" / ")}`;
    } else {
      p.textContent = `${label} ${answers[key]}`;
    }
    answerList.appendChild(p);
  });
}

function buildCopyText(answers) {
  const questionText = {
    q1: "Q1. 仕事に最も集中しやすい場所はどちらですか？",
    q2: "Q2. 出社する主な目的として、どちらが近いですか？",
    q3: "Q3. 自宅またはオフィスでの集中を妨げる要因について教えてください。",
    q4: "Q4. 「集中が必要な業務」を行う際、最適だと思う場所を教えてください。",
    q5: "Q5. 出社することで得たいものを教えてください。",
    q6: "Q6. 雑談や偶発的なコミュニケーションをどの程度重視しますか？",
    q7: "Q7. 対面での評価やフィードバックをどの程度重要だと感じますか？",
    q8: "Q8. 理想的な勤務スタイル（出社と在宅の割合）についてご意見があれば教えてください。",
    q9: "Q9. 出社やリモートワークの運用に関して、ご希望や改善点があれば自由にお書きください。",
  };

  const lines = [];
  lines.push("▼働き方のスタイルに関する質問と回答");

  Object.keys(questionText).forEach((key) => {
    if (answers[key] === undefined) return;
    const label = questionText[key];
    if (Array.isArray(answers[key])) {
      lines.push(`${label} ${answers[key].join(" / ")}`);
    } else {
      lines.push(`${label} ${answers[key]}`);
    }
  });
  lines.push("");

  lines.push(
    "これらは回答者の働き方のスタイルに関する回答結果である。これらの質問・回答を踏まえて、回答者はどんな働き方をしていったらよいかアドバイスがほしい。"
  );
  lines.push("");

  lines.push(
    "生成AIで回答を分析するためのプロンプトと一緒にコピーしました。ご自身の生成AIで分析してみてくださいね！"
  );

  return lines.join("\n");
}
