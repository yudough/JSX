//////////////////////////////////////////////////
//
// �I���������C���[�ȊO���\�� ver0.1
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// var
//////////////////////////////////////////////////
var document = activeDocument;
var active = document.activeLayer;

var visibilityList;
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function main(){
	var visibilityList = new Array();
	visibilityList = getVisibilityList(active);

	selectAllLayers();
	hideLayers();

	setVisibilityList(active, visibilityList);

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
	parentLayer.visible = true;

	if(parentLayer != activeDocument){
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
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
main();
