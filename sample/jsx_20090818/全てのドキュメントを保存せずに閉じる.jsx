//////////////////////////////////////////////////
//
// �S�Ẵh�L�������g��ۑ������ɕ��� ver0.2
//
// by yoshihiko@goodmix.net
//
//////////////////////////////////////////////////
// function
//////////////////////////////////////////////////
function start() {
	//�m�F�_�C�A���O
	try {
			var dlg = new Window("dialog");
			dlg.text = "�S�Ẵh�L�������g��ۑ������ɕ���";
			dlg.alignChildren = "left";

			dlg.add("statictext", undefined, "�S�Ẵh�L�������g��ۑ������ɕ��܂��B");
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
				alert("����𒆎~���܂����B");
			}
		}catch(e) {
		}
}

function main(){
	closeWidthoutSave();
}

//�S�Ẵh�L�������g��ۑ������ɕ���
function closeWidthoutSave() {
	while (documents.length > 0)
	{
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}
//////////////////////////////////////////////////
// run
//////////////////////////////////////////////////
start();
