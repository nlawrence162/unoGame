//This controls each players hand. And is what is itertated through each turn.

class Player {
  name = "John Doe";
  hand = [];
  computer = true;
  plays = 0;

  constructor() {
    var first = ["Ron", "Iggy", "Kronk", "Ally", "Flatty", "Winter", "Freakin", "Boy", "Leaky", "Shelly","Joane", "Flying", "Bob", "Regular", "Ilievin", 
    "Texas", "Big", "Mr.", "Fruit", "Squish", "Syck", "Rich","Symour", "Prince", "River", "Green", "Oboe", "Wonder", "Dilly", "Christopher", "Dr.", "Italian"];
    var last = ["Gaytor", "Breadwater", "Pound", "Hydroblast", "Kirkcen", "Kilometere", "Man", "Floorboard", "Skeleton", "Pumpkinhead", "Jones", "Aeroplayne", "Jack", 
    "Kanada", "Indiana", "Texas", "Chungus", "Squash", "Beatz", "Flute", "Bourbon", "Mahogany","Jungle", "Field", "Pickle", "Swanson", "Windhead", "Alfredo", "Swiper"];
    var middle = [" Fetuccine ", " 'The Rock' ", " Von ", " O' "];
    this.name = first[Math.floor(Math.random() * first.length)]
      + (Math.random() > 0.05 ? " " : middle[Math.floor(Math.random() * middle.length)])
      + last[Math.floor(Math.random() * last.length)];
  }

  draw(deck) {
    if (deck.length >= 1) this.hand.push(deck.pop());
  }

  playAI(playPile) {
    //If no card can be played, function should be returned to repo, this is so the draw pile can be manipulated as needed.
    if (!this.playPossible(playPile[playPile.length - 1]))
      return { isPlayed: false, card: null };

    var pileCard = playPile[playPile.length - 1];
    var currentCardObj = { card: this.hand[0], rank: 6 };

    for (let i = 0; i < this.hand.length; i++) {
      var validatedObj = Player.validatePlay(pileCard, this.hand[i]);
      if (validatedObj.play && validatedObj.rank < currentCardObj.rank) {
        currentCardObj = { card: this.hand[i], rank: validatedObj.rank };
      }
    }

    playPile.push(this.hand.splice(this.hand.indexOf(currentCardObj.card), 1)[0]);
    pileCard = playPile[playPile.length - 1];

    //wild cards choose color
    if (pileCard.type === "wild" || pileCard.type === "wild_picker")
      pileCard.color = Player.getBestColor(this.hand);

    return { isPlayed: true, card: pileCard };
  }

  //Checks each card in this players hand against the top card of the play pile.
  playPossible(pileCard) {
    for (let i = 0; i < this.hand.length; i++)
      if (Player.validatePlay(pileCard, this.hand[i]).play) return true;
    return false;
  }

  static validatePlay(pileCard, playCard) {
    if (pileCard.color === "black") return { play: true, rank: 0 };//So that when you are chosing a color, it dosn't prompt you to draw a card.
    var rank = 0;

    if (playCard.color === pileCard.color) { //Color match
      rank = 1; //Number cards
      if (playCard.number === -1) rank = 2; //Special cards
    }
    if (playCard.number !== -1) { //Number cards
      if (playCard.number === pileCard.number) rank = 3; //Number match
    }
    else { //Special cards
      if (playCard.type === pileCard.type) rank = 4; //Type match
    }
    if (playCard.color === "black") rank = 5; //Wild cards match

    if (rank === 0) return { play: false, rank: -1 };
    else return { play: true, rank: rank };
  }

  static getBestColor(hand) {
    var color = "red";
    var colors = { red: 0, yellow: 0, green: 0, blue: 0 };

    for (let i = 0; i < hand.length; i++)
      colors[hand[i].color]++;

    for (var key of Object.keys(colors))
      if (colors[key] > colors[color]) color = key;

    return color;
  }
}

export default Player;