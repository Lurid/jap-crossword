document.addEventListener("DOMContentLoaded", function () {

});

class MyLine {
	constructor(id_, chisla_, elements_, coords_) {
		this.id = id_;
		this.chisla = chisla_;
		this.chislaL = chisla_.length;
		this.chislaSumm = chisla_.reduce((summ, val) => summ + val);
		this.elements = elements_;
		this.elementsL = elements_.length;
		this.coords = coords_;

		this.freeCellsCount = this.elementsL - (this.chisla.reduce((summ, a) => summ + a, 0) + this.chislaL - 1);
		this.notBlackCellsCount = this.chislaL - 1 + this.freeCellsCount;

		this.calcCellsAbsolute = chisla_.map(x => {
			let z = x + this.freeCellsCount; if (z >= x * 2) return 0; else return z - 2 * (z - x);
		}).reduce((summ, i) => summ + i);
		if (this.calcCellsAbsolute != 0) {
			if ((this.calcCellsAbsolute + this.notBlackCellsCount) == this.elementsL) {
				this.calcCellsConcern = 1;
			} else {
				this.calcCellsConcern = this.calcCellsAbsolute / this.elementsL;
			}
		} else {
			this.calcCellsConcern = 0;
		}
	}
	id;
	resultDrawed;
	solved = false;

	chisla = [];
	chislaL;
	chislaSumm;
	elements;
	elementsL;
	coords;

	complexity;
	calcCellsAbsolute;
	calcCellsConcern;

	MinValuesMassive;
	freeCellsCount = 0;
	notBlackCellsCount = 0;

	solPart0 = [];
	solPart1 = [];
	solFiltered = [];

	sol0calculated = false;
	sol1calculated = false;

	lastResult;
	lastCompiledMotions;

	solvedBlackCells = 0;
	solvedCellsCount = 0;

	drawCount = 0;

	CreateMinMaxMassive = function () {
		this.complexity = treugolnPascal[this.chislaL][this.freeCellsCount];

		this.MinValuesMassive = [];
		for (let i = 0; i <= this.chislaL; i++) {
			this.MinValuesMassive[i] = !((i == 0) || (i == this.chislaL));
		}
	}

	CalculateSolPart0 = function () {
		this.solPart0 = [];
		this.cycle(0, [], this.freeCellsCount);
		this.sol0calculated = true;
		/*
		if (this.chislaL > 1) {
			console.log(this.coords + " | " + this.chisla + " | freeCellsCount(" + this.freeCellsCount + ") notBlackCellsCount(" + this.notBlackCellsCount + ")");
			console.log("complexity(" + this.complexity + ") solPart0(" + this.solPart0.length + ")");
		}
		console.log(this.solPart0);
		*/
	}

	cycle = function (id, massive, freeCells) {
		if (id <= this.chislaL) {
			for (let i = (this.MinValuesMassive[id] + ((id == this.chislaL) ? freeCells : 0)); i <= this.MinValuesMassive[id] + freeCells; i++) {
				if (id == (this.chislaL)) {
					this.solPart0.push([...massive, i]);
				} else {
					//console.log("FOR id ["+id+"] Min{" + this.MinValuesMassive[id] + "} fC{"+freeCells+"} i["+i+"] calc()");
					this.cycle(id + 1, [...massive, i], freeCells - (i - this.MinValuesMassive[id]));
				}
			}
		}
	}

	CalculateSolPart1 = function () {
		this.solPart1 = [];
		this.solPart0.forEach((element, index) => {
			this.solPart1.push(this.parseSolution(element, index));
		});
		this.sol1calculated = true;
	}

	parseSolution = function (spaces_, index) {
		if ((spaces_.length - 1) == (this.chislaL)) {
			let result = [];
			for (let i = 1, c1 = 0, c2 = 0; i <= spaces_.length + this.chislaL; i++) {
				if (i % 2 == 1) {
					result.push(...Array(spaces_[c1]).fill(1));
					c1++;
				} else {
					result.push(...Array(this.chisla[c2]).fill(2));
					c2++;
				}
			}
			this.solPart0[index] = undefined;
			return result;
		}
	}

