import Deck from "./deck.js";
import Player from "./player.js";

//This is the repo. It creates decks and players, and manages the state of the game.

class Repo {
  deck = new Deck().cards;
  playPile = [];
  players = [];

  shuffle() {
    //Fisher–Yates shuffle: https://bost.ocks.org/mike/shuffle/
    var m = this.deck.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);//Sneaky decrement

      // And swap it with the current element.
      t = this.deck[m];
      this.deck[m] = this.deck[i];
      this.deck[i] = t;
    }
  }

  updateDeck() {
    //oh crap theres no cards left  :O *gasp*
    this.playPile.unshift(this.playPile.pop()); //Move last card to first position to preserve it.
    const length = this.playPile.length - 1; //Variable used to keep it constant through the loop
    for (let i = 0; i < length; i++) {
      this.deck.push(this.playPile.pop()); //not sponsored by push pops
      if (this.deck[this.deck.length - 1].type === "wild" || this.deck[this.deck.length - 1].type === "wild_picker") {
        //change wild cards back to "black"
        this.deck[this.deck.length - 1].color = "black";
      }
    }
    this.shuffle();
  }

  addPlayer() {
    this.players.push(new Player());//Player object
    for (let i = 0; i < 7; i++)//Add cards from the deck
      this.players[this.players.length - 1].hand.push(this.deck.pop());
  }

  doAPlayAI(playerIndex) {
    while (true) {
      var play = this.players[playerIndex].playAI(this.playPile);
      if (this.deck.length === 0) this.updateDeck();
      if (play["isPlayed"]) {
        return play.card;
      } else if (this.deck.length === 0 && this.playPile.length === 1)
        return null;
      //Draw if couldn't play
      this.players[playerIndex].draw(this.deck);
    }
  }

  validatePlay(a, b) {
    return Player.validatePlay(a, b).play;
  }

  playerExists() {
    for (let player of this.players)
      if (player.computer === false)
        return true;

    return false;
  }

  constructor() {
    //Shuffle by default
    this.shuffle();
    this.playPile.push(this.deck.pop()); //Take one off the top

    /*
    //Make sure its a regular card to avoid first turn madness
    while (this.playPile[this.playPile.length - 1].type !== "") {
      this.deck.unshift(this.playPile.shift());//Put it back
      this.playPile.push(this.deck.pop());//Grab a new one
    }
    */

    //Add a non-computer player
    this.addPlayer();
    this.players[0].computer = false;
  }
}

export default Repo;
