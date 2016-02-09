//////////////////////////////////////////////////
//
// �w�肵�����C���[��؂�o�� ver0.3
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

//�؂�o������
var successList= new Array();
var errorList= new Array();

//�I�v�V����
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
//���C���[���̊m�F
function checkNumberOfLayers(limit){
	var num = getNumberOfLayers();
	if(num >  limit){
		try {
			var dlg = new Window("dialog");
			dlg.text = "���C���[���̊m�F";
			dlg.alignChildren = "left";

			dlg.add("statictext", undefined, "�����C���[��:"+num);
			dlg.add("statictext", undefined, "���C���[����"+limit+"�𒴂��Ă��܂��B���̂܂܎��s����Ɠ��삪�x���Ȃ�\��������܂��B");
			dlg.add("statictext", undefined, "���̂܂ܑ���𑱂��܂����H");
			
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
				//alert("����𒆎~���܂����B");
			}
		}catch(e) {
		}
	}else{
		main();
	}
}

//�����C���[�����擾
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

//�A�N�e�B�u�ȃh�L�������g��ۑ�
function saveActiveDocument(){
	document = activeDocument;
}

//�A�N�e�B�u�ȃh�L�������g��ǂݍ���
function loadActiveDocument(){
	activeDocument = document;
}

//���C���[�J���v��ۑ�
function saveLayerComp(){
	document.layerComps.add("tempLayerComp");
	tempLayerComp = document.layerComps["tempLayerComp"];
}

//���C���[�J���v��ǂݍ���
function loadLayerComp(){
	tempLayerComp.apply();
	tempLayerComp.remove();
}

//�A�N�V����ID�̎擾
//ref: http://morris-photographics.com/photoshop/scripts/index.html
function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}

//�S�Ẵ��C���[��I��
function selectAllLayers() {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	desc.putReference(cTID("null"), ref);
	executeAction(sTID("selectAllLayers"), desc, DialogModes.NO);
}

//�I���������C���[���\��
function hideLayers() {
	var desc = new ActionDescriptor();
	var list = new ActionList();
	var ref = new ActionReference();
	ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
	list.putReference(ref);
	desc.putList(cTID("null"), list);
	executeAction(cTID("Hd  "), desc, DialogModes.NO);
}

//�w�肵�����C���[�̐e���C���[��\��
function displayParentLayers(obj){
	var parentLayer = obj.parent
	
	if(parentLayer != activeDocument){
		parentLayer.visible = true;
		displayParentLayers(parentLayer);
	}else{
		return;
	}
}

//�w�肵�����C���[�ȉ���\��
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

