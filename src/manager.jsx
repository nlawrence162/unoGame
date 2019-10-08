import React from "react";
import Repo from "./api/repo.js";
import Controls from "./components/controls.jsx";
import PlayArea from "./components/playarea.jsx";
import Dialogs from "./components/dialogs.jsx";

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

      //set current color to color of top playPile card
      this.currentColor = this.repo.playPile[this.repo.playPile.length - 1].color;//Used for the draw pile backround color

      if (!this.removeWinningPlayer(player)) {
        //Next player
        if (this.skip) {
          this.currentPlayer = this.nextPlayer()
          this.skip = false;
        }
        this.currentPlayer = this.nextPlayer()
      }

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

    if (!this.removeWinningPlayer(player)) {
      //All actions are done. Move to next player.
      if (this.skip) {
        this.currentPlayer = this.nextPlayer()
        this.skip = false;
      }
      this.currentPlayer = this.nextPlayer()
    }

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
      this.removePlayer(this.repo.players.indexOf(player));//Remove the player
      return true;
    }
    return false;
  }
  forceDrawPlayer() {
    while (this.forceDraw > 0) {
      this.forceDraw--;
      if (this.repo.players.length > 0) this.repo.players[this.currentPlayer].draw(this.repo.deck);
      if (this.repo.deck.length === 0) this.repo.updateDeck();
    }
  }

  //Play actions
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
  removePlayer = (index) => {
    var currentPlayer = this.repo.players[this.currentPlayer];
    const len = this.repo.players[index].hand.length;
    for (let i = 0; i < len; i++)
      this.repo.deck.push(this.repo.players[index].hand.pop());
    this.repo.players.splice(index, 1);
    this.repo.shuffle();

    //adjust current player
    if (this.repo.players.length !== 0) {
      if (this.currentPlayer === index)
        this.currentPlayer += this.reversed ? -1 : 0;
      else
        this.currentPlayer = this.repo.players.indexOf(currentPlayer);
      if (this.currentPlayer < 0) this.currentPlayer = this.repo.players.length - 1; //Bottom boundry
      if (this.currentPlayer > this.repo.players.length - 1) this.currentPlayer = 0; //Top boundry
    }

    this.forceUpdate();
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

  //Option actions
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
  toggleOption = (option) => {
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

        <Controls
          turnAI={this.turnAI}
          addAI={this.addAI}
          addPlayer={this.addPlayer}
          toggleOptionsMenu={this.toggleOptionsMenu}
          toggleOption={this.toggleOption}
          autoPlayAI={this.autoPlayAI}
          hideComputers={this.hideComputers}
          stopOnPlayer={this.stopOnPlayer}
          toggleHelpDialog={this.toggleHelpDialog}
          closeRulesDialog={this.closeRulesDialog} />

        <PlayArea
          repo={this.repo}
          hideComputers={this.hideComputers}
          currentPlayer={this.currentPlayer}
          currentColor={this.currentColor}
          turnCount={this.turnCount}
          turnPlayer={this.turnPlayer}
          removePlayer={this.removePlayer} />

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
