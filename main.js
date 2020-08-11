// let newPosition, direction;

function live () {
	let time = performance.now();
	//checkStatus(0);
	for (let i = 0; i < botPool.length; i++) {
		let bot = botPool[i];
		
		if (bot.alive) {
			
			for (let tryingForAction = 0; tryingForAction < 10; tryingForAction++) {
				if (bot.lastAction > 63) bot.lastAction -= 64;
				let action = bot.DNA[bot.lastAction];
				bot.history.push(action);
				if (action < 8) {
					rotate(bot, action);
				} else if (action < 16) {
					watch(bot, action);
				} else if (action < 24) {
					grab(bot, action);
					break;
				} else if (action < 25) {
					move(bot);
					break;
				} else if (action < 26) {
					getSunEnergy(bot);
					break;
				} else if (action < 27) {
					checkEnergy(bot);
				} else {
					bot.lastAction += action;
				}
			}
		
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
for (let cellX = 0; cellX < cell.length; cellX++) {
	for (let cellY = 0; cellY < cell[cellX].length; cellY++) {
		if ((cell[cellX][cellY].matter === 1 && cell[cellX][cellY].botIndex === undefined) || (cell[cellX][cellY].matter !== 1 && cell[cellX][cellY].botIndex !== undefined)) debugger;
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			eveningResult(bot);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
for (let cellX = 0; cellX < cell.length; cellX++) {
	for (let cellY = 0; cellY < cell[cellX].length; cellY++) {
		if ((cell[cellX][cellY].matter === 1 && cell[cellX][cellY].botIndex === undefined) || (cell[cellX][cellY].matter !== 1 && cell[cellX][cellY].botIndex !== undefined)) debugger;
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
	}
	clearBotArray();

	time = performance.now() - time;
	if (time == 0) time = 1;
	frameCounter += time;
	if (frameCounter >= 20) {
		frameCounter = 0;
		iterationsValueSpot.textContent = counter;
		renewField();
	}
	counter++;
}
function move(bot) {
	newPosition = getNewPosition(bot, bot.direction);
	let newCell = cell[newPosition[0]][newPosition[1]];
	if (newPosition[0] == bot.positionX && newPosition[1] == bot.positionY) {
		bot.lastAction += 6;
		return;
	}
	let oldCell = cell[bot.positionX][bot.positionY];
	switch (newCell.matter) {
		case 0:
			oldCell.matter = 0;
			oldCell.botIndex = undefined;
			bot.positionX = newPosition[0];
			bot.positionY = newPosition[1];
			newCell.matter = 1;
			newCell.botIndex = botPool.indexOf(bot);
			bot.lastAction ++;
			return;
		case 1:
			let victim = botPool[newCell.botIndex];
			getEnergy(bot, victim.lipo + 100);
			killBot(victim);
			bot.lipo++;
			oldCell.matter = 0;
			oldCell.botIndex = undefined;
			bot.positionX = newPosition[0];
			bot.positionY = newPosition[1];
			newCell.matter = 1;
			newCell.botIndex = botPool.indexOf(bot);
			bot.lastAction += 2;
			return;
		case 2:
			getEnergy(bot, 100);
			oldCell.matter = 0;
			oldCell.botIndex = undefined;
			bot.positionX = newPosition[0];
			bot.positionY = newPosition[1];
			newCell.matter = 1;
			newCell.botIndex = botPool.indexOf(bot);
			bot.lastAction += 3;
			return;
		case 3:
			getEnergy(bot, 50);
			oldCell.matter = 0;
			oldCell.botIndex = undefined;
			bot.positionX = newPosition[0];
			bot.positionY = newPosition[1];
			newCell.matter = 1;
			newCell.botIndex = botPool.indexOf(bot);
			bot.lastAction += 4;
			return;
		default :
			return;
	}
}
function checkEnergy (bot) {
	console.log('smb is checking energy');
	bot.lastAction += 10;
}
function grab(bot, degree) {
	let direction = getDirection(bot, degree);
	let newPosition = getNewPosition(bot, direction);
	if (newPosition[0] == bot.positionX && newPosition[1] == bot.positionY) {
		bot.lastAction += 6;
		return;
	}
	let newCell = cell[newPosition[0]][newPosition[1]];
	switch(newCell.matter) {
		case 0:
			bot.lastAction++;
			return;
		case 1:
			if (bot.hash == botPool[newCell.botIndex].hash) {
				bot.lastAction += 2;
			} else {
				let victim = botPool[newCell.botIndex];
				getEnergy(bot, victim.lipo + 100);
				killBot(victim);
				bot.lipo++;
				bot.lastAction += 3;
			}
			return;
		case 2:
			getEnergy(bot, 100);
			newCell.matter = 0;
			newCell.botIndex = undefined;
			bot.lastAction += 4;
			return;
		case 3:
			getEnergy(bot, 50);
			newCell.matter = 0;
			newCell.botIndex = undefined;
			bot.lastAction += 5;
			break;
		default :
		return;
	}
}
function killBot(bot) {
	bot.alive = false;
	cell[bot.positionX][bot.positionY].matter = 0;
	cell[bot.positionX][bot.positionY].botIndex = undefined;
}
function getEnergy(bot, energy) {
	energy = Math.floor(energy / 2);
	bot.energy += energy;
	if (bot.energy > 99) {
		releaseEnergyGlut(bot);
		bot.energy -= 50;
	}
	// checkStatus('getEnergy');
}
function watch(bot, degree) {
	direction = getDirection(bot, degree);
	newPosition = getNewPosition(bot, direction);
	switch (cell[newPosition[0]][newPosition[1]].matter) {
		case 0:
			bot.lastAction++;
			return;
		case 1:
			bot.lastAction += 2;
			return;
		case 2:
			bot.lastAction += 3;
			return;
		case 3:
			bot.lastAction += 4;
			return;
		default:
			debug('watch and seeing strange ' + botPool.indexOf(bot), 1);
			return;
	}
}
function rotate(bot, degree) {
	bot.direction += degree;
	if (bot.direction > 7) bot.direction -= 8;
	bot.lastAction++;
}
function getSunEnergy(bot) {
	bot.lastAction++;
	let energy = -Math.round((bot.positionY + 1) / (rows / 20)) + 10;
	if (energy < 0) return;
	bot.energy += energy;
	if (bot.energy > 99) {
		releaseEnergyGlut(bot);
		bot.energy -= 50;
	}
}
function releaseEnergyGlut(bot) {
	bot.health++;
	if (bot.health > 99) {
		bot.health = 99;
		if (bot.lipo > 50) {
			if (getRandom(2) > 0) {
				setNewBot(bot);
			} else {
				bot.lipo++;
			}
		} else {
			bot.lipo++;
		}
	}
}
function eveningResult(bot) {
	bot.energy--;
	bot.age++;
	if (bot.age > 10000) {
		// debug(botPool.indexOf(bot) + " is too old");
	}
	if (bot.energy <= 0) {
		bot.lipo--;
		if (bot.lipo < 0) {
			bot.health--;
			bot.lipo = 0;
		} else {
			bot.energy += 50;
		}
	}
	if (bot.health <= 0) {
		dieBot(bot, 1);
		return;
	}
	if (bot.lipo > 99) {
		dieBot(bot, 0);
	}
}
function setNewBot(bot) {
	let newPosition = [];
	while(true) {
		newPosition= getNewPosition(bot, getRandom(8));
		if (!(newPosition[0] == bot.positionX && newPosition[1] == bot.positionY)) break;
	}
	if (cell[newPosition[0]][newPosition[1]].matter !== 1) {
		bot.lipo -= 20;
		let child = {
			positionX			: newPosition[0],
			positionY			: newPosition[1],
			health				: 25,
			lipo				: 1,
			energy				: 50,
			color				: bot.color,
			age					: 0,
			direction			: bot.direction,//getRandom(8),
			lastAction			: 0,
			alive				: true,
			exist				: true,
			hash				: bot.hash,
		};
		child.DNA = [];
		for (let i = 0; i < 64; i++) child.DNA[i] = bot.DNA[i];
		if (getRandom(8) < 4) {
			child.DNA[getRandom(64)] = getRandom(64);
			child.hash = getHash(child.DNA);
			child.color = getColor(child.hash);
		}

	//////////////////////////////////////////////////////////////////////////////////////////////////
	child.history = [];
	//////////////////////////////////////////////////////////////////////////////////////////////////


		botPool.push(child);
		cell[newPosition[0]][newPosition[1]].matter = 1;
		cell[newPosition[0]][newPosition[1]].botIndex = botPool.indexOf(child);
	} else {
		bot.lipo++;
	}
}
function dieBot(bot, reason) {
	bot.alive = false;
	cell[bot.positionX][bot.positionY].matter = 0;
	cell[bot.positionX][bot.positionY].botIndex = undefined;
	let i = rows;
	while (true) {
		i--;
		if (cell[bot.positionX][i].matter == 0) break;
	}
	switch (reason) {
		case 0:
			cell[bot.positionX][i].matter = 2;
			break;
		case 1:
			cell[bot.positionX][i].matter = 3;
			break;
		default :
			return;
	}
}
function init() {
	// collect all obects on the page
		//zones
		infoBox = document.getElementById('infoBox');
		generationInfoBox = document.getElementById('generationInfoBox');
		graphBox = document.getElementById('graphBox');
		lifeAreaBox = document.getElementById('lifeAreaBox');
		//buttons
		start_stopButton = document.getElementById('start_stopButton');
		//changing info
		columnsValueSpot = document.getElementById('columnsValueSpot');
		rowsValueSpot = document.getElementById('rowsValueSpot');
		iterationsValueSpot = document.getElementById('iterationsValueSpot');
		//canvas
		lifeArea = document.getElementById('lifeArea');
		weatherArea = document.getElementById('weatherArea');
	// draw field
	cellSize = 10;
	cellDirectionMiddle = ((cellSize - 1) - (2 * (cellSize - 1)) / 3) + 1;
	cellDirectionEnd = ((cellSize - 1) - (cellSize - 1) / 3) + 1;
	setCanvasSize();
	drawAmbient();
	//init cells
	cell = [];
	for (let x = 0; x < columns; x++) {
		cell[x] = [];
		for (let y = 0; y < rows; y++) {
			cell[x][y] = {
				matter 			: 0,
				botIndex 		: undefined,
			};
		}
	}
	//init first bot
	botPool = [];
	botPool[0] = {
		positionX			: getRandom(columns),
		positionY			: 1,
		health				: 25,
		lipo				: 1,
		energy				: 50,
		age					: 0,
		direction			: getRandom(8),
		lastAction			: 0,
		alive				: true,
		exist				: true, //not sure
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////
	botPool[0].history = [];
	//////////////////////////////////////////////////////////////////////////////////////////////////

	hashBase = [];
	colorBase = [];
	colorBase[0] = "#f00";
	botPool[0].DNA = [];
	for (let i = 0; i < 64; i++) botPool[0].DNA[i] = 25;
	botPool[0].hash = getHash(botPool[0].DNA);
	botPool[0].color = getColor(botPool[0].hash);
	setBotOnField(botPool[0]);

	// setDiffDNA(botPool[0], 0, 23);

	// buttons
	start_stopButton.textContent = "start";

	//add Events
	start_stopButton.addEventListener('click', stop_run);

	currentStatus = false;
	counter = 0;

	stopSignal = false;
}
function stop_run() {
	if (currentStatus) {
		start_stopButton.textContent = "start";
		clearInterval (id);
		currentStatus = false;
	} else {
		start_stopButton.textContent = "stop";
		frameCounter = 0;
		id = setInterval(live, 0);
		currentStatus = true;
	}
}
function getRandom(number) {
	let rnd = Math.round(Math.random() * number);
	if (rnd == number) rnd = 0;
	return rnd;
}
function getHash(genom) {
	let hash = 0, char;
	genom = String(genom);
	for (let i = 0; i < genom.length; i++) {
		char = genom.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	for (let i = 0; i < hashBase.length; i++) {
		if (hash == hashBase[i]) return hash;
	}
	hashBase.push(hash);
	return hash;
}
function getColor(botHash) {
	for (let i = 0; i < hashBase.length; i++) {
		if (botHash == hashBase[i]) {
			if (colorBase[i] === undefined) break;
			return colorBase[i];
		}
	}
	let r = getRandom(150) + 100;
	let g = getRandom(150) + 100;
	let b = getRandom(150) + 100;
	let botColor = "#" + r.toString(16) + g.toString(16) + b.toString(16);
	colorBase.push(botColor);
	return botColor;
}
function setBotOnField(bot) {
	cell[bot.positionX][bot.positionY].matter = 1;
	cell[bot.positionX][bot.positionY].botIndex = botPool.indexOf(bot);
}
function clearBotArray() {
	let tmpArray = [];
	botPool.forEach(bot => {
		if (bot.alive) tmpArray.push(bot);
		cell[bot.positionX][bot.positionY].botIndex = undefined;
	});
	botPool = [];
	tmpArray.forEach(bot => {
		botPool.push(bot);
		cell[bot.positionX][bot.positionY].botIndex = botPool.indexOf(bot);
	});
}
function getNewPosition(bot, degree) {
	let x, y;
	let old = bot.positionX;
	if (degree == 2 || degree == 3 || degree == 4) {
		x = (old == columns - 1) ? 0 : ++old;
	} else if (degree == 0 || degree == 6 || degree == 7) {
		x = (old == 0) ? columns - 1 : --old;
	} else x = old;
	old = bot.positionY;
	if (degree == 0 || degree == 1 || degree == 2) {
		y = (old == 0) ? old : --old;
	} else if (degree == 4 || degree ==5 || degree == 6) {
		y = (old == rows -1) ? old : ++old;
	} else y = old;
	return [x, y];
}
function getDirection(bot, degree) {
	let tmp = (degree + 1) % 8;
	degree = tmp + bot.direction;
	if (degree > 7) degree -=8;
	return degree;
}
function movePiece() {
	
	cell[botPool[0].positionX][botPool[0].positionY].matter = 0;
	cell[botPool[0].positionX][botPool[0].positionY].botIndex = undefined;
	botPool[0].positionX++;
	if (botPool[0].positionX == columns) {
		botPool[0].positionX = 0;
		counter++;
	}
	cell[botPool[0].positionX][botPool[0].positionY].matter = 1;
	cell[botPool[0].positionX][botPool[0].positionY].botIndex = botPool.indexOf(botPool[0]);
}
function setCanvasSize() {
	// set variables
	context = lifeArea.getContext('2d');
	weatherContext = weatherArea.getContext('2d');
	let realWidth = lifeAreaBox.offsetWidth;
	let realHeight = lifeAreaBox.offsetHeight;
	columns = Math.trunc(realWidth / cellSize);
	rows = Math.trunc(realHeight / cellSize);
	width = columns * cellSize + 1;
	height = rows * cellSize + 1;

	//set size 
	lifeArea.setAttribute('width', width + 'px');
	lifeArea.setAttribute('height', height + 'px');
	weatherArea.setAttribute('width', width + 'px');
	weatherArea.setAttribute('height', height + 'px');
}
function drawAmbient() {
	for (let x = 0.5; x <= width; x += cellSize) {
		context.moveTo(x, 0);
		context.lineTo(x, height);
	}
	for (let y = 0.5; y <= height; y += cellSize) {
		context.moveTo(0, y);
		context.lineTo(width, y);
	}
	context.strokeStyle = "#aaa";
	context.stroke();
	let gradient = weatherContext.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, "#ff0");
	gradient.addColorStop(1, "#00f");
	weatherContext.fillStyle = gradient;
	weatherContext.fillRect(0, 0, width, height);
}
function renewField() {

	cell.forEach(column => {
		column.forEach(cellElement => {
			switch (cellElement.matter) {
				case 0:
					context.fillStyle = '#fff';
					break;
				case 1:
					context.fillStyle = botPool[cellElement.botIndex].color;
					break;
				case 2:
					context.fillStyle = '#550';
					break;
				case 3:
					context.fillStyle = '#005';
					break;
				default :
					debug('renewField: default color ' + cellElement.matter, 1);
			}
			context.fillRect(cell.indexOf(column) * cellSize + 1, column.indexOf(cellElement) * cellSize + 1, cellSize - 1, cellSize - 1);
			
			if (cellElement.botIndex !== undefined) {
				context.fillStyle = "#000";
				switch (botPool[cellElement.botIndex].direction) {
					case 0:
						context.fillRect(cell.indexOf(column) * cellSize + 1, column.indexOf(cellElement) * cellSize + 1, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 1:
						context.fillRect(cell.indexOf(column) * cellSize + cellDirectionMiddle, column.indexOf(cellElement) * cellSize + 1, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 2:
						context.fillRect(cell.indexOf(column) * cellSize + cellDirectionEnd, column.indexOf(cellElement) * cellSize + 1, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 3:
						context.fillRect(cell.indexOf(column) * cellSize + cellDirectionEnd, column.indexOf(cellElement) * cellSize + cellDirectionMiddle, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 4:
						context.fillRect(cell.indexOf(column) * cellSize + cellDirectionEnd, column.indexOf(cellElement) * cellSize + cellDirectionEnd, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 5:
						context.fillRect(cell.indexOf(column) * cellSize + cellDirectionMiddle, column.indexOf(cellElement) * cellSize + cellDirectionEnd, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 6:
						context.fillRect(cell.indexOf(column) * cellSize + 1, column.indexOf(cellElement) * cellSize + cellDirectionEnd, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
						break;
					case 7:
						context.fillRect(cell.indexOf(column) * cellSize + 1, column.indexOf(cellElement) * cellSize + cellDirectionMiddle, ((cellSize - 1) / 3), ((cellSize - 1) / 3));
				}
			}
		});
	});
}
function setDiffDNA(bot, position, gen) {
	bot.DNA[position] = gen;
}