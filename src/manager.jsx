import React from "react";
import Repo from "./api/repo.js";
import PlayPile from "./components/playpile.jsx";
import Hand from "./components/hand.jsx";
import Dialogs from "./components/dialogs.jsx";

import "./styles/background.css";
import "./styles/buttons.css";
import "./styles/options.css";
import "./styles/rules.css";
import "./styles/hand.css";

//This manages the game. Calls on the repo to change values, and controlls logic.
class Game extends React.Component {
  repo = new Repo();

  //manager data
  currentPlayer = 0;
  reversed = false;
  skip = false;
  forceDraw = 0;
  currentColor = "black";

  //options data
  optionsOpen = false;
  autoPlayAI = false;
  stopOnPlayer = false;
  hideComputers = false;

  //used for the snake
  turnCount = 0;

  //dialog data
  colorOpen = false;
  winnerOpen = false;
  winningMessage = "";
  rules1Open = true;
  rules2Open = false;
  rules3Open = false;
  helpOpen = false;

  constructor(props) {
    super(props);
    this.currentColor = this.repo.playPile[this.repo.playPile.length - 1].color;

    //On right arrow key press
    window.onkeydown = (e) => {
      if (e.keyCode === 39 && !this.colorOpen && !this.winnerOpen) {
        this.turnAI();
      }
    }
  }

  //Called when a card is clicked on, with the card that was clicked passed in.
  turnPlayer = card => {
    var player = this.repo.players[this.currentPlayer];

    //If the card is a valid play.
    if (this.repo.validatePlay(this.repo.playPile[this.repo.playPile.length - 1], card)) {
      this.turnCount++;//Increase fun turn value to make the snake move
      player.plays++;//Used for win message and info
      this.repo.playPile.push(
        player.hand.splice(player.hand.indexOf(card), 1)[0]
      );//Add the card to the play pile and remove it from the players hand.

      //Reverse
      if (card.type === "reverse") {
        if (this.repo.players.length <= 2) this.skip = true;//Skip if there is only two players.
        else this.reversed = !this.reversed; //Flip the variable
      }
      //Skip
      if (card.type === "skip") {
        this.skip = true;//Next player will be skipped
      }
      //Draw
      if (card.type === "picker") {
        this.forceDraw = 2;//Next player will draw two before there turn starts.
      }
      if (card.type === "wild_picker") {
        this.forceDraw = 4;//Next player will draw four before there turn starts.
      }
      //manual color selection
      if (card.type === "wild" || card.type === "wild_picker") {
        this.colorOpen = true;//Opens the color selection menu for wild cards.
        this.forceUpdate();
      }
      //Now that card has been fully played. Destroy this boi.
      this.removeWinningPlayer(player);

      //set current color to color of top playPile card
      this.currentColor = this.repo.playPile[this.repo.playPile.length - 1].color;//Used for the draw pile backround color

      //Next player
      if (this.skip) {
        this.currentPlayer = this.nextPlayer()
        this.skip = false;
      }
      this.currentPlayer = this.nextPlayer()

      this.forceDrawPlayer();
    }
    else if (card === "card_back_alt") {
      //Else draw a card
      this.repo.players[this.repo.players.indexOf(player)].draw(this.repo.deck);
      if (this.repo.deck.length === 0) this.repo.updateDeck();
    }

    //Make sure the AI dosn't auto play if there is no player to stop at.
    if (!this.repo.playerExists()) {
      this.autoPlayAI = false;
    }

    //Autoplay
    if (this.colorOpen === false && this.autoPlayAI === true && this.repo.players[this.currentPlayer].computer === true) {
      this.turnAI();
    }

    //update
    this.forceUpdate();
  }
  turnAI = () => {
    if (this.repo.players.length === 0) return;
    var player = this.repo.players[this.currentPlayer];
    if (player.computer === false && this.stopOnPlayer === true) return;

    //the turn
    this.turnCount++;
    player.plays++;
    var playedCard = this.repo.doAPlayAI(this.repo.players.indexOf(player));

    this.removeWinningPlayer(player);

    if (playedCard !== null) {
      //Reverse
      if (playedCard.type === "reverse") {
        if (this.repo.players.length <= 2) this.skip = true;
        else this.reversed = !this.reversed;
      }
      //Skip
      if (playedCard.type === "skip") {
        this.skip = true;
      }
      //Draw
      if (playedCard.type === "picker") {
        this.forceDraw = 2;
      }
      if (playedCard.type === "wild_picker") {
        this.forceDraw = 4;
      }
    }
    //set current color to color of top playPile card
    this.currentColor = this.repo.playPile[this.repo.playPile.length - 1].color;

    //All actions are done. Move to next player.
    if (this.skip) {
      this.currentPlayer = this.nextPlayer()
      this.skip = false;
    }
    this.currentPlayer = this.nextPlayer()

    //Force draw next player
    this.forceDrawPlayer();

    if (!this.repo.playerExists()) {
      this.autoPlayAI = false;
    }
    //Update render
    this.forceUpdate();

    if (this.autoPlayAI === true && this.repo.players[this.currentPlayer].computer === true) {
      this.turnAI();
    }
  }

