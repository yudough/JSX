//////////////////////////////////////////////////
//
// 指定したレイヤーを切り出し ver0.3
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// const
//////////////////////////////////////////////////
var DEFAULT_LIMIT = 255;
//////////////////////////////////////////////////
// var
//////////////////////////////////////////////////
var document = activeDocument;
var active = document.activeLayer;

//切り出し結果
var successList= new Array();
var errorList= new Array();

//オプション
var saveFileFlag = false;
var saveFolderPath = "";
var saveFileType = "";
var pngBit = 24;
var jpegQuality = 100;
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function start(){
	checkNumberOfLayers(DEFAULT_LIMIT);
}
//レイヤー数の確認
function checkNumberOfLayers(limit){
	var num = getNumberOfLayers();
	if(num >  limit){
		try {
			var dlg = new Window("dialog");
			dlg.text = "レイヤー数の確認";
			dlg.alignChildren = "left";

			dlg.add("statictext", undefined, "総レイヤー数:"+num);
			dlg.add("statictext", undefined, "レイヤー数が"+limit+"を超えています。このまま実行すると動作が遅くなる可能性があります。");
			dlg.add("statictext", undefined, "このまま操作を続けますか？");
			
			var buttons = dlg.add("group");
			buttons.orientation = "row";
			buttons.alignment = "center";

				var okBtn = buttons.add("button");
				okBtn.text = "OK";
				okBtn.properties = {name: "ok"};

				var cancelBtn = buttons.add("button");
				cancelBtn.text = "Cancel";
				cancelBtn.properties = {name: "cancel"};

			dlg.center();
			// end dialog layout
			if (dlg.show() == 1) {
				main();
			}else{
				//alert("操作を中止しました。");
			}
		}catch(e) {
		}
	}else{
		main();
	}
}

//総レイヤー数を取得
function getNumberOfLayers(){
	var ref = new ActionReference();
	ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID("NmbL") )
	ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	return executeActionGet(ref).getInteger(charIDToTypeID("NmbL"));
}

function main(){

	saveActiveDocument();
	saveLayerComp();

	displayDialog();

	loadLayerComp();

}

//アクティブなドキュメントを保存
function saveActiveDocument(){
	document = activeDocument;
}

//アクティブなドキュメントを読み込み
function loadActiveDocument(){
	activeDocument = document;
}

//レイヤーカンプを保存
function saveLayerComp(){
	document.layerComps.add("tempLayerComp");
	tempLayerComp = document.layerComps["tempLayerComp"];
}

//レイヤーカンプを読み込み
function loadLayerComp(){
	tempLayerComp.apply();
	tempLayerComp.remove();
}

//アクションIDの取得
//ref: http://morris-photographics.com/photoshop/scripts/index.html
function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}

//全てのレイヤーを選択
function selectAllLayers() {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	desc.putReference(cTID("null"), ref);
	executeAction(sTID("selectAllLayers"), desc, DialogModes.NO);
}

//選択したレイヤーを非表示
function hideLayers() {
	var desc = new ActionDescriptor();
	var list = new ActionList();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	list.putReference(ref);
	desc.putList(cTID("null"), list);
	executeAction(cTID("Hd  "), desc, DialogModes.NO);
}

//指定したレイヤーの親レイヤーを表示
function displayParentLayers(obj){
	var parentLayer = obj.parent
	
	if(parentLayer != activeDocument){
		parentLayer.visible = true;
		displayParentLayers(parentLayer);
	}else{
		return;
	}
}

//指定したレイヤー以下を表示
function displayLayers(obj){
	obj.visible = true;

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			displayLayers(obj.layers[i]);
		}
	}
}

