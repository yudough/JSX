//////////////////////////////////////////////////
//
// �I���������C���[��؂�o�� ver0.2
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

var tempLayerComp;
var newDocument;

var visibilityList = new Array();

var copyFlag;
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

	var visibilityList = new Array();
	visibilityList = getVisibilityList(active);

	selectAllLayers();
	hideLayers();

	setVisibilityList(active, visibilityList);

	displayParentLayers(active);
	selectLayer(active);

	clippingActiveLayer(active);

	loadActiveDocument();
	loadLayerComp();

	if(copyFlag){
		activeNewDocument();
	}
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

//�w�肵�����C���[��I��
function selectLayer(obj) {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putName(cTID("Lyr "), obj.name );
	desc.putReference(cTID("null"), ref);
	executeAction( cTID("slct"), desc, DialogModes.NO );
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

//�w�肵�����C���[�ȉ��̕\����Ԃ��擾
function getVisibilityList(obj){
	var list = new Array();

	list.push(obj.visible);

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			list = list.concat(getVisibilityList(obj.layers[i]));
		}
	}
	return list;
}

//�w�肵�����C���[�ȉ��̕\����Ԃ����X�g���甽�f
function setVisibilityList(obj, list){
	obj.visible = list.shift();

	if(obj.typename == "LayerSet"){
		var i;
		var nLayers = obj.layers.length;
		for(i=0; i<nLayers; i++){
			setVisibilityList(obj.layers[i], list);
		}
	}
}

//�w�肵�����C���[��؂�o��
function clippingActiveLayer(obj){

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
		copyFlag = true;

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
	
	}catch(e){
		copyFlag = false;
		alert("�I���������C���[�ɉ����܂܂�Ă��܂���B");
	}
}

//�؂�o�����h�L�������g���A�N�e�B�u�ɐݒ�
function activeNewDocument(){
	activeDocument = newDocument;
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
