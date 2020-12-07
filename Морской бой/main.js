var view = {
    displayMessage: function(msg){
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3, 
    shipLength: 3,
    shipSunk: 0,

    ships: [
        ship1 = { location: ['10', '20', '30'], hits: ['', '', ''] },
        ship2 = { location: ['34', '35', '45'], hits: ['', '', ''] },
        ship3 = { location: ['64', '65', '66'], hits: ['', '', ''] }
    ],

    fire: function(guess){
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);

            if(ship.hits[index] === "hit"){
                view.displayMessage("ТЫ УЖЕ СЮДА ТЫКАЛ!!!");
                return true;
            }else if(index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("ПОПАЛ!!!");

                if(this.isSunk(ship)){
                    view.displayMessage("U SUNK MY CORABL!!!");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("ПРОМАЗАЛ!!!");
        return false;
    },
     
    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(){
            for (var i = 0; i < this.numShips; i++) {
               do {
               var location = this.generateShip();
            } while (this.collision(location));
            this.ships[i].location = location;
            }
},

    generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) { // horizontal
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    } else { // vertical
        row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
        if (direction === 1) {
            newShipLocations.push(row + "" + (col + i));
        } else {
            newShipLocations.push((row + i) + "" + col);
        }
    }
    return newShipLocations;
},

collision: function(location) {
    for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        for (var j = 0; j < location.length; j++) {
            if (ship.location.indexOf(location[j]) >= 0) {
                return true;
            }
        }
    }
    return false;
}

};

var controller = {
  guesses: 0,

  processGuess: function(guess){
   var location = parceGuess(guess);
   if(location){
       this.guesses++;
       var hit = model.fire(location);
       if(hit && model.shipSunk === model.numShips){
         view.displayMessage("Полная победа! УХУ !! ");
       }
   }
  }
};


function parceGuess(guess){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null || guess.length !== 2){
        alert("Неправильные координаты");
    }else{
       firstChar = guess.charAt(0);
       var row = alphabet.indexOf(firstChar);
       var column = guess.charAt(1);
       
       if(isNaN(row) || isNaN(column)){
        alert("Неправильные координаты");
       }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
        alert("Неправильные координаты");
       }else{
           return row + column;
       }
    }
    return null;
}
 
function init(){
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
}

function handleFireButton(){
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e){
    var fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

 window.onload = init;