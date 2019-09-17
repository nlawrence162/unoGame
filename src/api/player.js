//This controls each players hand. And is what is itertated through each turn.

class Player {
  name = "John Doe";
  hand = [];
  computer = true;
  plays = 0;

  constructor() {
    var first = ["Ron", "Iggy", "Kronk", "Ally", "Moyst", "Flatty", "Winter", "Freakin", "Boy", "Leaky",
      "Joane", "Flying", "Bob", "Regular", "Ilievin", "Texas", "Big", "Mr.", "Fruit", "Squish", "Syck",
      "Symour", "Prince", "River", "Green", "Oboe", "Wonder", "Dilly", "Christopher", "Dr.", "Italian"];
    var last = ["Gaytor", "Breadwater", "Pound", "Hydroblast", "Kirkcen", "Kilometere", "Man", "Floorboard", "Skeleton", "Pumpkinhead",
      "Jones", "Aeroplayne", "Jack", "Kanada", "Indiana", "Texas", "Chungus", "Squash", "Beatz", "Flute", "Bourbon",
      "Jungle", "Field", "Pickle", "Swanson", "Windhead", "Alfredo"];
    var middle = [" Diamond ", " Opal ", " Fetuccine ", " Master ", " Gonna ", " 'The Rock' ", " Brenard "];
    this.name = first[Math.floor(Math.random() * first.length)]
      + (Math.random() > 0.05 ? " " : middle[Math.floor(Math.random() * middle.length)])
      + last[Math.floor(Math.random() * last.length)];
  }

  draw(deck) {
    if (deck.length >= 1) this.hand.push(deck.pop());
  }

  playAI(playPile) {
    if (this.hand.length === 0) return false;

    var card2play = null;

    //First try to get a regular number card of the same color
    for (let i = 0; i < this.hand.length; i++)
      if (this.hand[i].type === "" && Player.validatePlay(playPile[playPile.length - 1], this.hand[i]))
        if (this.hand[i].color === playPile[playPile.length - 1].color)
          card2play = i;

    //Then try to find a special card of the same color
    if (card2play === null)
      for (let i = 0; i < this.hand.length; i++)
        if (this.hand[i].color !== "black" && Player.validatePlay(playPile[playPile.length - 1], this.hand[i]))
          if (this.hand[i].color === playPile[playPile.length - 1].color)
            card2play = i;

    //Then try to find a regular card of the same number (any color)
    if (card2play === null)
      for (let i = 0; i < this.hand.length; i++)
        if (this.hand[i].type === "" && Player.validatePlay(playPile[playPile.length - 1], this.hand[i]))
          card2play = i;

    //Then try to find a special card of any color
    if (card2play === null)
      for (let i = 0; i < this.hand.length; i++)
        if (this.hand[i].color !== "black" && Player.validatePlay(playPile[playPile.length - 1], this.hand[i]))
          card2play = i;

    //Oh god please have a super special card.
    if (card2play === null)
      for (let i = 0; i < this.hand.length; i++)
        if (Player.validatePlay(playPile[playPile.length - 1], this.hand[i]))
          card2play = i;

    //crap
    if (card2play === null)
      return { isPlayed: false, card: null }; //If no card can be played, function should be returned to repo, this is so the draw pile can be refilled if needed.

    playPile.push(this.hand.splice(card2play, 1)[0]);

    //wild cards choose color
    if (playPile[playPile.length - 1].type === "wild" || playPile[playPile.length - 1].type === "wild_picker")
      playPile[playPile.length - 1].color = Player.getBestColor(this.hand);

    return { isPlayed: true, card: playPile[playPile.length - 1] };
  }

  playPossible(pileCard) {
    for (let i = 0; i < this.hand.length; i++)
      if (Player.validatePlay(pileCard, this.hand[i])) return true;
    return false;
  }

  static validatePlay(pileCard, playCard) {
    if (playCard.color === "black") return true;
    if (pileCard.color === "black") return true;
    if (playCard.color === pileCard.color) return true;
    if (playCard.number !== -1 && playCard.number === pileCard.number) return true;
    if (playCard.number === -1 && playCard.type === pileCard.type) return true;
    return false;
  }

  static getBestColor(hand) {
    var color = "red";
    var colors = { red: 0, yellow: 0, green: 0, blue: 0 };

    for (let i = 0; i < hand.length; i++)
      colors[hand[i].color]++;

    for (var key of Object.keys(colors))
      if (colors[key] > colors[color]) color = key;

    return Math.random() > .05 ? color : Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)];//low chance of choosing random color. This prevents softlocks.
  }
}

export default Player;
