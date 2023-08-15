/* Create a new card element (i.e. .card), ppend it as a child to the parentElement
 * (i.e. #card-container), and return the new card element.
 */
function appendNewCard(parentElement) {
  // Make a variable for the card element. Assign it to a new div element.
  let cardElement = document.createElement("div");

  // Add the "card" class to the card element.
  cardElement.classList.add("card");

  // Add glow when hovering over faced down cards
  cardElement.classList.add("glow-on-hover");

  // Write the HTML for the children of the card element (card-down and card-up) as a normal string and assign it as the innerHTML of the card element.
  cardElement.innerHTML = `<div class="card-down"></div>
  <div class="card-up"></div>`;

  // Append the card element to the parentElement, making the card element a "child".
  parentElement.append(cardElement);

  // Return the card element.
  return cardElement;
}

/* Testing appendNewCardTest() */
// appendNewCardTest();

/* Returns an array with 12 randomly ordered image classes (i.e. image-X, where X
 * is a value between 1 and 6). There should be exactly 2 of each image class in the array.
 */
function shuffleCardImageClasses() {
  let imageArray = [];
  // Initialize an array of 2 of each image class strings in-order (e.g. "image-1", "image-1", "image-2"...)
  let j = 0;
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      j++;
    }

    imageArray[i] = "image-" + j;
  }

  // Randomly "shuffle" the array.
  let shuffledCards = _.shuffle(imageArray);

  // Return the shuffled array of class names.
  return shuffledCards;
}

/* Testing shuffleCardImageClassesTest() */
// shuffleCardImageClassesTest();

/* For each of the 12 cards in the game, this function will create a card,
 * assign it a random image class, and create an object to represent that
 * card in the program.
 * The 'parentElement' parameter is the DOM element where the cards should
 * be appended as children (i.e. #card-container).
 * The 'shuffledImageClasses' parameter is an array of 12 image class strings
 * (e.g. "image-1", "image-5", "image-3"...) randomly ordered and with 2
 * strings from each image class.
 * Returns an array of card objects to track all the cards for the rest of the program.
 */
function createCards(parentElement, shuffledImageClasses) {
  // Make an empty array to hold our card objects.
  let cards = [];

  // Loop 12 times to create the 12 cards we need.
  for (let i = 0; i < 12; i++) {
    // Use appendNewCard to create/append a new card and store the result in a variable.
    let newCard = appendNewCard(parentElement);

    // Add an image class to the new card element, using shuffledImageClasses[i].
    newCard.classList.add(shuffledImageClasses[i]);

    // Create a new object representing this card.
    const cardObject = {
      index: i,
      element: newCard,
      imageClass: newCard.classList,
    };

    // Append the new card object to the array of card objects.
    cards[i] = cardObject;
  }

  // Return the array of 12 card objects.
  return cards;
}

/* Testing createCardsTest() */
// createCardsTest();

/* Given two card objects, this will check if the card objects show the same
 * image when flipped.
 * The 'cardObject1' parameter is the first card object in the comparison.
 * The 'cardObject2' parameter is the second card object in the comparison.
 * Return 'true' when both cards have the same imageClass property and 'false' otherwise.
 */
function doCardsMatch(cardObject1, cardObject2) {
  return _.isEqual(cardObject1.imageClass, cardObject2.imageClass);
}

/* Testing doCardsMatchTest() */
// doCardsMatchTest();

// An object used to store counter names and their respective values.
let counters = {};

/* Adds one to a counter being displayed on the webpage (meant for counting flips and matches).
 * The 'counterName' parameter is the string representing the name of the counter to increment
 * (e.g. "flip").
 * The 'parentElement' parameter is the DOM element that shows the counter
 * (e.g. <span id="flip-count"> in the HTML). The 'innerHTML' of this element determines what
 * value is displayed for the counter.
 * Use the global 'counters' object above to store counter names and their respective values
 * and update the DOM to show the new counter value when changed.
 */
