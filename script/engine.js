var hStrings, vStrings, hStrings_converted, vStrings_converted;

var FullField, SizePlace, RowPlace, ColPlace, fField;

var fieldSkeleton, fieldSkeletonRev;

var drawModeEnable = false, drawModeState,
	drawStart, dragMiddle, dragEnd,
	drawMass = [];

var VerticalAxis, HorizontalAxis, ColBacklights, RowBacklights;


var mobileDevice = 'ontouchstart' in document.documentElement;

var solveStateElement;
/*
mobileDevice = detectMob();
function detectMob() {
	const toMatch = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /Windows Phone/i];

	return toMatch.some((toMatchItem) => { return navigator.userAgent.match(toMatchItem); });
}
*/



//var SolverParent;
//var SolverField;


document.addEventListener("DOMContentLoaded", function () {

	//SolverParent = document.getElementById("SolverContainer");
	//SolverField = new MyLine(SolverParent);

	FullField = document.getElementById("FieldBody");
	SizePlace = document.getElementById("fpart1-1");
	ColPlace = document.getElementById("fpart1-2");
	RowPlace = document.getElementById("fpart2-1");
	fField = document.getElementById("fpart2-2");

	FullField.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	}, false);


	if (mobileDevice) {
		FullField.style

		/*font-size: 4pt;
    	--cell-size: 8px;*/
		LittleTooltip.style.alignItems = "flex-end";
		LittleTooltipText.style.bottom = "1.5cm";
		//LittleTooltipOffset = [-15, -45]
		fField.addEventListener("touchstart", FieldEventDown);
		FullField.addEventListener('touchmove', FieldTouchMove);
		//fField.addEventListener("mouseover", FieldEventOver);
		fField.addEventListener("touchend", FieldTouchUp);
	}else {
		LittleTooltip.style.justifyContent = LittleTooltip.style.alignItems = "flex-start";
		LittleTooltipText.style.top = "0";
		LittleTooltipText.style.left = "0.5cm";
		//LittleTooltipOffset = [20, 0];
		fField.addEventListener("mousedown", FieldEventDown);
		FullField.addEventListener('mousemove', FieldMouseMove);
		fField.addEventListener("mouseover", FieldMouseOver);
		fField.addEventListener("mouseup", FieldMouseUp);
	}





	

	FullField.addEventListener("mouseup", (event) => {
		if (drawModeEnable == true) {
			drawModeEnable = false;
			fieldDrawEvent(drawStart, dragMiddle, true);
			ToolTipEnable(false);
		}
	})
	FullField.addEventListener("mouseleave", (event) => {
		if (drawModeEnable == true) {
			drawModeEnable = false;
			fieldDrawEvent(drawStart, dragMiddle, true);
			ToolTipEnable(false);
		}
		AxisBacklight(false);
	});

	VerticalAxis = document.getElementById("fpart2-3");
	HorizontalAxis = document.getElementById("fpart3-2");

	solveStateElement = document.getElementById("solveState");
	solveR_StateElement = document.getElementById("solveR_State");

	DrawField(allMassives[0]);
});

function FieldEventDown(event) {
	if (event.target.tagName == "TD") {
		if (mobileDevice) {
			event.preventDefault();
		}
		drawModeEnable = true;
		if (mobileDevice) {
			drawModeState = (event.target.value.realState == 0) ? 2 : 0;
			//???????????????? ???????? ?????? ???????????? "??????????????????" ?????? ?????????????????? ??????????????????
		} else {
			if (event.button == 0)
				drawModeState = (event.target.value.realState == 0) ? 2 : 0;
			else if (event.button == 2)
				drawModeState = (event.target.value.realState == 1) ? 0 : 1;
		}
		if (drawModeState != 1 && (EngineSettings.ToolTipShow == true))
			ToolTipState(drawModeState);
		drawMass = [];
		drawStart = event.target.value.coord;
		dragMiddle = event.target.value.coord;
		fieldDrawEvent(drawStart, dragMiddle);
	}
}

var LittleTooltipOffset;
function FieldMouseMove(event) {
	if (drawModeEnable == true && (EngineSettings.ToolTipShow == true)) {
		LittleTooltip.style.left = (event.clientX) + "px";
		LittleTooltip.style.top = (event.clientY) + "px";
	}
}

function MouseMoveTest(event) {
	console.log(event);
	console.log("event");
}

var cellHover;
function FieldTouchMove(event) {
	//console.log(event);
	//console.log(event.target.value.coord);
	//console.log(event.targetTouches[0].target.value.coord);
	if (drawModeEnable == true && (EngineSettings.ToolTipShow == true)) {
		let TarGet = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
		if (TarGet == null)
			console.log("TarGet == null");
		if (TarGet != null && fField.contains(TarGet) && TarGet != cellHover) {
			cellHover = TarGet;
			//console.log(TarGet);
			FieldTouchOver();
		}
		LittleTooltip.style.left = (event.touches[0].clientX) + "px";
		LittleTooltip.style.top = (event.touches[0].clientY) + "px";
	}
}