  //Turn functions
  nextPlayer() {
    var currentPlayer = this.currentPlayer;
    currentPlayer += this.reversed ? -1 : 1;//If reversed, remove one, if else, add one.
    if (currentPlayer < 0)//Checks if it broke boundries.
      currentPlayer = Math.max(0, this.repo.players.length - 1);//Under zero
    if (currentPlayer > this.repo.players.length - 1)
      currentPlayer = 0;//Over max, go back to start.
    return currentPlayer;
  }
  removeWinningPlayer(player) {
    if (player.hand.length === 0) {
      this.winningMessage = player.name + " has won in " + player.plays + " turns!";//Set the winning message.
      this.winnerOpen = true;//Set the message to open
      this.repo.players.splice(this.repo.players.indexOf(player), 1);//Remove the player
      this.forceUpdate();
      //adjust current player
      this.currentPlayer += this.reversed ? 0 : 1;
      if (this.currentPlayer > this.repo.players.length - 1)
        this.currentPlayer = 0;
    }
  }
  forceDrawPlayer() {
    while (this.forceDraw > 0) {
      this.forceDraw--;
      if (this.repo.players.length > 0) this.repo.players[this.currentPlayer].draw(this.repo.deck);
      if (this.repo.deck.length === 0) this.repo.updateDeck();
    }
  }

  //Play Buttons
  renderButtons() {
    return (
      <div style={{ display: 'inline-block', transform: "translateY(-3px)" }}>
        <button className="w3-button turnButton" onClick={this.turnAI}><span>Advance one turn</span></button>
        <button className="w3-button addAIButton" onClick={this.addAI}><span>Add Computer</span></button>
        <button className="w3-button addPlayerButton" onClick={this.addPlayer} style={{ marginRight: "10px" }}><span>Add player</span></button>
      </div>
    );
  }
  addAI = () => {
    if (this.repo.deck.length <= 7) this.repo.updateDeck();
    if (this.repo.deck.length > 7) {
      this.repo.addPlayer();
      this.forceUpdate();
    }
  }
  addPlayer = () => {
    if (this.repo.deck.length <= 7) this.repo.updateDeck();
    if (this.repo.deck.length > 7) {
      this.repo.addPlayer();
      this.repo.players[this.repo.players.length - 1].computer = false;
      this.forceUpdate();
    }
  }

  //Dialog actions
  closeRulesDialog = (value, next) => {
    switch (value) {
      case 1:
        document.getElementById("curtain").className = "curtain"
        if (next) {
          this.rules2Open = true;
        }
        else {
          document.getElementById("rulesButton").className = "w3-button rules"
        }
        this.rules1Open = false;
        break;

      case 2:
        if (next) {
          this.rules3Open = true;
        }
        else {
          document.getElementById("rulesButton").className = "w3-button rules"
        }
        this.rules2Open = false;
        break;

      case 3:
        this.rules3Open = false;
        document.getElementById("rulesButton").className = "w3-button rules"
        break;

      default:
        break;
    }
    this.forceUpdate();
  }
  closeWinDialog = () => {
    this.winnerOpen = false;
    this.forceUpdate();
  }
  closeColorDialog = color => {
    if (this.colorOpen) {
      this.colorOpen = false;
      this.currentColor = color;
      this.repo.playPile[this.repo.playPile.length - 1].color = this.currentColor;
      this.forceUpdate();
      if (this.autoPlayAI === true && this.repo.players[this.currentPlayer].computer === true) {
        this.turnAI();
      }
    }
  }
  toggleHelpDialog = () => {
    if (this.optionsOpen) {
      this.helpOpen = !this.helpOpen;
      this.forceUpdate();
    }
  }