	CheckSolved = function () {
		let uslovie = this.elements.map(element => element.value.realState);
		let UslovieElementCount = uslovie.reduce((summ, a) => summ + (a != 0), 0);
		let notBlackCell = uslovie.reduce((summ, a) => summ + (a == 1), 0);
		//console.log(this.id + this.chisla + " UslovieElementCount(" + UslovieElementCount + ") notBlackCell(" + notBlackCell +
		//	") complexity(" + this.complexity + ") chislaL(" + this.chislaL + ") chislaSumm(" + this.chislaSumm +
		//	") freeCellsCount(" + this.freeCellsCount + ") notBlackCellsCount(" + this.notBlackCellsCount + ") complexityUPD(" + this.complexityUPD + ")");
		if (UslovieElementCount != 0 && UslovieElementCount == this.elementsL) {
			this.resultDrawed = this.solved = true;
			return true;
		} else {
			return false;
		}
	}

	CalculateSolPart2 = function () {
		let uslovie = this.elements.map(element => element.value.realState);
		let UslovieElementCount = uslovie.reduce((summ, a) => summ + (a != 0), 0);
		//console.log(this.id + "uslovie [" + uslovie + "]");

		this.solPart2 = [];
		//console.log(this.id + "UslovieElementCount = " + UslovieElementCount);
		if (UslovieElementCount == 0) {
			this.solPart2 = this.solPart1;
		} else {
			this.solPart1.filter((line_, index) => {
				let correct = 0;
				for (let i = 0; i < line_.length; i++) {
					if (uslovie.hasOwnProperty(i) && uslovie[i] != 0) {
						//console.log("["+index+"] i( "+i+" ) correct");
						if (line_[i] != uslovie[i]) {
							//console.log("[" + index + "] i( " + i + " ) failure");

							//console.log(this.id + "coord(" + this.coords + ") line_(" + line_.toString() + ")");
							line_ = undefined;
							//console.log(line_);
							return false;
						} else {
							//console.log("[" + index + "] i( " + i + " ) correct");
							correct++;
						}
					}
				}
				if (correct == UslovieElementCount) {
					this.solPart2.push(line_);
				} else {
				}
			});

			/*
			if (this.solPart2.length > 0) {
				for (let i = 0; i < this.solPart2.length; i++) {
					drawMassive("Комб с фильтром " + (i + 1), this.solPart2[i]);
				}
			}
			*/
		}
	}

	FindSolution = function () {
		if (this.solPart2.length > 0) {
			//console.log(this.id + "FindSolution");
			//console.log(this.solPart2.length);

			let massiveCheck = [];
			//...Array(this.solPart2[0].length).fill({1: 0, 2: 0})
			this.solPart2.forEach((massive, index) => {
				for (let i = 0; i < massive.length; i++) {
					if (index == 0) {
						massiveCheck[i] = { 1: 0, 2: 0 };
					}
					if (massive[i] != 0) {
						if (index == 0) {
							//console.log("index(" + index + ") i(" + i + ")" + massiveCheck[i][massive[i]]);
						}
						massiveCheck[i][massive[i]]++;
					}
				}
			});
			//console.log(massiveCheck);

			let massiveResult = massiveCheck.map((x, index) => {
				//console.log(x);
				if (x[1] == this.solPart2.length) {
					return 1;
				} else if (x[2] == this.solPart2.length) {
					return 2;
				}


				/*
				if (uslovie[index] != 0) {
					return uslovie[index];
				} else {
					return ( (x == true) ? 2 : 0);
				}
				*/
			});

			this.lastResult = massiveResult;
			//drawMassive(this.coords.toString(), massiveResult);

			this.solvedCellsCount = this.lastResult.reduce((summ, a) => summ + ((a != null) ? 1 : 0), 0);
			if (this.solvedCellsCount == this.elements.length) {
				this.resultDrawed = false;
			}
			//console.log(this.id + this.coords.toString() +" [" + massiveResult.toString() + "] " + this.solvedCellsCount);
		} else {
			console.log(this.id + "Отфильтрованный массив пуст");
		}
	}

