const rs = require('readline-sync');

const alphabet = 'abcdefghij'.toUpperCase();
let grid = []
let fleet = [
  {name: "Destroyer", size: 2, cords: []},
  {name: "Cruiser", size: 3, cords:[] },
  {name: "Sub", size: 3, cords: []},
  {name: "Battleship", size: 4, cords: []},
  {name: "Carrier", size: 5, cords: []}
];
let ships = [];
let playerStrikes = [];
let shipsRemaining;

const resetGame = () => {
  console.clear()
  grid = []
  ships = []
  playerStrikes = []
  shipsUnitsRemaining = 17
};

const createGrid = size => {
  let row;
  let col = 0;	
	for (row = 0; row < size; row++) {
		grid[row] = [];
		for (col = 0; col < size; col++) {
			grid[row][col] = `${alphabet[row]}${col + 1}`;
		}
	}
  return grid;
};

function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    let rowStr = '  ';
    for (let cell of grid[i]) {
      rowStr += cell + ' ';
    }
    console.log(rowStr)
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const createShips = () => {
  for (const [name, ship] of fleet.entries()) {
    generateShips(ship.size, name)
  }
}

function generateShips(shipSize, name) {
  const flatGrid = grid.flat();
  const index = () => Math.floor(Math.random() * flatGrid.length);
  let orientation = Math.floor(Math.random() * 2)
  let placed = false;
  let v = 0;
  let h = 1;
  
  while (!placed) {
    let cord = getRandomInt(index());
    let shipCords = [];
    shipCords.push(flatGrid[cord])
    for (let i = 1; i < shipSize; i++) {
      if (orientation === v) {cord += 10;}
      else {cord++}
      shipCords.push(flatGrid[cord]);
    }  
    if (commonalities(shipCords)) {
      placed = true;
      fleet[name].cords.push(...shipCords)
      ships.push(...shipCords);
    }
  } 
};

const commonalities = cords => { 
  let rowJump =
  (cords.includes('A10') && cords.includes('B1')) || 
  (cords.includes('B10') && cords.includes('C1')) || 
  (cords.includes('C10') && cords.includes('D1')) ||
  (cords.includes('D10') && cords.includes('E1')) || 
  (cords.includes('E10') && cords.includes('F1')) ||
  (cords.includes('F10') && cords.includes('G1')) ||
  (cords.includes('G10') && cords.includes('H1')) ||
  (cords.includes('H10') && cords.includes('I1')) || 
  (cords.includes('I10') && cords.includes('J1')) ||
  (cords.includes('J10') && cords.includes('A1')) ||
  (cords.includes(undefined));
  let outSideGrid = cords.some(cord => cord > grid.flat().length);
  let overlappingShips = cords.some(cord => ships.includes(`${cord}`));
  return !rowJump && !outSideGrid && !overlappingShips;  
};

const playerStrike = () => {
  isGameOver();
  printGrid(grid)
  let strike = rs.question(' Enter a location to strike ie \'A2\'... ');
  strike = strike.toUpperCase();
  if (!grid.flat().includes(strike)) {
    console.log('That is not a valid location. Please try again.');
    playerStrike();
  }
  checkPreviousStrikes(strike);
  playerStrikes.push(strike);
  checkForHit(strike);
  }

const checkPreviousStrikes = strike => {
  if (!playerStrikes.includes(strike)) return;
  console.log('You have already picked this location. Miss!');
  playerStrike();
};

const checkForHit = strike => {
  console.log(ships)
  let x = alphabet.indexOf(strike.slice(0, 1));
  let y = Number(strike.slice(1)) - 1;
  let ship = ships.find((cord) => cord === strike)
    if (ship === strike) {
      shipsUnitsRemaining--;
      grid[x][y] = ' X';
      console.log(`Hit!`);
    }
    else {
      grid[x][y] = ' O';
      console.log('You have missed!')
    };
    
    playerStrike();
};

const isGameOver = () => {
  if (shipsUnitsRemaining === 0) {
    console.log('You have destroyed all battleships.');
    if (rs.keyInYN(' Would you like to play again? ')) {
      startGame();
    }
    console.log('Goodbye!');
    process.exit();
  }
};

const startGame = () => {
  resetGame();
  rs.keyIn('Press any key to start game')
  createGrid(alphabet.length)
  createShips(fleet)
  playerStrike();
};

startGame();