  //Options
  renderOptions() {
    return (
      <div id="optionsContainer" style={{ display: 'inline-block', transform: "translateX(-1px) translateY(-1px)", width: "450px" }}>
        <div id="optionsBorder" style={{ display: 'inline-block', border: "1px solid #f1f1f1" }}>
          <button id="cogButton" className="w3-button cog" onClick={this.toggleOptionsMenu}><i className="glyphicon glyphicon-cog w3-large" /></button>
          <div id="whiteBox" className="whitebox"></div>
          <button className={this.autoPlayAI ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.toggleOption(1)}>Autoplay</button>
          <button className={this.hideComputers ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.toggleOption(3)}>Hide AI</button>
          <button className={this.stopOnPlayer ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.toggleOption(2)}>No Skip</button>
          <button className={"w3-button obutton ob2 wiggle"} onClick={this.toggleHelpDialog}><div><div>?</div></div></button>
        </div>
      </div>
    );
  }
  toggleOptionsMenu = () => {
    if (this.optionsOpen) {
      this.optionsOpen = false;
      document.getElementById("cogButton").className = "w3-button cog";
      document.getElementById("whiteBox").className = "whitebox";
    }
    else {
      this.optionsOpen = true;
      document.getElementById("cogButton").className = "w3-button cogspin";
      document.getElementById("whiteBox").className = "whitebox squish";
    }
    this.forceUpdate();
  }
  toggleOption(option) {
    switch (option) {
      case 1:
        this.autoPlayAI = !this.autoPlayAI;
        break;

      case 2:
        this.stopOnPlayer = !this.stopOnPlayer;
        break;

      case 3:
        this.hideComputers = !this.hideComputers;
        break;

      default:
        break;
    }
    this.forceUpdate();
  }

  //Hand renderer
  renderHands() {
    if (this.repo.players.length === 0) {
      return (
        <div>
          <h2 style={{ margin: "5px" }}>
            Use the <span style={{ fontStyle: "italic", color: "coral" }}>Add Computer</span> and
            <span style={{ fontStyle: "italic", color: "MediumTurquoise " }}> Add Player</span> buttons to continue playing.
          </h2>
        </div >
      );
    }

    var hands = [];
    for (let i = 0; i < this.repo.players.length; i++) {
      if (!this.repo.players[i].computer && i === this.currentPlayer) {
        hands.push(this.renderPlayerHand(i));
      } else {
        hands.push(this.renderStaticHand(i));
      }
    }

    return <>{hands}</>;
  }
  renderPlayerHand(i) {
    let hand = [];
    hand.push(React.createElement("h3", { key: i + this.repo.players.length }, this.repo.players[i].name + "'s hand:"));
    hand.push(React.createElement(Hand, {
      player: this.repo.players[i],
      cardSetter: this.turnPlayer,
      canPlay: this.repo.players[i].playPossible(this.repo.playPile[this.repo.playPile.length - 1]),
      key: i
    }));
    return React.createElement("div", { key: i, id: i, style: (i === this.currentPlayer) ? { border: "3px blue", borderStyle: "double none", borderRadius: "10px", padding: "3px" } : { padding: "5px" } }, hand);
  }
  renderStaticHand(i) {
    let hand = [];
    if (!this.repo.players[i].computer || !this.hideComputers) {
      hand.push(<h3 key={i + this.repo.players.length}>{this.repo.players[i].name + "'s hand:"}</h3>);
      hand.push(<Hand player={this.repo.players[i]} key={i} />);
    }
    else {
      var msg = this.repo.players[i].name + " (" + this.repo.players[i].hand.length + (this.repo.players[i].hand.length === 1 ? " Card Hidden)" : " Cards Hidden)");
      hand.push(React.createElement("h3", { key: i + this.repo.players.length }, msg));
    }
    return React.createElement("div", { key: i, id: i, style: (i === this.currentPlayer) ? { border: "3px coral", borderStyle: "double none", borderRadius: "10px", padding: "3px" } : { padding: "6px 3px" } }, hand);
  }

  //Background
  renderBackground() {
    return (
      <div className="area" >
        <ul className={"circles c-" + this.currentColor + " " + (this.reversed ? "c-up" : "c-down")}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div >
    );
  }

  render() {
    return (
      <div>
        {this.renderBackground()}

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

        <div id="curtain"></div>

        {this.renderButtons()}
        {this.renderOptions()}

        <button
          id="rulesButton"
          className="w3-button rulesHide"
          style={{ marginTop: "5px", width: "100px", borderRadius: "12px" }}
          onClick={() => { this.closeRulesDialog(1, true); document.getElementById("rulesButton").className = "w3-button rulesPressed" }} >
          <span style={{ float: "left" }}>rules</span>
        </button>

        <h3 style={{
          paddingBottom: "3px",
          borderLeft: "4px solid " + this.currentColor,
          backgroundColor: "light" + (this.currentColor === "red" ? "coral" : this.currentColor)
        }}> &nbsp;Play Pile: </h3>
        <PlayPile playPile={this.repo.playPile} turnCount={this.turnCount} />

        {this.renderHands()}

        <Dialogs
          colorOpen={this.colorOpen}
          winnerOpen={this.winnerOpen}
          winningMessage={this.winningMessage}
          rules1Open={this.rules1Open}
          rules2Open={this.rules2Open}
          rules3Open={this.rules3Open}
          helpOpen={this.helpOpen}
          closeRulesDialog={this.closeRulesDialog}
          closeWinDialog={this.closeWinDialog}
          closeColorDialog={this.closeColorDialog}
          toggleHelpDialog={this.toggleHelpDialog} />
      </div>
    );
  }
}

export default Game;
