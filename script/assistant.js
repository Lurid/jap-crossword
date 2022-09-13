const EngineSName = "JC-EngineSettings";
var EngineSettings = JSON.parse(localStorage.getItem(EngineSName));
if (EngineSettings == undefined) {
    console.log(EngineSName + " == undefined");
    localStorage.setItem(EngineSName, JSON.stringify({
        ShowName: true,
        ToolTipShow: true,
        AxisBacklight: true,
        AxisSticky: true,
        BottomPanelSticky: true,
        AutoCrossCompleting: true,
        Miniature: true,
        AutoMarkNumbers: true
    }));
}

const VisualSName = "JC-VisualSettings";
var VisualSettings = JSON.parse(localStorage.getItem(VisualSName));
if (VisualSettings == undefined) {
    console.log(VisualSName + " == undefined");
    localStorage.setItem(VisualSName, JSON.stringify({
        ShowName: true,
        ToolTipShow: true,
        AxisBacklight: true,
        AxisSticky: true,
        BottomPanelSticky: true,
        AutoCrossCompleting: true,
        Miniature: true,
        AutoMarkNumbers: true
    }));
}

var pageSettingsId = 5;
window.onblur = function (event) {
    if (pageActive == pageSettingsId) {
        SaveSettings();
    }
}

function SaveSettings() {
    localStorage.setItem(EngineSName, JSON.stringify(EngineSettings));
    localStorage.setItem(VisualSName, JSON.stringify(VisualSettings));
}