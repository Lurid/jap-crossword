
var myTable;
var lineLength = 11;
var elementCount = 3;

var MainResult = [];

document.addEventListener("DOMContentLoaded", function () {
	myTable = document.getElementById("TABLE");
	GenerateCalulations(lineLength, elementCount);

	GenerateResult.forEach(x => {
		MainResult.push(new MyLine2(x, lineLength));
	});

	let freeCellMax = Math.max.apply(null, MainResult.map(x => x.freeCellsCount)),
		chislaLMax = Math.max.apply(null, MainResult.map(x => x.chislaL));
	console.log("freeCellMax = (" + freeCellMax + ")");
	console.log("chislaLMax = (" + chislaLMax + ")");
	GeneratePascalTreugoln(Math.max(freeCellMax, chislaLMax) + 1); //

	let iChoknulsya = [];
	console.log(MainResult);
	let MyTable = MainResult.map((x, index) => {

		x.CalculateSolPart0();
		x.CalculateSolPart1();
		x.CalculateSolPart2();
		x.FindSolution();
		if (iChoknulsya[x.solPart0.length] == undefined) {
			iChoknulsya[x.solPart0.length] = 0;
		}
		iChoknulsya[x.solPart0.length]++;
		console.log("[" + index + "] [" + x.chisla.toString() + "]\t {" + x.freeCellsCount + ", " + x.notBlackCellsCount + ", " + x.solPart0.length + "}");
		return {
			"line": x.chisla.toString(), 
			"SolCount": x.solPart0.length, 
			"Summ": x.chislaSumm, 
			"freeCells": x.freeCellsCount, 
			"notBlack": x.notBlackCellsCount, 
			"complexityUPD": x.complexityUPD, 
			"RESULT": x.lastResult.filter(x => x == 2).length, 
			"RES_line": x.lastResult.map(x => x == undefined ? ' ' : x).toString()};
		//console.log((x.solPart0.map(x => x[0])));
	});
	console.table(MyTable);

	console.log(MainResult);
	console.log(iChoknulsya);
});



class MyLine2 {
	constructor(chisla_, rowLength_) {
		this.chisla = chisla_;
		this.chislaL = chisla_.length;
		this.chislaSumm = chisla_.reduce((summ, val) => summ + val);
		this.rowLength = rowLength_;
		this.freeCellsCount = (this.rowLength - (this.chisla.reduce((summ, a) => summ + a, 0) + this.chislaL - 1));
		this.notBlackCellsCount = this.chislaL - 1 + this.freeCellsCount;

		this.elements = [...Array(rowLength_).fill(0)];
		
		this.complexityUPD = chisla_.map(x => {
			let z = x + this.freeCellsCount; if (z >= x * 2) return 0; else return z - 2 * (z - x);
		}).reduce((summ, i) => summ + i);
	}

	chisla = [];
	chislaL;
	chislaSumm;

	elements;

	rowLength;

	complexity;
	complexityUPD;

	MinMaxMassive = [];
	freeCellsCount = 0;
	notBlackCellsCount = 0;

	solPart0 = [];
	solPart1 = [];
	solPart2 = [];

	solFiltered = [];

	lastResult;


	solvedBlackCells = 0;
	solvedCellsCount = 0;

	CreateMinMaxMassive = function () {
		this.MinMaxMassive = [];
		for (let i = 0; i <= this.chislaL; i++) {
			this.MinMaxMassive[i] = !((i == 0) || (i == this.chislaL));
		}
	}

	CalculateSolPart0 = function () {
		this.CreateMinMaxMassive();
		this.complexity = treugolnPascal[this.freeCellsCount][this.chislaL];
		this.solPart0 = [];
		this.cycle(0, [], this.freeCellsCount);
	}

	cycle = function (id, massive, freeCells) {
		if (id <= this.chislaL) {
			for (let i = (this.MinMaxMassive[id] + ((id == this.chislaL) ? freeCells : 0)); i <= this.MinMaxMassive[id] + freeCells; i++) {
				if (id == (this.chislaL)) {
					this.solPart0.push([...massive, i]);
				} else {
					//console.log("FOR id ["+id+"] MinMax{" + (this.MinMaxMassive[id] + "," + "") + "} fC{"+freeCells+"} i["+i+"] calc("+(freeCells - (i - this.MinMaxMassive[id].min))+")");
					this.cycle(id + 1, [...massive, i], freeCells - (i - this.MinMaxMassive[id]));
				}
			}
		}
	}

