


var Place;

document.addEventListener("DOMContentLoaded", function(){
	Place = document.getElementById("work_body");
	/*
	generate(15, [5, 4, 2]);
	generate(14, [5, 3, 1]);
	generate(15, [5, 3, 1]);
	*/
});
const Colors = { 0: 'empty', 1: 'cross', 2: 'black' };

function generate(length, massive) {
	fuck_this_up(length, massive);
}

function fuck_this_up(length, massive) {
	let massiveCentral = [];
	let minLength = massive.reduce((a, b) => a + b, 0) + (massive.length - 1);
	if (minLength < length) {
		let n = length - minLength;
		console.log("n = " + n);
		console.log("count_of_experiment = " + minLength);

		let first_row = [];
		let x = 0;
		for (let el = 0; el < massive.length; el++) {
			massiveCentral[el] = n;
			for (let sz = 0; sz < massive[el]; sz++) {
				first_row[x] = 2;
				x++;
			}
			first_row[x] = 1;
			x++;
		}
		massiveCentral[0]++;
		massiveCentral[massiveCentral.length] = n + 1;
		x--;
		for (let empt = x; empt < length; empt++) {
			first_row[x] = 0;
			x++;
		}
		console.log(massiveCentral);
		console.log(first_row);
		drawMassive("solution ???", first_row);
	} else {
		console.log("массив слишком большой, алло");
	}
}

function drawMassive(name, massive) {
   let prefab = "<tr><td class=\"row-name\">" + name + "</td>" +
		massive.map(x => {
			return "<td class=\"cell " + Colors[x]+"\"></td>"
		}).join("")
		+ "<td class=\"end\"></td></tr>";

	let template = document.createElement('template');
	template.innerHTML = prefab;

	Place.append(template.content.firstChild);
}