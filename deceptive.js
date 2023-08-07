var guess = ""
var currentRow = 1
var word
var rows = prompt("Number of rows?")
var deceptionLevel
function intRandom(min,max) {
	return Math.floor(Math.random() * (max-min+1)) + min
}
function generate() {
	//Generate rows and stuffs
	rows = isNaN(rows*1) ? 6 : rows*1
	var k = 0
	while (k++ < rows) {
		var row = table.insertRow()
		row.id = "r" + k
		var colorCell = row.insertCell()
		colorCell.style = "background-color: hsl(" + (k*(15/Math.log10(rows+1))+rows*30)%360 +",80%,60%)"
		colorCell.textContent = k 
		var cells = 0
		while (cells++ < 5) {
			var cell = row.insertCell()
			cell.id = "c" + k + cells
		}
	}
	
	//Generate word and related things
	word = normalWordList[intRandom(0,normalWordList.length-1)].toUpperCase()
	var level = prompt("Level? [0-5]")
	deceptionLevel = isNaN(level*1) ? 1 : Math.min(Math.max(level,0),5)
}
function keyPress(e) {
	if (gameEnd) return
	var key = e.key
	if (key == "Enter") {
		if (guess.length == 5) guessWord()
	} else if (key == "Backspace") {
		if (guess != "") guess = guess.split("").splice(0,guess.length-1).join("")
	} else if (key.length == 1 && key.match(/[a-z]/g)) {
		if (guess.length < 5) guess += key.toUpperCase()
	}
	render()
}
function render() {
	if (gameEnd) return
	var k = 0
	while (k++ < 5) document.getElementById("c" + currentRow + k).textContent = guess[k-1]||""
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

	//Deception
	var changers = [1,2,3,4,5], aD = 6 - deceptionLevel 
	while (--aD) changers.splice(intRandom(0,changers.length-1),1)
	for (let k in changers) {
		var cell = document.getElementById("c" + currentRow + changers[k])
		var colors = ["gray","yellow","green"]
		colors.splice(colors.indexOf(cell.className),1)
		cell.className = colors[intRandom(0,1)]
	}

	//Post-render changes
	currentRow++
	gameEnd = currentRow > rows || guess == word
	if (gameEnd) {
		if (guess == word) alert("Winner!")
		else alert("rip (The word was " + word + ")")
	}
	guess = ""
}
generate()