	CalculateSolPart1 = function () {
		this.solPart1 = [];
		this.solPart0.forEach((element, index) => {
			this.solPart1.push(this.parseSolution(element, index));
		});
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

	CalculateSolPart2 = function () {
		let uslovie = this.elements;
		let UslovieElementCount = uslovie.reduce((summ, a) => summ + (a != 0), 0);

		this.solPart2 = [];
		if (UslovieElementCount == 0) {
			this.solPart2 = this.solPart1;
		} else {
			this.solPart1.filter((line_, index) => {
				let correct = 0;
				for (let i = 0; i < line_.length; i++) {
					if (uslovie.hasOwnProperty(i) && uslovie[i] != 0) {
						if (line_[i] != uslovie[i]) {
							line_ = undefined;
							return false;
						} else {
							correct++;
						}
					}
				}
				if (correct == UslovieElementCount) {
					this.solPart2.push(line_);
				}
			});
		}
	}

	FindSolution = function () {
		if (this.solPart2.length > 0) {

			let massiveCheck = [];
			this.solPart2.forEach((massive, index) => {
				for (let i = 0; i < massive.length; i++) {
					if (index == 0) {
						massiveCheck[i] = { 1: 0, 2: 0 };
					}
					if (massive[i] != 0) {
						if (index == 0) {
						}
						massiveCheck[i][massive[i]]++;
					}
				}
			});

			let massiveResult = massiveCheck.map((x, index) => {
				if (x[1] == this.solPart2.length) {
					return 1;
				} else if (x[2] == this.solPart2.length) {
					return 2;
				}
			});

			this.lastResult = massiveResult;

			this.solvedCellsCount = this.lastResult.reduce((summ, a) => summ + ((a != null) ? 1 : 0), 0);
			if (this.solvedCellsCount == this.elements.length) {
				this.resultDrawed = false;
			}
		} else {
			console.log(this.id + "Отфильтрованный массив пуст");
		}
	}
}

function debug(str) {
	console.log(str);
}


function GenerateCalulations(rowLeng, elemCount) {
	let lines = [];
	elementsCount_ = elemCount;
	rowLength_ = rowLeng;
	freeCell_ = rowLength_ - ((elementsCount_ * 2) - 1);
	/*
	debug("elementsCount_ = " + elementsCount_);
	debug("rowLength_ = " + rowLength_);
	debug("freeCell_ = " + freeCell_);
	*/

	let blackCellMaxCount = rowLength_ + 1 - elementsCount_;

	GenerateResult = [];
	recurs(0, [], freeCell_);
	console.log(GenerateResult);
}
var rowLength_;
var elementsCount_;
var freeCell_;
var GenerateResult;
function recurs(id, massive, freeCell) {
	if (id < elementsCount_) {
		//console.log((("\t").repeat(id)) + "[" + id + "] M{" + massive.toString() + "} fc(" + freeCell + ") FOR (1 => " + (freeCell + 1) + ")");
		for (let i = 1; i <= freeCell + 1; i++) {
			//console.log((("\t").repeat(id)) + "FC [" + id + "] M["+[...massive, i]+"] i(" + i + ")");
			if (id == elementsCount_ - 1) {
				let val = [...massive, i];
				GenerateResult.push(val);
				//console.log("[" + GenerateResult.length + "] " + val.toString() + " = " + val.reduce((summ, x) => summ + x + 1));
			} else {
				recurs(id + 1, [...massive, i], ((freeCell - i) + 1));
			}
		}
	}
}

var treugolnPascal = [];
function GeneratePascalTreugoln(size) {
	treugolnPascal = [];
	treugolnPascal[0] = Array(size).fill(1);
	for (let x = 1; x < size; x++) {
		treugolnPascal[x] = [1, ...Array(size - 1).fill(null)]
		for (let y = 1; y < size; y++) {
			treugolnPascal[x][y] = treugolnPascal[x - 1][y] + treugolnPascal[x][y - 1];
			//console.log("[" + x + "][" + y + "] ( " + treugolnPascal[x - 1][y] + " + " + treugolnPascal[x][y - 1] + " ) = { " + treugolnPascal[x][y] + " }");
		}
	}
	//console.log(treugolnPascal);
}