//�_�C�A���O�̕\��
function displayDialog() {
	try {
		// begin dialog layout
		var dlg = new Window("dialog");
		dlg.text = "�w�背�C���[��؂�o��";
		dlg.alignChildren = "left";

		dlg.add("statictext", undefined, "���C���[�̏�������͂��Ă��������B");

		var nameParamPanel = dlg.add("group");
		nameParamPanel.orientation = "row";
		
		var prefixPanel = nameParamPanel.add("group");
		prefixPanel.orientation = "column";
		prefixPanel.alignChildren = "left";
		prefixPanel.add("statictext", undefined, "�ړ���");
		var prefixText = prefixPanel.add("edittext", undefined, "");
		prefixText.preferredSize.width = 80;
		
		var addMark = nameParamPanel.add("group");
		addMark.orientation = "column";
		addMark.alignChildren = "left";
		addMark.add("statictext", undefined, "�@");
		addMark.add("statictext", undefined, "+");
				
		var keywordPanel = nameParamPanel.add("group");
		keywordPanel.orientation = "column";
		keywordPanel.alignChildren = "left";
		keywordPanel.add("statictext", undefined, "�L�[���[�h");
		var keywordText = keywordPanel.add("edittext", undefined, "");
		keywordText.preferredSize.width = 80;
		
		var addMark = nameParamPanel.add("group");
		addMark.orientation = "column";
		addMark.alignChildren = "left";
		addMark.add("statictext", undefined, "�@");
		addMark.add("statictext", undefined, "+");
		
		var suffixPanel = nameParamPanel.add("group");
		suffixPanel.orientation = "column";
		suffixPanel.alignChildren = "left";
		suffixPanel.add("statictext", undefined, "�ڔ���");
		var suffixText = suffixPanel.add("edittext", undefined, "");
		suffixText.preferredSize.width = 80;

		var formulaPanel =  dlg.add("group");
		formulaPanel.and = formulaPanel.add("radiobutton",undefined , "AND�i���ׂĂ��܂ށj");
		formulaPanel.or = formulaPanel.add("radiobutton",undefined, "OR�i�����ꂩ���܂ށj");
		formulaPanel.and.value = true;
		
		var saveFileCheck = dlg.add("checkbox",undefined, "�t�@�C���ɕۑ�����");
		saveFileCheck.value = false;
		
		var saveOptionPanel = dlg.add("group");
		
		//�t�@�C���ۑ�
		var saveFilePanel = saveOptionPanel.add("panel", undefined, undefined);
		saveFilePanel.alignment = "fill";
		saveFilePanel.alignChildren = "left";
		
		saveFilePanel.add("statictext", undefined, "�ۑ��t�H���_");
		var selectFolderPanel = saveFilePanel.add("group");
		selectFolderPanel.alignment = "fill";
		selectFolderPanel.alignChildren = "left";
		
		var selectFolderText = selectFolderPanel.add("edittext", undefined, "");
		selectFolderText.preferredSize.width = 180;
		var selectFolderButton = selectFolderPanel.add("button",undefined, "�Q��");

		selectFolderButton.onClick = function(){
			var selectFolder = Folder.selectDialog( "�t�H���_��I�����Ă�������", selectFolderText.text );
			if ( selectFolder != null ) {
				selectFolderText.text = selectFolder.fsName.toString();
			}
		}
		
		saveFilePanel.add("statictext", undefined, "�t�@�C���^�C�v");
		
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
		var saveOptionPanel = saveFilePanel.add("panel", undefined, "�I�v�V����");
		saveOptionPanel.alignment = "fill";
		saveOptionPanel.orientation = "stack";

		var pngOptions = saveOptionPanel.add("group");
		pngOptions.bit24 = pngOptions.add("radiobutton",undefined , "24�r�b�g");
		pngOptions.bit8 = pngOptions.add("radiobutton",undefined, "8�r�b�g");
		pngOptions.bit24.value = true;
		
		// JPEG options
		var jpegOptions = saveOptionPanel.add("group");
		jpegOptions.add("statictext", undefined, "JPEG�掿");
		jpegOptions.quality = jpegOptions.add("edittext", undefined, "100");
		
		//�I�v�V�������\��
		jpegOptions.hide();
		
		//OK/Cancel�{�^��
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
		
		//�_�C�A���O���\������AOK or Cancel�{�^���������ꂽ�ꍇ (OK = 1, Cancel = 2)
		if (dlg.show() == 1) {
		
			//�����̐ݒ�
			if(formulaPanel.and.value == true){
				//AND����
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
				//OR����
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
				
				//�d���폜
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
	
			//�I�v�V�����̐ݒ�
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
			
			//�؂�o���J�n
			if(errorCount <3){
				startClipping(list);
			}else{
				alert("���������w�肳��Ă��܂���B");
			}
			
		}else{
			//alert("����𒆎~���܂����B");
		}
	}catch(e) {
		//�_�C�A���O�\���G���[
	}
}

//�S���C���[�̃��X�g���擾
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

//�w�肵���ړ���̃��C���[�̃��X�g���擾
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

//�w�肵���L�[���[�h�̃��C���[�̃��X�g���擾
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

//�w�肵���ڔ���̃��C���[�̃��X�g���擾
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

//�؂蔲�����J�n
function startClipping(list){
	var i;
	
	if(list.length > 0){
		var nList = list.length;
		for(i=0; i<nList; i++){
			clippingLayerSet(list[i]);
		}
		
		//�؂�o������
		var resultDlg = new Window("dialog");
		resultDlg.text = "�؂�o������";
		resultDlg.alignChildren = "left";

		if(successList.length > 0){
			//�؂�o�������C���[
			resultDlg.add("statictext", undefined, "�ȉ��̃��C���[��؂�o���܂����B");

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
			//�؂�o���Ȃ��������C���[
			resultDlg.add("statictext", undefined, "�ȉ��̃��C���[�ɂ͉����܂܂�Ă��܂���ł����B");

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

		//OK�{�^��
		var buttons = resultDlg.add("group");
		buttons.orientation = "row";
		buttons.alignment = "center";

		var okBtn = buttons.add("button");
		okBtn.text = "OK";
		okBtn.properties = {name: "ok"};

		resultDlg.center();

		if (resultDlg.show() == 1) {
			//�I��
		}
	}else{
		//�������}�b�`���Ȃ������ꍇ
		alert("���w�肵�������̃��C���[��������܂���ł����B");
	}
}

function clippingLayerSet(obj){
	
	//�����o������
	selectAllLayers();
	hideLayers();
	displayLayers(obj);
	displayParentLayers(obj);

	//���C���[�̉摜�͈͂��擾
	var boundsObj = obj.bounds;
	x1 = parseInt(boundsObj[0]);
	y1 = parseInt(boundsObj[1]);
	x2 = parseInt(boundsObj[2]);
	y2 = parseInt(boundsObj[3]);

�@//�w��͈͂�I��
	selectReg = [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];
	activeDocument.selection.select(selectReg);

	try {
		//�I��͈͂��������ăR�s�[
		activeDocument.selection.copy(true);
		
		//�I��������
		activeDocument.selection.deselect();

		//�V�K�h�L�������g���쐬
		var width = x2 - x1;
		var height = y2 - y1;
		var resolution = 72;
		var name = obj.name;
		var mode = NewDocumentMode.RGB;
		var initialFill = DocumentFill.TRANSPARENT;

		preferences.rulerUnits = Units.PIXELS;
		newDocument = documents.add(width, height, resolution, name, mode, initialFill);

		//�摜���y�[�X�g
		newDocument.paste();
		
		//�V�K���C���[�̉摜�͈͂��擾
		var newBoundsObj = newDocument.activeLayer.bounds;
		nx1 = parseInt(newBoundsObj[0]);
		ny1 = parseInt(newBoundsObj[1]);
		nx2 = parseInt(newBoundsObj[2]);
		ny2 = parseInt(newBoundsObj[3]);
		
		//�󔒂�����ꍇ�͐؂蔲��
		if((nx2 - nx1) != (x2 - x1) || (ny2 - ny1) != (y2 - y1)){
			newDocument.crop(newBoundsObj);
		}
		
		//�t�@�C���ɏ����o��
		
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
				
		//���̃h�L�������g���A�N�e�B�u�ɐݒ�
		loadActiveDocument();
		
		successList.push(obj);
	}catch(e){
		//�I��͈͂ɉ����܂܂�Ă��Ȃ��ꍇ
		errorList.push(obj);
	}
}

function savePNG(path, name, bit){
	var exp = new ExportOptionsSaveForWeb();
	exp.format = SaveDocumentType.PNG;
	exp.interlaced�@= false;

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
	exp.interlaced�@= false;
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
