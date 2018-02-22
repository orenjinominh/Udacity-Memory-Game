// List called cards containing icons to be revealed.
var cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];


// Variable Declaration:
// (a) chosenCards: list used to store the attributes of the two cards selected by player
// (b) move: Variable to store how many moves the player has made.
// (c) foundMatch: Variable to store how many matches were found.
// (d) star: variable holding string of how many stars player has left
var chosenCards = [];
var move = 0;
var foundMatch = 0;
var star = "3";

// FUNCTION TO RESTART GAME
function restartGame() {
  //listens for player's click on replay button, then reloads the game board
  $("#replay").on("click", function() {
      location.reload();
  });
}

restartGame();

// SHUFFLE CARDS (function from http://stackoverflow.com/a/2450976)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
                    /*SCOREKEEPING AND TIMEKEEPING FUNCTIONS */
// TIMER FUNCTION THAT STARTS WHEN PLAYER FIRST CLICKS GAME BOARD
function timer() {
  let clicks = 0;
  $(".card").on("click", function() {
    clicks += 1;
    if (clicks === 1) {
      var sec = 0;
      function time ( val ) { return val > 9 ? val : "0" + val; }
      timer = setInterval( function(){
        $(".seconds").html(time(++sec % 60));
        $(".minutes").html(time(parseInt(sec / 60, 10)));
      }, 1000);
    }
  });
 }

// FUNCTION TO INCREMENT MOVES AND UPDATE STARS ON GAME BOARD
function starRating(moves) {
  //changes the text of moves on the game board
  if (move === 1) {
    $('#movesWereMade').text(" move was made.");
  }
  else {
    $('#movesWereMade').text(" moves were made.");
  }
  $('#moves').text(move.toString());
  //updates stars on game board
  if (move > 0 && move < 15) {
    star = star;
  } else if (move >= 15 && move <= 30) {
    $("#first").removeClass("fa-star");
    star = "2";
  } else if (move > 30) {
    $("#second").removeClass("fa-star");
    star= "1";
  }
}
                    /* HELPER FUNCTIONS FOR MAIN GAME PLAY */

// FUNCTION CREATES HTML AND APPENDS TO DECK
function generateCard() {
  cards = shuffle(cards);
  cards.forEach(function(card) {
    $(".deck").append('<li><i class="card fa ' + card + '"></i></li>');
  });
}

//FUNCTION DISABLES CLICKS ON CARDS THAT MATCH
function disableClick(){
  $(chosenCards[0]).off("click");
  $(chosenCards[1]).off("click");
}


//FUNCTION TO REMOVE CLASSES FROM CARDS
function removeClasses() {
  $(".card").removeClass("show open nomatch");
  resetChosenCards();
}

//FUNCTION REMOVES CHOSEN CARDS AND STARTS OVER
function resetChosenCards() {
  chosenCards = [];
}

                    /* MAIN GAME PLAY FUNCTION */
function playGame() {
    $(".card").on("click", function() {
        // if player clicks on card already open, nothing happens
        if ($(this).hasClass("open show")) { return; }
        //get the HTML of the clicked on card, reveal it, then push it to chosenCards for comparison
        $(this).toggleClass("open show");
        chosenCards.push($(this));
        // if there are two cards, time to compare!
        if (chosenCards.length === 2) {
            // once two cards are chosen, disable clicks on other cards
            $(".card").off("click");
            let chosenCard1 = chosenCards[0][0].classList[2];
            let chosenCard2 = chosenCards[1][0].classList[2];
            if (chosenCard1 === chosenCard2) {
              chosenCards[0][0].classList.add("match");
              chosenCards[1][0].classList.add("match");
              disableClick();
              resetChosenCards();
              foundMatch++;
              move++;
              youWin();
            } else {
              //if their classes don't match, add class "nomatch"
              chosenCards[0][0].classList.add("nomatch");
              chosenCards[1][0].classList.add("nomatch");
              resetChosenCards();
              setTimeout(removeClasses, 500);
              move++;
            }
            //enables clicks again on all cards 
            $(".card").on("click", playGame());
        }
  starRating();
    });
}

// WINNER POPUP FUNCTION (source: https://www.w3schools.com/howto/howto_css_modals.asp)
function youWin() {

  if (foundMatch === 8) {

    var modal = document.getElementById("you-win");
    var span = document.getElementsByClassName("close")[0];

    $("#final-moves").text(move);
    $("#final-stars").text(star);

    modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

   $("#play-again-btn").on("click", function() {
       location.reload();
   });

   clearInterval(timer);


 }
}

//CALL FUNCTIONS
generateCard();
playGame();
timer();