//ダイアログの表示
function displayDialog() {
	try {
		// begin dialog layout
		var dlg = new Window("dialog");
		dlg.text = "指定レイヤーを切り出し";
		dlg.alignChildren = "left";

		dlg.add("statictext", undefined, "レイヤーの条件を入力してください。");

		var nameParamPanel = dlg.add("group");
		nameParamPanel.orientation = "row";
		
		var prefixPanel = nameParamPanel.add("group");
		prefixPanel.orientation = "column";
		prefixPanel.alignChildren = "left";
		prefixPanel.add("statictext", undefined, "接頭語");
		var prefixText = prefixPanel.add("edittext", undefined, "");
		prefixText.preferredSize.width = 80;
		
		var addMark = nameParamPanel.add("group");
		addMark.orientation = "column";
		addMark.alignChildren = "left";
		addMark.add("statictext", undefined, "　");
		addMark.add("statictext", undefined, "+");
				
		var keywordPanel = nameParamPanel.add("group");
		keywordPanel.orientation = "column";
		keywordPanel.alignChildren = "left";
		keywordPanel.add("statictext", undefined, "キーワード");
		var keywordText = keywordPanel.add("edittext", undefined, "");
		keywordText.preferredSize.width = 80;
		
		var addMark = nameParamPanel.add("group");
		addMark.orientation = "column";
		addMark.alignChildren = "left";
		addMark.add("statictext", undefined, "　");
		addMark.add("statictext", undefined, "+");
		
		var suffixPanel = nameParamPanel.add("group");
		suffixPanel.orientation = "column";
		suffixPanel.alignChildren = "left";
		suffixPanel.add("statictext", undefined, "接尾語");
		var suffixText = suffixPanel.add("edittext", undefined, "");
		suffixText.preferredSize.width = 80;

		var formulaPanel =  dlg.add("group");
		formulaPanel.and = formulaPanel.add("radiobutton",undefined , "AND（すべてを含む）");
		formulaPanel.or = formulaPanel.add("radiobutton",undefined, "OR（いずれかを含む）");
		formulaPanel.and.value = true;
		
		var saveFileCheck = dlg.add("checkbox",undefined, "ファイルに保存する");
		saveFileCheck.value = false;
		
		var saveOptionPanel = dlg.add("group");
		
		//ファイル保存
		var saveFilePanel = saveOptionPanel.add("panel", undefined, undefined);
		saveFilePanel.alignment = "fill";
		saveFilePanel.alignChildren = "left";
		
		saveFilePanel.add("statictext", undefined, "保存フォルダ");
		var selectFolderPanel = saveFilePanel.add("group");
		selectFolderPanel.alignment = "fill";
		selectFolderPanel.alignChildren = "left";
		
		var selectFolderText = selectFolderPanel.add("edittext", undefined, "");
		selectFolderText.preferredSize.width = 180;
		var selectFolderButton = selectFolderPanel.add("button",undefined, "参照");

		selectFolderButton.onClick = function(){
			var selectFolder = Folder.selectDialog( "フォルダを選択してください", selectFolderText.text );
			if ( selectFolder != null ) {
				selectFolderText.text = selectFolder.fsName.toString();
			}
		}
		
		saveFilePanel.add("statictext", undefined, "ファイルタイプ");
		
		var fiteTypeList = saveFilePanel.add("dropdownlist");
		fiteTypeList.alignment = "left";

		fiteTypeList.add("item", "PNG");
		fiteTypeList.add("item", "JPEG");
		
		fiteTypeList.onChange = function() {
			
			pngOptions.hide();
			jpegOptions.hide();
			
			switch(this.selection.index) {
				case 0:
					saveOptionPanel.show();
					pngOptions.show();
					break;
				case 1:
					saveOptionPanel.show();
					jpegOptions.show();
					break;
				default:
					break;
			}
		}
		
		saveFileType = "PNG";
		fiteTypeList.items[0].selected = true;
		
		// PNG options
		var saveOptionPanel = saveFilePanel.add("panel", undefined, "オプション");
		saveOptionPanel.alignment = "fill";
		saveOptionPanel.orientation = "stack";

		var pngOptions = saveOptionPanel.add("group");
		pngOptions.bit24 = pngOptions.add("radiobutton",undefined , "24ビット");
		pngOptions.bit8 = pngOptions.add("radiobutton",undefined, "8ビット");
		pngOptions.bit24.value = true;
		
		// JPEG options
		var jpegOptions = saveOptionPanel.add("group");
		jpegOptions.add("statictext", undefined, "JPEG画質");
		jpegOptions.quality = jpegOptions.add("edittext", undefined, "100");
		
		//オプションを非表示
		jpegOptions.hide();
		
		//OK/Cancelボタン
		var buttons = dlg.add("group");
		buttons.orientation = "row";
		buttons.alignment = "center";

			var okBtn = buttons.add("button");
			okBtn.text = "OK";
			okBtn.properties = {name: "ok"};

			var cancelBtn = buttons.add("button");
			cancelBtn.text = "Cancel";
			cancelBtn.properties = {name: "cancel"};

		dlg.center();
		// end dialog layout
		
		//ダイアログが表示され、OK or Cancelボタンが押された場合 (OK = 1, Cancel = 2)
		if (dlg.show() == 1) {
		
			//条件の設定
			if(formulaPanel.and.value == true){
				//AND条件
				var errorCount= 0;
				var list = getLayerList(activeDocument);
				
				if(prefixText.text.length > 0){
					list = getLayerWithPrefix(list, prefixText.text);
				}else{
					errorCount++
				}
				if(keywordText.text.length > 0){
					list = getLayerWithKeyword(list, keywordText.text);
				}else{
					errorCount++
				}
				if(suffixText.text.length > 0){
					list = getLayerWithSuffix(list, suffixText.text);
				}else{
					errorCount++
				}
			}else if(formulaPanel.or.value == true){
				//OR条件
				var errorCount = 0;
				var list = getLayerList(activeDocument);
				
				var sumList = new Array();
				var resultList = new Array();
				
				if(prefixText.text.length > 0){
					var prefixList = getLayerWithPrefix(list, prefixText.text);
					sumList = sumList.concat(prefixList);
				}else{
					errorCount++
				}
				if(keywordText.text.length > 0){
					var keywordList = getLayerWithKeyword(list, keywordText.text);
					sumList = sumList.concat(keywordList);
				}else{
					errorCount++
				}
				if(suffixText.text.length > 0){
					var suffixList = getLayerWithSuffix(list, suffixText.text);
					sumList = sumList.concat(suffixList);
				}else{
					errorCount++
				}
				
				//重複削除
				var i, j;
				var sumListLength = sumList.length;
				for(i = 0;i<sumListLength;i++){
					var same = false;
					for(j = i+1;j<sumListLength;j++){
						if(sumList[i] == sumList[j]){
							same = true;
						}
					}
					if(same == false){
						resultList.push(sumList[i])
					}
				}

				list = resultList;
			}
	
			//オプションの設定
			saveFileFlag = saveFileCheck.value;
			
			saveFolderPath = selectFolderText.text + "/";
			
			switch(fiteTypeList.selection.index) {
				case 0:
					saveFileType = "PNG";
					break;
				case 1:
					saveFileType = "JPEG";
					break;
			}

			if(pngOptions.bit24.value == true){
				pngBit = 24;
			}else{
				pngBit = 8;
			}
			
			jpegQuality = jpegOptions.quality.text;
			
			//切り出し開始
			if(errorCount <3){
				startClipping(list);
			}else{
				alert("※条件が指定されていません。");
			}
			
		}else{
			//alert("操作を中止しました。");
		}
	}catch(e) {
		//ダイアログ表示エラー
	}
}

