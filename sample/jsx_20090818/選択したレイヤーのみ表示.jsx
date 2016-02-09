//////////////////////////////////////////////////
//
// �I���������C���[�̂ݕ\�� ver0.2
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
	selectAllLayers();
	hideLayers();
	displayLayers(active);
	displayParentLayers(active);
	selectLayer(active);
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
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();

