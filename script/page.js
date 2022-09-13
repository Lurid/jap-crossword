var LittleTooltip;

document.addEventListener("DOMContentLoaded", function () {
	pageCount = (document.getElementById("HeaderMenu").children[0].children[0].children.length);
	for (let i = 1; i <= pageCount; i++) {
		tabPages[i] = document.getElementById("tabPage" + i);
		tabButtons[i] = document.getElementById("tabButton" + i);
	}
	TabPage(1);

	LittleTooltip = document.getElementById("tooltip");
	select1_1 = document.getElementById("select1_1");

	ToolTipEnable(false);
	ToolTipState(2);

	LoadCrosswords();
});

var tabPages = [];
var tabButtons = [];
var pageCount;
var pageActive;
function TabPage(PageID) {
	for (let i = 1; i <= pageCount; i++) {
		tabPages[i].style.display = (i == PageID) ? "flex" : "none";
		tabButtons[i].style.borderColor = (i == PageID) ? 'var(--text-color1)' : '';
	}
	if (pageActive == 4) {
		SaveSettings();
	}
	pageActive = PageID;
}

function ToolTipState(state) {
	LittleTooltip.classList.replace(LittleTooltip.classList[0], "ttState" + state);
}
function ToolTipEnable(enable) {
	LittleTooltip.classList.toggle("ttEnabled", enable);
}

var select1_1;
function LoadCrosswords() {
	let template = document.createElement('template');
	//console.log(template.content);
	allMassives.forEach((element, index) => {
		template.innerHTML = "<option value=\""+index+"\">#" + element.number + " \"" + element.name + "\"</option>";
		select1_1.appendChild(template.content.cloneNode(true));

	});
}

function SelectCrossword() {
	let id = select1_1.value;
	DrawField(allMassives[id]);
}





/*
панель цветов работает если у поля имеются минимум два цвета

при двух цветах происходит мгновенное переключение на второй (неактивный) цвет

при трёх и более цветах показывается меню с выбором цвета
*/