//全レイヤーのリストを取得
function getLayerList(obj){
	var i;
	var list = new Array();

	var nLayer= obj.layers.length;
	for(i=0; i<nLayer; i++){
		list.push(obj.layers[i]);
		if(obj.layers[i].typename == "LayerSet"){
			list = list.concat(getLayerList(obj.layers[i]));		
		}
	}

	return list;
}

//指定した接頭語のレイヤーのリストを取得
function getLayerWithPrefix(list, prefix){
	var i;
	var layerList = new Array();
	
	var nList = list.length;
	for(i=0; i<nList; i++){
		if(list[i].name.indexOf(prefix) == 0){
			layerList.push(list[i]);
		}
	}

	return layerList;
}

//指定したキーワードのレイヤーのリストを取得
function getLayerWithKeyword(list, keyword){
	var i;
	var layerList = new Array();

	var nList = list.length;
	for(i=0; i<nList; i++){
		if(list[i].name.indexOf(keyword) > -1){
			layerList.push(list[i]);
		}
	}

	return layerList;
}

//指定した接尾語のレイヤーのリストを取得
function getLayerWithSuffix(list, suffix){
	var i;
	var layerList = new Array();
	
	var nList = list.length;
	for(i=0; i<nList; i++){
		if(list[i].name.lastIndexOf(suffix) == (list[i].name.length - suffix.length)){
			layerList.push(list[i]);
		}
	}

	return layerList;
}

