// 固定の編集テキスト。項目を追加すると、件数表示と「ほかのお話」に自動で反映されます。
// ChatGPTの仕様に触れる項目は公開時にもsourceを再確認してください。
window.MADOU_TIPS = [
  {id:'clear-request',category:'chatgpt',title:'頼みたいことを、一文で。',body:'「何に使うか」「どんな形で欲しいか」を添えてみましょう。たとえば「旅行の持ち物を、雨の日も含めて短い一覧に」。伝えたい条件が整理できます。',source:'編集上の使い方の提案'},
  {id:'archive',category:'chatgpt',title:'片付ける前に、残すか考える。',body:'会話を一覧から片付けたいときは、アーカイブという方法もあります。削除とは扱いが異なります。大切な会話は、削除する前に保存方法を確かめておきましょう。',source:'https://help.openai.com/en/articles/8809935-deleting-and-archiving-chats-in-chatgpt',checked:'2026-11-07'},
  {id:'export',category:'chatgpt',title:'Exportの入口を確かめる。',body:'対応するアカウントでは、設定の「データコントロール」などからExportを依頼できます。利用可否や手順はアカウント・端末で異なるため、最新の公式ヘルプも確認してください。',source:'https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data',checked:'2026-11-07'},
  {id:'keep-export',category:'chatgpt',title:'元のZIPも、大切な記録です。',body:'Exportを取得したら、保存日が分かる名前で安全な場所に保管しておくと便利です。会話やアカウント情報を含むので、ダウンロードリンクやZIPの共有先にも気を配りましょう。',source:'https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data',checked:'2026-11-07'},
  {id:'search',category:'magiclogger',title:'最初は、覚えている一語から。',body:'検索ではタイトル・要約・原文・Category・Tagなどを探せます。複数語はAND検索です。見つからないときは言葉を減らし、広く探してみましょう。',source:'公開準備済みCore README／基本操作'},
  {id:'original',category:'magiclogger',title:'気になったら、原文へ。',body:'断章を見つけたら、会話の原文も読み返してみてください。前後にどんな話をしていたかが分かると、残していた言葉の意味を思い出しやすくなります。',source:'公開準備済みCore README／基本操作'},
  {id:'word-trail',category:'magiclogger',title:'次の手がかりは、会話の中に。',body:'開いた会話に気になる言葉があれば、その言葉で検索し直せます。同じ話題の記録を探す小さな方法です。サイトのデモにある関連リンクは、体験用に用意したものです。',source:'公開準備済みCore README／検索範囲'},
  {id:'bookmark',category:'magiclogger',title:'また読むところに、しおりを。',body:'繰り返し読みたい断章には、しおりを付けられます。手動Tagや資料への移動も使えます。「あとで使う」が決まったところから、少しずつ整理してみましょう。',source:'公開準備済みCore README／基本操作'},
  {id:'backup',category:'magiclogger',title:'バックアップを、別の場所にも。',body:'画面の「バックアップ」から手動で保存できます。自動バックアップもPC内に作られますが、大切な記録は別のドライブにも保管すると、PCの故障への備えになります。',source:'公開準備済みCore README／保存先とバックアップ'}
];