function FieldTouchOver() {
	if (cellHover.tagName == "TD") {

		//console.log("mouseover (" + cellHover.value.coord+")");
		if (EngineSettings.AxisBacklight == true) {
			AxisBacklight(cellHover.value.coord);
		}
		if (drawModeEnable == true) {
			//console.log("mouseover (" + cellHover.value.coord+")");
			fieldDrawEvent(drawStart, cellHover.value.coord);
			dragMiddle = cellHover.value.coord;
			//cellHover.classList.add("hoverable");
		}
	}
}

function FieldMouseOver(event) {
	if (event.target.tagName == "TD") {

		//console.log("mouseover (" + event.target.value.coord+")");
		if (EngineSettings.AxisBacklight == true) {
			AxisBacklight(event.target.value.coord);
		}
		if (drawModeEnable == true) {
			//console.log("mouseover (" + event.target.value.coord+")");
			fieldDrawEvent(drawStart, event.target.value.coord);
			dragMiddle = event.target.value.coord;
			//event.target.classList.add("hoverable");
		}
	}
}

function FieldMouseUp(event) {
	//console.log("mouseup (" + event.target.value.coord + ")");
	if (event.target.tagName == "TD" && fField.contains(event.target)) {
		drawModeEnable = false;
		dragEnd = event.target.value.coord;
		fieldDrawEvent(drawStart, dragMiddle, true);
	}
	ToolTipEnable(false);
}
function FieldTouchUp() {
	//console.log("mouseup (" + cellHover.value.coord + ")");
	if (cellHover.tagName == "TD" && fField.contains(cellHover)) {
		drawModeEnable = false;
		dragEnd = cellHover.value.coord;
		fieldDrawEvent(drawStart, dragMiddle, true);
	}
	ToolTipEnable(false);
}























function DrawField(massive) {
	hStrings = massive.top;
	vStrings = massive.left;
	let summH = hStrings.reduce((summ, x) => {
		let summ1 = x.reduce((summ2, y) => summ2 + y, 0);
		return summ + summ1;
	}, 0);
	//console.log("summH = " + summH);
	let summV = vStrings.reduce((summ, x) => {
		let summ1 = x.reduce((summ2, y) => summ2 + y, 0);
		return summ + summ1;
	}, 0);
	//console.log("summV = " + summV);
	//SizePlace.innerText = vStrings.length + " x " + hStrings.length;

	let vMaxLength = vStrings.reduce((max, a) => {
		if (a.length > max) max = a.length;
		return max;
	}, 0);

	vStrings_converted = [];
	vStrings.forEach((element, index) => {
		if (element.length < vMaxLength) {
			vStrings_converted[index] = [...Array(vMaxLength - element.length).fill(null), ...element];
		} else {
			vStrings_converted[index] = [...element];
		}
	});

	let vTemple = "<table class=\"suppTable\"><tbody>";
	for (let i = 0; i < vStrings.length; i++) {
		vTemple += "<tr>";
		for (let j = 0; j < vMaxLength; j++) {
			vTemple += "<td>" + ((vStrings_converted[i][j] == null) ? "" : vStrings_converted[i][j]) + "</td>";
		}
		if (i == 0) {
			vTemple += "<td rowspan=\"100%\" class=\"vSpacer\"></td>";
		}
		vTemple += "</tr>";
	}
	vTemple += "</tbody></table>";

	vTemple += "<table class=\"suppTableBack\"><tbody>";
	for (let j = 0; j < vStrings.length; j++) {
		vTemple += "<tr><td><div></div></td></tr>";
	}
	vTemple += "</tbody></table>";
	RowPlace.innerHTML = vTemple;

	RowBacklights = [];
	let tbodySupportV = RowPlace.children[1].children[0];
	//console.log(tbodySupportV);
	for (let i = 0; i < vStrings.length; i++) {
		RowBacklights[i] = tbodySupportV.children[i].children[0].children[0];
	}




	let hMaxLength = hStrings.reduce((max, a) => {
		if (a.length > max) max = a.length;
		return max;
	}, 0);


	hStrings_converted = [];
	hStrings.forEach((element, index) => {
		if (element.length < hMaxLength) {
			hStrings_converted[index] = [...Array(hMaxLength - element.length).fill(null), ...element];
		} else {
			hStrings_converted[index] = [...element];
		}
	});

	let hTemple = "<table class=\"suppTable\"><tbody>";
	for (let i = 0; i < hMaxLength; i++) {
		hTemple += "<tr>";
		for (let j = 0; j < hStrings.length; j++) {
			hTemple += "<td>" + ((hStrings_converted[j][i] == null) ? "" : hStrings_converted[j][i]) + "</td>";
		}
		hTemple += "</tr>";
	}
	hTemple += "<tr><td colspan=\"100%\" class=\"hSpacer\"></td></tr></tbody></table>";



	hTemple += "<table class=\"suppTableBack\"><tbody><tr>";
	for (let j = 0; j < hStrings.length; j++) {
		hTemple += "<td><div></div></td>";
	}
	hTemple += "</tr></tbody></table>";
	ColPlace.innerHTML = hTemple;

	ColBacklights = [];
	let tbodySupportH = ColPlace.children[1].children[0].children[0];
	for (let i = 0; i < hStrings.length; i++) {
		ColBacklights[i] = tbodySupportH.children[i].children[0];
	}



	let hAxisTemple = "<table><tbody><tr>";
	for (let i = 0; i < hStrings.length; i++) {
		let str = ""; let poluTon = false;
		if ((i % 5) == 0) {
			poluTon = true;
			str = hStrings.length - i;
		} else if (((i + 6) % 5) == 0) {
			str = i + 1;
		}
		hAxisTemple += "<td" + (poluTon ? " class=\"AxisBright\"" : "") + ">" + str + "</td>";
	}
	hAxisTemple += "</tr></tbody></table>";
	HorizontalAxis.innerHTML = hAxisTemple;

	let fTemple = "<table><tbody></tbody></table>";
	fField.innerHTML = fTemple;
	let fieldTBody = fField.children[0];

	let template = document.createElement('template');
	template.innerHTML = "<td class=\"s0\"><p></p></td>";
	let cellPrefab = template.content.firstChild;

	let vAxisTemple = "<table><tbody>";
	fieldSkeleton = [];
	fieldSkeletonRev = [];
	for (let j = 0; j < hStrings.length; j++) {
		fieldSkeletonRev[j] = [];
	}
	for (let i = 0; i < vStrings.length; i++) {
		let str = ""; let poluTon = false;
		if ((i % 5) == 0) {
			poluTon = true;
			str = vStrings.length - i;
		} else if (((i + 6) % 5) == 0) {
			str = i + 1;
		}
		vAxisTemple += "<tr><td" + (poluTon ? " class=\"AxisBright\"" : "") + ">" + str + "</td></tr>";


		let row = fieldTBody.insertRow(i);
		fieldSkeleton[i] = [];
		for (let j = 0; j < hStrings.length; j++) {

			fieldSkeleton[i][j] = cellPrefab.cloneNode(true);
			fieldSkeleton[i][j].value = { coord: [i, j], realState: 0, tempState: 0 };
			fieldSkeletonRev[j][i] = fieldSkeleton[i][j];
			row.appendChild(fieldSkeleton[i][j]);

			//fieldSkeleton
			//let template = document.createElement('template');
			//template.innerHTML = prefab;
		}
	}

	vAxisTemple += "</tbody></table>";
	VerticalAxis.innerHTML = vAxisTemple;
	StartSolverShow(false);
}

