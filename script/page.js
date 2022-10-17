
var tabPages = [], tabButtons = [],
	pageCount, pageActive;


const lsPageName = "JC-Page",
	defaultLSPage = {
		pageActive: 1,
		activeCrossword1: 0,
		activeCrossword1DATA: {}
	};
var lsPage, saveLSPage = true;


if (localStorage.hasOwnProperty(lsPageName) == false) {
	localStorage.setItem(lsPageName, JSON.stringify(defaultLSPage));
}
lsPage = JSON.parse(localStorage.getItem(lsPageName));
pageActive = lsPage.pageActive;
if (pageActive == undefined) {
	lsPage.pageActive = pageActive = 1;
}

window.onbeforeunload = function () {
	if (saveLSPage == true) {
		lsPage.pageActive = pageActive;
		localStorage.setItem(lsPageName, JSON.stringify(lsPage));
	}
}


//document.getElementById("viewport").setAttribute('content', "width=device-width, initial-scale="+(1 / window.devicePixelRatio));
document.addEventListener("DOMContentLoaded", function () {
	pageCount = (document.getElementById("HeaderMenu").children[0].children[0].children.length);
	for (let i = 1; i <= pageCount; i++) {
		tabPages[i] = document.getElementById("tabPage" + i);
		tabButtons[i] = document.getElementById("tabButton" + i);
	}
	TabPage(pageActive);

	window.addEventListener("scroll", (event) => {
		event.preventDefault();
		event.stopPropagation();
	}, false);

	LittleTooltip = document.getElementById("tooltip");
	LittleTooltipText = LittleTooltip.children[0];
	select1_1 = document.getElementById("select1_1");

	ToolTipEnable(false);
	ToolTipState(2);

	LoadCrosswords();
});

function TabPage(PageID) {
	for (let i = 1; i <= pageCount; i++) {
		tabPages[i].style.display = (i == PageID) ? "flex" : "none";
		tabButtons[i].classList.toggle("activeTabButton", ((i == PageID) ? true : false));
		//tabButtons[i].style.borderColor = (i == PageID) ? 'var(--text-color1)' : '';
	}
	if (pageActive == 4) {
		SaveSettings();
	}
	pageActive = PageID;
}

var LittleTooltip, LittleTooltipText;
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
		template.innerHTML = "<option value=\"" + index + "\">#" + element.number + " \"" + element.name + "\"</option>";
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