	ConvertResultToMotion = function () {
		let realMassive = this.elements.map(element => element.value.realState);
		//console.log(this.id + "ConvertResultToMotion 1 [" + this.coords + "]");
		//console.log(this.id + "ConvertResultToMotion 2 [" + typeof(this.lastResult) + "]"); // .toString()

		//console.log(this.id + "ConvertResultToMotion 1 [" + realMassive.toString() + "]");
		let result1 = [];
		this.lastResult.forEach((value, i) => {
			result1[i] = (realMassive[i] != 0 || realMassive[i] == value) ? null : value;
		});
		//console.log(this.id + "ConvertResultToMotion 3 [" + result1.toString() + "]");
		//console.log(result1);

		let prevState, summ = 1, indexStart = 0;
		let result2 = [];
		result1.forEach((value, index) => {
			if (index == 0) {
				summ = 1;
				prevState = value;
			} else {
				//console.log(result1[index - 1] + " " + value + " => " + (result1[index - 1] != value));
				if (result1[index - 1] != value) {
					result2.push([prevState, indexStart, summ]);
					indexStart = index;
					prevState = value;
					summ = 1;
				} else {
					summ++;
				}
			}
		});
		result2.push([prevState, indexStart, summ]);
		// [тип линии, стартовый индекс, длина линии]
		//console.log(result2);

		this.lastCompiledMotions = result2.filter(x => {
			if (x[0] != null && x[0] != undefined) {
				return true;
			}
		}).map(x => {
			let start = [], end = [];
			start[1 - this.coords[0]] = end[1 - this.coords[0]] = this.coords[1];
			start[this.coords[0]] = x[1];
			end[this.coords[0]] = x[1] - 1 + x[2];
			return [x[0], start, end];
		});
		//console.log(this.lastCompiledMotions);

		/*
		result3.forEach(x=> {
			drawModeState = x[0];
			fieldDrawEvent(x[1], x[2], true);
		});
		*/


		/*
		if (index == 0) {
			prevState = value;
		}
		if (realMassive != value) {
			realMassive
			result.push({
				state: 2,
				start: [0,0],
				end: [0,0]
			});
			//ебашить координаты откуда-то (((
		}
		*/
	}

	DrawCompiledMotions = function () {
		if (this.lastCompiledMotions.length > 0) {
			drawCount++;
		}
		this.lastCompiledMotions.forEach(x => {
			drawModeState = x[0];
			fieldDrawEvent(x[1], x[2], true, true);
		});
		if (this.resultDrawed == false) {
			this.resultDrawed = this.solved = true;
		}
	}
}

function drawMassive(name, massive) {
	console.log("(" + name + ") = [" + massive.toString() + "]");
}






























