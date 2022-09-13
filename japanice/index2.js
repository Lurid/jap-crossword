var MinMaxMassive = [];
var fullline_length = 10;
var freeCellsCount = 0;
var notBlackCellsCount = 0;
var line = [1,1,1];
var uslovie = [0]
//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0];
/*

*/
var solutions1 = [];
var solutions2 = [];
var massiveResult = [];

document.addEventListener("DOMContentLoaded", function(){
	CycleStart();
});

function CycleStart() {
	drawMassive("Условие", uslovie);
	solutions1 = [];
	CreateMinMaxMassive();
	cycle(0, [], freeCellsCount);
	DrawSolutions1();

	console.log("c0 = " + count0);
	console.log("c1 = " + count1);
	console.log("c2 = " + count2);
	console.log("c3 = " + count3);
	console.log(solutions1);

	checkUslovie();
	console.log(solutions2);

	FindSolution(solutions2);
	

	/*
	parseSolution([0,1,2,2], line);

	var foo = 'foo';
	var bar = 'bar';
	var arr = [1,2,3];
	var result = [
		...Array(2).fill(foo),
		...arr,
		...Array(3).fill(bar)
	];
	console.log(result);
	*/
}

function CreateMinMaxMassive() {
	MinMaxMassive = [];
	freeCellsCount = fullline_length - (line.reduce((summ, a) => summ + a, 0) + line.length - 1);
	notBlackCellsCount = line.length - 1 + freeCellsCount;
	for (let i = 0; i <= line.length; i++) {
		MinMaxMassive[i] = { min: 1, max: freeCellsCount + 1 };
	}
	MinMaxMassive[0].min--;
	MinMaxMassive[0].max--;
	MinMaxMassive[MinMaxMassive.length - 1].min--;
	MinMaxMassive[MinMaxMassive.length - 1].max--;
}

var count0 = 0;
var count1 = 0;
var count2 = 0;
var count3 = 0;
function cycle (id, massive) {
	if (id < MinMaxMassive.length) {
		count0++;
		//console.log("Cycle ( "+id+" ) ( "+str+" )");
		for (let i = MinMaxMassive[id].min; i <= MinMaxMassive[id].max; i++) {
			if (id == (MinMaxMassive.length - 1) ) {
				
				let massive3 = [...massive];
				massive3.push(i);
				//console.log(massive3);

				if (massive3.reduce((summ, a) => summ + a, 0) == notBlackCellsCount) {
					console.log("C ( "+massive3+" )");
					
					parseSolution(massive3, line);
					count3++;
				}
				
				count2++;
			}
			count1++;
			let massive2 = [];
			if (id == 0) {
				//console.log("this is fucked up");
				massive2 = [i];
			} else {
				massive2 = [...massive];
				massive2.push(i);
			}
			cycle(id+1, massive2);
		}
	}
}

function parseSolution(spaces_, line_) {
	if ( (Array.isArray(spaces_) == true) && (Array.isArray(line_) == true) ) {
		if ( (spaces_.length - 1) == (line_.length) ) {
			let c1 = 0, c2 = 0, result = [];
			for (let i = 1; i <= spaces_.length + line_.length; i++) {
				if (i % 2 == 1) {
					result.push(...Array(spaces_[c1]).fill(1));
					c1++;
				} else {
					result.push(...Array(line_[c2]).fill(2));
					c2++;
				}
			}
			solutions1.push(result);
		}
	}
}

function DrawSolutions1() {
	for (let i = 0; i < solutions1.length; i++) {
		drawMassive("Комбинация " + (i + 1), solutions1[i]);
	}
}

function checkUslovie() {
	//if (uslovie.length == fullline_length) {
		console.log("checkUslovie");
		solutions2 = [];
		let UslovieElementCount = uslovie.reduce((summ, a) => summ + ((a != 0) ? 1 : 0), 0);
	console.log("UslovieElementCount = " + UslovieElementCount);
	if (UslovieElementCount == 0) {
		solutions2 = solutions1;
		return null;
	}
		solutions1.filter((line_, index) => {
			let correct = 0;
			for (let i = 0; i < line_.length; i++) {
				if (uslovie.hasOwnProperty(i) && uslovie[i] != 0) {
					//console.log("["+index+"] i( "+i+" ) correct");
					if (line_[i] != uslovie[i]) {
						console.log("[" + index + "] i( " + i + " ) failure");
						return false;
					} else {
						console.log("[" + index + "] i( " + i + " ) correct");
						correct++;
					}
				}
			}
			if (correct == UslovieElementCount) {
				solutions2.push(line_);
			}
		});

		for (let i = 0; i < solutions2.length; i++) {
			drawMassive("Комб с фильтром " + (i + 1), solutions2[i]);
		}
		/*
	} else {
		drawMassive("Длина условия не равна длине строки", []);
	}
	*/
}

function FindSolution(massives) {
	if (massives.length > 0) {
		//console.log(massives.length);

		let massiveCheck = [];
		//...Array(massives[0].length).fill({1: 0, 2: 0})
		massives.forEach((massive, index) => {
			for (let i = 0; i < massive.length; i++) {
				if (index == 0) {
					massiveCheck[i] = { 1: 0, 2: 0 };
				}
				if (massive[i] != 0) {
					if (index == 0) {
						console.log("index(" + index+") i("+i+")" + massiveCheck[i][massive[i]]);
					}
					massiveCheck[i][massive[i]]++;
				}
			}
		});
		console.log(massiveCheck);

		massiveResult = massiveCheck.map((x, index) => {
				//console.log(x);
				if (x[1] == massives.length) {
					return 1;
				} else if (x[2] == massives.length) {
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

		drawMassive("Результат", massiveResult);
	} else {
		drawMassive("Результат отсутствует", []);
	}
}