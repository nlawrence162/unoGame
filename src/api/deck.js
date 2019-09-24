//This creates a deck object that stores the correct setup of a deck.
/**
 * The deck consists of 108 cards:
 * Four each of "Wild" and "Wild Draw Four"
 * 25 cards for 4 different colors (red, yellow, green, blue).
 * Each color consists of one zero, two each of 1 through 9, and two each of "Skip," "Draw Two," and "Reverse."*
 * *These last three types are known as "action cards."
 */

class Card {
  type = ""; //Name of card. Used for defining action cards. Empty string means a number card.
  color = "black"; //If card has no color(black), it will always match. (Wild, Wild Draw Four)
  number = -1; //Placeholder
}

const colors = ["red", "yellow", "green", "blue"];

class Deck {
  cards = [];

  constructor() {
    let newCard;
    //Color cards.
    for (let c = 0; c < 4; c++) {
      //Number cards
      for (let i = 0; i < 10; i++) {
        if (i === 0) {
          //Only one zero card.
          newCard = new Card();
          newCard.color = colors[c];
          newCard.number = i;
          this.cards.push(newCard);
        } else {
          //Two of each other card
          newCard = new Card();
          newCard.color = colors[c];
          newCard.number = i;
          this.cards.push(newCard);

          newCard = new Card();
          newCard.color = colors[c];
          newCard.number = i;
          this.cards.push(newCard);
        }
      }
      //Action cards
      for (let i = 0; i < 2; i++) {
        newCard = new Card();
        newCard.type = "skip";
        newCard.color = colors[c];
        this.cards.push(newCard);

        newCard = new Card();
        newCard.type = "picker";
        newCard.color = colors[c];
        this.cards.push(newCard);

        newCard = new Card();
        newCard.type = "reverse";
        newCard.color = colors[c];
        this.cards.push(newCard);
      }
    }
    //Wild Cards
    for (let i = 0; i < 4; i++) {
      newCard = new Card();
      newCard.type = "wild";
      this.cards.push(newCard);

      newCard = new Card();
      newCard.type = "wild_picker";
      this.cards.push(newCard);
    }
  }
}

export default Deck;
