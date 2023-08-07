var guess = ""
var currentRow = 1
var word
var rows = prompt("Number of rows?")
var digits = prompt("Number of digits?")
function intRandom(min,max) {
	return Math.floor(Math.random() * (max-min+1)) + min
}
function generate() {
	//Generate rows and stuffs
	rows = isNaN(rows||6*1) ? 6 : rows*1
	digits = isNaN(rows||5*1) ? 5 : digits*1
	var k = 0
	while (k++ < rows) {
		var row = table.insertRow()
		row.id = "r" + k
		var colorCell = row.insertCell()
		colorCell.style = "background-color: hsl(" + (k*(15/Math.log10(rows+1))+rows*30)%360 +",80%,60%)"
		colorCell.textContent = k 
		var cells = 0
		while (cells++ < digits+1) {
			var cell = row.insertCell()
			cell.id = "c" + k + cells
		}
	}
	
	//Generate word
	word = intRandom(0,10**digits-1)+""
	word = "0".repeat(digits-word.length) + word
}
function keyPress(e) {
	if (gameEnd) return
	var key = e.key
	if (key == "Enter") {
		if (guess.length == digits) guessWord()
	} else if (key == "Backspace") {
		if (guess != "") guess = guess.split("").splice(0,guess.length-1).join("")
	} else if (key.length == 1 && key.match(/[0-9]/g)) {
		if (guess.length < digits) guess += key
	}
	var k = 0
	while (k++ < digits) document.getElementById("c" + currentRow + k).textContent = guess[k-1]||""
}
function guessWord() {
	if (gameEnd) return
	var counts = {}
	for (let k of word) {
		if (counts[k] == undefined) counts[k] = 1
		else counts[k]++
	}
	//Round 1: G
	for (let k in guess) {
		var cell = document.getElementById("c" + currentRow + (k*1+1))
		if (guess[k] == word[k]) {
			cell.className = "green"
			counts[guess[k]]--
		} 
	}
	//Round 2: Y
	for (let k in guess) {
		var cell = document.getElementById("c" + currentRow + (k*1+1))
		if (cell.className == "green") continue
		cell.className = "gray"
		if (counts[guess[k]] > 0) {
			cell.className = "yellow"
			counts[guess[k]]--
		}
	}
	//Round 3: <=>
	var signCell = document.getElementById("c" + currentRow + (digits+1))
	switch (Math.sign(guess-word)) {
		case -1: signCell.textContent = "<";signCell.className="red";break;
		case 0: signCell.textContent = "=";signCell.className="purple";break;
		case 1: signCell.textContent = ">";signCell.className="blue";break;
	}
	currentRow++
	gameEnd = currentRow > rows || guess == word
	if (gameEnd) {
		if (guess == word) alert("Winner!")
		else alert("rip (The word was " + word + ")")
	}
	guess = ""
}
generate()