//切り抜きを開始
function startClipping(list){
	var i;
	
	if(list.length > 0){
		var nList = list.length;
		for(i=0; i<nList; i++){
			clippingLayerSet(list[i]);
		}
		
		//切り出し結果
		var resultDlg = new Window("dialog");
		resultDlg.text = "切り出し結果";
		resultDlg.alignChildren = "left";

		if(successList.length > 0){
			//切り出したレイヤー
			resultDlg.add("statictext", undefined, "以下のレイヤーを切り出しました。");

			resultDlg.successTextPanel = resultDlg.add("panel");		
			resultDlg.successTextPanel.orientation = "column";
			resultDlg.successTextPanel.alignChildren = "left";
			resultDlg.successTextPanel.alignment = "fill";

			var successText = "";
			var nList = successList.length;
			for(i=0; i<nList; i++){
				
				successText += "- " + successList[i].name;

				if(i < nList-1){
					successText += "\n";
				}
			}
			resultDlg.successTextPanel.add("statictext", undefined, successText, {multiline:true});
			resultDlg.successTextPanel.alignment = "fill";
		}

		if(errorList.length > 0){
			//切り出せなかったレイヤー
			resultDlg.add("statictext", undefined, "以下のレイヤーには何も含まれていませんでした。");

			resultDlg.errorTextPanel = resultDlg.add("panel");		
			resultDlg.errorTextPanel.orientation = "column";
			resultDlg.errorTextPanel.alignChildren = "left";
			resultDlg.errorTextPanel.alignment = "fill";

			var errorText = "";
			var nList = errorList.length;
			for(i=0; i<nList; i++){
				errorText += errorList[i].name;

				if(i < nList-1){
					errorText += "\n";
				}
			}
			resultDlg.errorTextPanel.add("statictext", undefined, errorText, {multiline:true});
			resultDlg.errorTextPanel.alignment = "fill";
		}

		//OKボタン
		var buttons = resultDlg.add("group");
		buttons.orientation = "row";
		buttons.alignment = "center";

		var okBtn = buttons.add("button");
		okBtn.text = "OK";
		okBtn.properties = {name: "ok"};

		resultDlg.center();

		if (resultDlg.show() == 1) {
			//終了
		}
	}else{
		//条件がマッチしなかった場合
		alert("※指定した条件のレイヤーが見つかりませんでした。");
	}
}

function clippingLayerSet(obj){
	
	//書き出し準備
	selectAllLayers();
	hideLayers();
	displayLayers(obj);
	displayParentLayers(obj);

	//レイヤーの画像範囲を取得
	var boundsObj = obj.bounds;
	x1 = parseInt(boundsObj[0]);
	y1 = parseInt(boundsObj[1]);
	x2 = parseInt(boundsObj[2]);
	y2 = parseInt(boundsObj[3]);

　//指定範囲を選択
	selectReg = [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];
	activeDocument.selection.select(selectReg);

	try {
		//選択範囲を結合してコピー
		activeDocument.selection.copy(true);
		
		//選択を解除
		activeDocument.selection.deselect();

		//新規ドキュメントを作成
		var width = x2 - x1;
		var height = y2 - y1;
		var resolution = 72;
		var name = obj.name;
		var mode = NewDocumentMode.RGB;
		var initialFill = DocumentFill.TRANSPARENT;

		preferences.rulerUnits = Units.PIXELS;
		newDocument = documents.add(width, height, resolution, name, mode, initialFill);

		//画像をペースト
		newDocument.paste();
		
		//新規レイヤーの画像範囲を取得
		var newBoundsObj = newDocument.activeLayer.bounds;
		nx1 = parseInt(newBoundsObj[0]);
		ny1 = parseInt(newBoundsObj[1]);
		nx2 = parseInt(newBoundsObj[2]);
		ny2 = parseInt(newBoundsObj[3]);
		
		//空白がある場合は切り抜き
		if((nx2 - nx1) != (x2 - x1) || (ny2 - ny1) != (y2 - y1)){
			newDocument.crop(newBoundsObj);
		}
		
		//ファイルに書き出し
		
		if(saveFileFlag == true){
			switch(saveFileType){
				case "PNG":
					savePNG(saveFolderPath, name, pngBit);
					break;
				case "JPEG":
					saveJPEG(saveFolderPath, name, jpegQuality)
					break;
			}
		}
				
		//元のドキュメントをアクティブに設定
		loadActiveDocument();
		
		successList.push(obj);
	}catch(e){
		//選択範囲に何も含まれていない場合
		errorList.push(obj);
	}
}

function savePNG(path, name, bit){
	var exp = new ExportOptionsSaveForWeb();
	exp.format = SaveDocumentType.PNG;
	exp.interlaced　= false;

	if(bit == 8){
		exp.PNG8 = true;
	}else{
		exp.PNG8 = false;
	}

	fileObj = new File(getFileName(path + name, "png"));
	
	activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, exp);
}
function saveJPEG(path, name, quality){
	var exp = new ExportOptionsSaveForWeb();
	exp.format = SaveDocumentType.JPEG;
	exp.interlaced　= false;
	exp.optimized= false;
	exp.quality = quality;

	fileObj = new File(getFileName(path + name, "jpg"));
	
	activeDocument.exportDocument(fileObj, ExportType.SAVEFORWEB, exp);
}
function getFileName(filename, ext){
	var count = 0;
	var newFileName = "";

	newFileName = filename + "." + ext
	var file = new File(newFileName);
	
	while(file.exists != false){
		count +=1;
		newFileName = filename + count + "." + ext
		file = new File(newFileName);
	}
	return newFileName;
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
