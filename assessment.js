'use strict'; //'use strict';は、宣言後の記述ミスをエラーとして表示してくれる。
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');


/**
 * 指定した要素の子要素をすべて削除する。
 *@param{HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
    while (element.firstChild) {  //while文は、与えられた論理式がtrueである場合に実行し続ける制御文。firstChild(最初の子要素)がある限り、子要素を削除し続ける。
        //子要素がある限り削除
        element.removeChild(element.firstChild); //指定された子要素を削除する関数。診断結果を連続して表示しないために子要素を一度消す。
    }
};

assessmentButton.onclick = () => {
    const userName = userNameInput.value;
    if (userName.length === 0) {
        //名前が空の時は処理を終了する。
        return; //return;は戻り値なしにそこで処理を終了するという意味。ガード句。
    }
    //診断結果表示エリアの作成
    removeAllChildren(resultDivided);
    const header = document.createElement('h3'); //createElementは要素を作成する。
    header.innerText = '診断結果';
    resultDivided.appendChild(header);//div要素を親として、divタグにh3の見出しを子要素として追加するのでappendChild(子を追加する)という関数を使う。

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    //ツイートエリアの作成
    removeAllChildren(tweetDivided);
    const anchor = document.createElement('a');
    const hrefValue =
        'https://twitter.com/intent/tweet?button_hashtag=' +
        encodeURIComponent('あなたのいいところ') +
        '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue);//.setAttribute(name,value)指定した要素上に、新しい属性の追加、または既存の属性の値を変更します。 name=属性の名前を文字列で指定する。　value=属性に設定したい値を指定する。
    anchor.className = 'twitter-hashtag-button';
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたのいいところ';
    tweetDivided.appendChild(anchor)

    // widgets.js の設定
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);

    //エンターキーで診断
    userNameInput.onkeydown = event => {
        if(event.key === 'Enter'){
            assessmentButton.onclick();
        }
    }
};


const answers = [ //constで宣言された変数は、一度代入すると再代入できない(変数の値を後から変更できない)。これを定数という。まずはconst変数の使用を検討。
    '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
    '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
    '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
    '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
    '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
    '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
    '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
    '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
    '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
    '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
    '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
    '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
    '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
    '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
    '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
    '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。'
]; //ctrl + alt + ↓　でカーソルを増やせる。マルチカーソル機能。
/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param(引数) {string} userName(引数の名前) ユーザーの名前
 * @return(戻り値) {string} 診断結果　{string}は、値の型(JSの型は、数値、文字列、真偽値など)が「文字列{string}型」という意味。
 * →このJSD尾©という形式のコメントは、関数assessment(userName)の引数が文字列で、戻り値も文字列。ということを表している。
 */
function assessment(userName) {
    // 全文字のコード番号を取得してそれを足し合わせる。
    let sumOfCharCode = 0;
    for (let i = 0; i < userName.length; i++) { //入力された名前(引数)の文字数まで(i)という文字列の添え字をインクリメントする。
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);//for文で、文字一つずつコード番号を取得して足していく。
    }

    //文字のコード番号の合計を回答の数で割って、添え字の数値を求める。
    const index = sumOfCharCode % answers.length;　//index変数に、合計を回答の数で割った余りを代入
    let result = answers[index];　//余りを添え字にして、結果をresult変数に代入

    // {userrName}をユーザーネームに置き換える。
    //　replaceAll()関数。
    //使い方。'何かしらの文字列や文章'.replaceAll('変えたい文字列','実際に変える文字列')
    result = result.replaceAll('{userName}', userName)//resultに戻り値の再代入。→let変数じゃないといけない。
    return result;
};

// テストコード
console.assert(
    assessment('太郎') ===
    '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
);
console.assert(
    assessment('太郎') === assessment('太郎'),
    '入力が同じ名前なら同じ診断結果を出力する処理が正しくありません。'
);
