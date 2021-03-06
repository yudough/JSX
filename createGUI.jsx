/*
<javascriptresource>
<name>ExportWebImage</name>
<menu>automate</menu>
<about>jsxでイメージをjpgかpngでプレビューなしで書き出します。</about>
<category>Qscript</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

//初期化設定

preferences.rulerUnits = Units.PIXELS;// 単位を px に変更
doc = app.activeDocument;
var doc, saveFile, folder, fsName, tmpFileName, saveOpt,w, h, res, saveGUI, extType, extTypePNG, extTypeJPG, w, h, res, saveGUI, longSide, unitType, exportDoc, shortSide, longSideNum, exportLongSide,exportShortSide,resizeLong,resizeShort;
#include "learnFunc.jsx" //ファンクションのロード
doc = app.activeDocument;
//ダイアログボックスを作成------------------------------------------//
	//キャンバスサイズを取得
	docInfo();
	//ダイアログボックスの大きさ
	saveGUI = new Window("dialog", "書き出しオプション", [0,100,402,100+226]);
	//中央に配置
	saveGUI.center(); 
	//ドキュメントの長辺を取得
	docLongSide();
	//パネルの作成
	saveGUI.btnPnl = saveGUI.add("panel",[10,10,402-10,226-10],"");
	saveGUI.btnPnl = saveGUI.add("panel",[29,20,29+180,226-63],"サイズ設定");
	saveGUI.btnPnl = saveGUI.add("panel",[402-180,20,402-30,226-63],"拡張子設定")
	//長辺のテキストボックス
	saveGUI.sText = saveGUI.add("statictext",[40,60,40+90,60+20], "長辺のサイズ:");
	saveGUI.longSide = saveGUI.add("edittext",[125,58,125+70,58+20],longSide);
	
	//単位の指定
	saveGUI.sText = saveGUI.add("statictext",[86,98+10,86+42,108+10], "単位:");
	saveGUI.rBtn1 = saveGUI.add("radiobutton",[125,105,125+50,105+20], "px");
	saveGUI.rBtn2 = saveGUI.add("radiobutton",[125,128,125+50,128+20], "%");
	saveGUI.rBtn1.value = true; //初期値
	//書き出すファイルの種類の指定
	saveGUI.cBox1 = saveGUI.add("checkbox",[240,46,262+50,46+40], "PNG");
	saveGUI.cBox2 = saveGUI.add("checkbox",[240,80,262+50,80+40], "JPG");
	saveGUI.cBox1.value = true; //初期値
	//OKボタンの作成
	saveGUI.okBtn = saveGUI.add("button",[242,170,242+100,170+35],"いいと思います",{name:"ok"}); 
	//キャンセルボタン
	saveGUI.cancelBtn = saveGUI.add("button",[61,170,61+100,170+35], "ダメですね", {name: "cancel"});
//--------------------------------------------------------------//
//OK処理
	saveGUI.okBtn.onClick = function() {
		//入力されたデータチェック処理
		longSideNum = eval(saveGUI.longSide.text); //長辺サイズを数値型に変換
			// 長辺の長さが0以下でないか
		if(longSideNum < 1) {
			alert( '長辺のサイズが正しく入力されていません' );
	    return false;
	    }
			//単位の判断、サイズの算出(px指定の場合)
		var unitPixel = saveGUI.rBtn1.value;
		var unitPercent = saveGUI.rBtn2.value;
		if(!unitPercent) {
			unitType = "px"; 
			//長辺(longSideNum) / ドキュメントのサイズ(longSide)/100 = 比率
			exportDoc = resizeFix(resizeLong);
			//alert("比率は"+ exportDoc);
		}else{
			unitType = "percent";
			exportDoc = longSideNum;
		}

			//拡張子の判断
		extTypePNG = saveGUI.cBox1.value;
		extTypeJPG = saveGUI.cBox2.value;
		if(!extTypePNG && !extTypeJPG) {
			alert("拡張子が選択されておりません。どれか一つ以上チェックを入れて下さい。");
			return false;
		}
		
		saveOption(doc); //書き出し先を指定
		
			//拡張子別に書き出し
		if(extTypePNG == true) {
			extType = "png";
			saveOpt = exportPNG24();
			//alert("PNGで書き出します");
			saveToFile(doc);

		}
		if(extTypeJPG == true) {
			extType = "jpg";
			saveOpt = exportJPG();
			//alert("JPGで書き出します");
			saveToFile(doc);
		}
		alert(decodeURIComponent(folder.fsName + "\nの中に書き出しました"));
		revertToSnapshot(doc);
	//ダイアログボックスを閉じる
		saveGUI.close();

	}
//キャンセル処理
	saveGUI.cancelBtn.onClick = saveGUI.close();
//ダイアログボックスを表示する
	saveGUI.show();