function incrementCounter(counterName, parentElement) {
  // If the 'counterName' property is not defined in the 'counters' object, add it with a value of 0.
  if (counters[counterName] === undefined) {
    counters[counterName] = 0;
  }

  // Increment the counter for 'counterName'.
  counters[counterName]++;

  // Change the DOM within 'parentElement' to display the new counter value.
  parentElement.innerHTML = counters[counterName];
}

/* Testing incrementCounterTest() */
// incrementCounterTest();

// Variables storing an audio objects to make the various sounds.
let clickAudio = new Audio("assets/audio/click.wav");
let matchAudio = new Audio("assets/audio/thanosSnap.mp3");
let winAudio = new Audio("assets/audio/avengersAssemble.mp4");

/* Attaches a mouseclick listener to a card (i.e. onclick), flips the card when clicked,
 * and calls the function 'onCardFlipped' after the flip is complete.
 * The 'cardObject' parameter is a custom card object we created in the 'createCards' function.
 * This function will make the card element associated with 'cardObject' clickable and call
 * onCardFlipped with that cardObject after the flip is complete.
 */
function flipCardWhenClicked(cardObject) {
  // Adds an "onclick" attribute/listener to the element that will call the function below.
  cardObject.element.onclick = function () {
    // if card is already flipped, return.
    if (cardObject.element.classList.contains("flipped")) {
      return;
    }

    // Play the "click" sound.
    clickAudio.play();

    // Add the flipped class immediately after a card is clicked.
    cardObject.element.classList.add("flipped");

    // Remove glow when hovering over flipped cards
    cardObject.element.classList.remove("glow-on-hover");

    // Wait 500 milliseconds (1/2 of a second) for the flip transition to complete and then call onCardFlipped.
    setTimeout(function () {
      onCardFlipped(cardObject);
    }, 500);
  };
}

// This variable is used to remember the first card flipped while waiting for the user to flip another card.
let lastCardFlipped = null;

/* This is called each time the user flips a card and should handle and track the game mechanics
 * like: "Is this the first or second card flipped in a sequence?", "Do the cards match", and
 * "Is the game over?"
 * The 'newlyFlippedCard' parameter is a custom card object that has just been flipped.
 */
function onCardFlipped(newlyFlippedCard) {
  // Add one to the flip counter UI.
  incrementCounter("flip", document.getElementById("flip-count"));

  // if the first card flipped is null
  if (lastCardFlipped === null) {
    // set lastCardFlipped to newlyFlippedCard
    lastCardFlipped = newlyFlippedCard;
  }
  // else check if both flipped cards match
  else {
    // if second card does not match the first card
    if (doCardsMatch(lastCardFlipped, newlyFlippedCard) !== true) {
      //flip both cards back
      lastCardFlipped.imageClass.remove("flipped");
      newlyFlippedCard.imageClass.remove("flipped");

      // add the glow-on-hover effects back to the now faced down cards
      lastCardFlipped.imageClass.add("glow-on-hover");
      newlyFlippedCard.imageClass.add("glow-on-hover");

      // reset lastCardFlipped to null
      lastCardFlipped = null;
    } else {
      // Increment the match counter
      incrementCounter("matches", document.getElementById("match-count"));

      // if all cards have been matched
      if (counters["matches"] === 6) {
        // add a glow to all cards
        for (let i = 0; i < 12; i++) {
          console.log(
            document.querySelectorAll(".flipped")[i].classList.add("glow-all")
          );
        }

        document
          .querySelector(".animate__animated")
          .classList.add("animate__infinite");

        // play win Avengers Assemble (win) audio
        winAudio.play();
      } else {
        // play Thanos snap audio when player has a match
        matchAudio.play();

        // add a glow to the matched cards
        lastCardFlipped.imageClass.add("glow");
        newlyFlippedCard.imageClass.add("glow");
      }
    }

    // Reset lastCardFlipped to null
    lastCardFlipped = null;
  }
}

// Set up the game.
let cardObjects = createCards(
  document.getElementById("card-container"),
  shuffleCardImageClasses()
);

if (cardObjects != null) {
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}