function StartSolverShow(state) {
	solveR_State.innerText = state ? "???????????????? ??????????????" : "???????????????? ???? ??????????????!";
}

function fieldDrawEvent(coord1, coord2, final = false, byProgramm = false) {
	let
		minX = Math.min(coord1[0], coord2[0]),
		maxX = Math.max(coord1[0], coord2[0]),
		minY = Math.min(coord1[1], coord2[1]),
		maxY = Math.max(coord1[1], coord2[1]),
		classListName = "s" + drawModeState,
		sizeX = (1 + maxX - minX),
		sizeY = (1 + maxY - minY);

	if (drawModeState != 1) {
		let textTooltip = [];
		if (sizeX > 1) textTooltip.push("" + sizeX);
		if (sizeY > 1) textTooltip.push("" + sizeY);
		if (byProgramm == false) {
			if (textTooltip.length > 0) {
				ToolTipEnable(true);
				LittleTooltipText.innerText = textTooltip.join(" x ");
			} else {
				ToolTipEnable(false);
			}
		}
	}

	let drawMassTemp = [];
	for (let i = minX; i <= maxX; i++) {
		for (let j = minY; j <= maxY; j++) {
			drawMassTemp.push(fieldSkeleton[i][j]);
		}
	}
	if (final == false) {
		drawMassTemp.filter(function (obj) { return drawMass.indexOf(obj) == -1; }).forEach(x => {
			x.classList.replace(x.classList[0], classListName);
			x.value.tempState = drawModeState;
		});
		drawMass.filter(function (obj) { return drawMassTemp.indexOf(obj) == -1; }).forEach(x => {
			x.classList.replace(x.classList[0], "s" + x.value.realState);
		});
		drawMass = drawMassTemp;
	} else {
		drawMassTemp.forEach(x => {
			x.classList.replace(x.classList[0], classListName);
			x.value.realState = drawModeState;
		});
		drawMass = [];
	}
}

var prevBacklightCoord = [0, 0];
function AxisBacklight(coords) {
	if ((prevBacklightCoord != undefined) && (prevBacklightCoord[0] < RowBacklights.length) && (prevBacklightCoord[1] < ColBacklights.length)) {
		RowBacklights[prevBacklightCoord[0]].classList.toggle("backLightEnable", false);
		ColBacklights[prevBacklightCoord[1]].classList.toggle("backLightEnable", false);
	}

	if (coords != false) {
		RowBacklights[coords[0]].classList.toggle("backLightEnable", true);
		ColBacklights[coords[1]].classList.toggle("backLightEnable", true);
		prevBacklightCoord = coords;
	}
}




class MyField {
	constructor(parent) {

	}
}