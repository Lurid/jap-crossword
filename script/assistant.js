const lsEngineSName = "JC-EngineSettings";
var EngineSettings = JSON.parse(localStorage.getItem(lsEngineSName));
if (EngineSettings == undefined) {
	console.log(lsEngineSName + " == undefined");
	localStorage.setItem(lsEngineSName, JSON.stringify({
		ShowName: true,
		ToolTipShow: true,
		AxisBacklight: true,
		AxisSticky: true,
		BottomPanelSticky: true,
		AutoCrossCompleting: true,
		Miniature: true,
		AutoMarkNumbers: true,
		UltraSupport: false
	}));
}

const lsVisualSName = "JC-VisualSettings";
var VisualSettings = JSON.parse(localStorage.getItem(lsVisualSName));
if (VisualSettings == undefined) {
	console.log(lsVisualSName + " == undefined");
	localStorage.setItem(lsVisualSName, JSON.stringify({
		none: "none"
	}));
}

var pageSettingsId = 5;
window.onblur = function () {
	if (pageActive == pageSettingsId) {
		SaveSettings();
	}
}
window.onbeforeunload = function(){
	SaveSettings();
}

function SaveSettings() {
	localStorage.setItem(lsEngineSName, JSON.stringify(EngineSettings));
	localStorage.setItem(lsVisualSName, JSON.stringify(VisualSettings));
}

var ifaceShowName,
	ifaceShowName,
	ifaceToolTipShow,
	ifaceAxisBacklight,
	ifaceAxisSticky,
	ifaceBottomPanelSticky,
	ifaceAutoCrossCompleting,
	ifaceMiniature,
	ifaceAutoMarkNumbers,
	ifaceUltraSupport
	;
document.addEventListener("DOMContentLoaded", function () {
	ifaceShowName = document.getElementById("cbShowName");
	ifaceToolTipShow = document.getElementById("cbToolTipShow");
	ifaceAxisBacklight = document.getElementById("cbAxisBacklight");
	ifaceAxisSticky = document.getElementById("cbAxisSticky");
	ifaceBottomPanelSticky = document.getElementById("cbBottomPanelSticky");
	ifaceAutoCrossCompleting = document.getElementById("cbAutoCrossCompleting");
	ifaceMiniature = document.getElementById("cbMiniature");
	ifaceAutoMarkNumbers = document.getElementById("cbAutoMarkNumbers");
	ifaceUltraSupport = document.getElementById("cbUltraSupport");

	LoadStartSettings();
});

function LoadStartSettings() {
	ifaceShowName.checked = EngineSettings["ShowName"];
	ifaceToolTipShow.checked = EngineSettings["ToolTipShow"];
	ifaceAxisBacklight.checked = EngineSettings["AxisBacklight"];
	ifaceAxisSticky.checked = EngineSettings["AxisSticky"];
	ifaceBottomPanelSticky.checked = EngineSettings["BottomPanelSticky"];
	ifaceAutoCrossCompleting.checked = EngineSettings["AutoCrossCompleting"];
	ifaceMiniature.checked = EngineSettings["Miniature"];
	ifaceAutoMarkNumbers.checked = EngineSettings["AutoMarkNumbers"];
	ifaceUltraSupport.checked = EngineSettings["UltraSupport"];
}

function EngineSettingChange(element) {
	EngineSettings[element.id.substr(2)] = element.checked;
}