var wtfMassive;
function StartSolver() {

	let startTime = new Date();
	console.log("Start Solver [ " + (startTime).toISOString() + " ]");

	drawModeState = 0;
	fieldDrawEvent([0, 0], [vStrings.length - 1, hStrings.length - 1], true, true);
	ToolTipEnable(false);



	// axis 0 - horiz , 1 - vertic
	let finalPriorityMassive = [
		...((hStrings.map((v, index) => [v, GetMassive(0, index), [0, index]]))),
		...((vStrings.map((v, index) => [v, GetMassive(1, index), [1, index]])))
	];
	//console.log(finalPriorityMassive);


	wtfMassive = [];
	finalPriorityMassive.forEach((pMassive, index) => {
		wtfMassive.push(new MyLine("#" + index + " ", pMassive[0], pMassive[1], pMassive[2]));
		//solving
		//calculate drawing
		//drawing
	});

	GeneratePascalTreugoln(Math.max.apply(null, wtfMassive.map(x => x.chislaL)) + 1, Math.max.apply(null, wtfMassive.map(x => x.freeCellsCount)) + 1); //

	wtfMassive.forEach((x, index) => {
		x.CreateMinMaxMassive();
	});
	wtfMassive.sort((a, b) => b.calcCellsConcern - a.calcCellsConcern);

	wtfMassive.forEach((x, index) => {
		x.id = "[#" + index + "] ";
		console.log(x.id + "coord(" + x.coords + ") line(" + x.chisla + ") complexity(" + x.elementsL + ") calcCellsAbsolute(" + x.calcCellsAbsolute + ") calcCellsConcern(" + x.calcCellsConcern + ")");
		/*
		x.CalculateSolPart0();
		x.CalculateSolPart1();
		*/
	});

	stepIndex = -1;
	allSolved = false;
	drawCount = 0;
	/*
	for (let i = 0; i < 10; i++) {
		SolutionStep();
	}
	*/

	//console.log(wtfMassive);

	/*
	let whileCount = 0;
	while ((wtfMassive.every(x => x.solved == true) == false)) {
		wtfMassive.forEach((x, index) => {
			if (x.solved != true) {
				x.CalculateSolPart2();
				x.FindSolution();
				x.ConvertResultToMotion();
				x.DrawCompiledMotions();
			}
		});
		whileCount++;
		if (whileCount > 30) {
			break;
		}
		console.log("MASS WHILE = " + whileCount);
	}
	*/

	/*
	while (allSolved == false) {
		setTimeout(SolutionStep(), 400);
	}
	*/
	console.log(wtfMassive);

	let endTime = new Date();
	console.log("End Solver [ " + (endTime).toISOString() + " ]");
	console.log("Затрачено времени: " + (endTime - startTime) + " милисекунды");


	//console.log(wtfMassive[wtfMassive.length - 1]);




	//сортировка по "жирности" "строки", и циклы поиска решений 
}

function StartSolutionCycle() {
	for (let i = 0; i < 10; i++) {
		setTimeout(SolutionStep(), 400);
	}
	/*
	while (allSolved == false) {
		setTimeout(SolutionStep(), 400);
	}
	*/
}

var stepIndex = 0;
var allSolved = false;
var drawCount = 0;
function SolutionStep() {
	if (allSolved == false) {
		let jj = 0;
		do {
			stepIndex++;
			if (stepIndex == wtfMassive.length) stepIndex = 0;
			jj++;
			if (jj > wtfMassive.length * 2) {
				return false;
			}
		} while (wtfMassive[stepIndex].solved == true)
		//console.log("!! " + stepIndex);

		if (wtfMassive[stepIndex].sol0calculated == false)
			wtfMassive[stepIndex].CalculateSolPart0();
		if (wtfMassive[stepIndex].sol1calculated == false)
			wtfMassive[stepIndex].CalculateSolPart1();
		if (wtfMassive[stepIndex].CheckSolved() == false) {
			wtfMassive[stepIndex].CalculateSolPart2();
			wtfMassive[stepIndex].FindSolution();
			wtfMassive[stepIndex].ConvertResultToMotion();
			wtfMassive[stepIndex].DrawCompiledMotions();
		}

		if (wtfMassive.every(x => x.solved == true) == true) {
			console.log("All Solved !!! drawCount["+drawCount+"]");
			solveStateElement.innerText = "Кроссворд решён!";
			allSolved == true;
		}
	}
}

function GetMassive(axis, id) {
	let convertedMassive = ((axis == 0) ? fieldSkeletonRev[id] : fieldSkeleton[id]);
	return convertedMassive;
}

var treugolnPascal = [];
function GeneratePascalTreugoln(size1, size2) {
	treugolnPascal = [];
	treugolnPascal[0] = Array(size2).fill(1);
	for (let x = 1; x < size1; x++) {
		treugolnPascal[x] = [1, ...Array(size2 - 1).fill(null)]
		for (let y = 1; y < size2; y++) {
			treugolnPascal[x][y] = treugolnPascal[x - 1][y] + treugolnPascal[x][y - 1];
			//console.log("[" + x + "][" + y + "] ( " + treugolnPascal[x - 1][y] + " + " + treugolnPascal[x][y - 1] + " ) = { " + treugolnPascal[x][y] + " }");
		}
	}
	//console.log(treugolnPascal);
}