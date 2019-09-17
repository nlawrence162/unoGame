import React from "react";
import Repo from "./api/repo.js";
import PlayPile from "./components/playpile.jsx";
import Hand from "./components/hand.jsx";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import "./styles/buttons.css";
import "./styles/options.css";
import "./styles/rules.css";
import "./styles/card.css";
import "./styles/misc.css";

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

  //used for fun
  cturn = 0;

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

    this.state = { repo: this.repo };
    this.currentColor = this.repo.playPile[this.repo.playPile.length - 1].color;

    //On space press
    document.body.onkeydown = (e) => {
      if (e.keyCode === 39) {
        this.turnAI();
      }
    }
  }

  //Used to apply border properties to initial player. Must be done after the first render.
  componentDidMount() {
    this.borderCurrentPlayer();
  }

  //Called when a card is clicked on, with the card that was clicked passed in.
  turnPlayer = card => {
    var player = this.repo.players[this.currentPlayer];

    //If the card is a valid play.
    if (this.repo.validatePlay(this.repo.playPile[this.repo.playPile.length - 1], card)) {
      this.cturn++;//Increase fun turn value to make the snake move
      player.plays++;//Used for win message and info
      this.repo.playPile.push(
        player.hand.splice(player.hand.indexOf(card), 1)[0]
      );//Add the card to the play pile and remove it from the players hand.

      this.removeWinningPlayer(player);

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

      //Next player
      if (this.skip) {
        this.currentPlayer = this.nextPlayer()
        this.skip = false;
      }
      this.currentPlayer = this.nextPlayer()

      this.removeAllBorders();
      this.borderCurrentPlayer();

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
    this.cturn++;
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

    //Remove any borders
    this.removeAllBorders();

    //All actions are done. Move to next player.
    if (this.skip) {
      this.currentPlayer = this.nextPlayer()
      this.skip = false;
    }
    this.currentPlayer = this.nextPlayer()

    this.borderCurrentPlayer();

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
    if (this.repo.players[this.repo.players.indexOf(player)].hand.length === 0) {
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
  removeAllBorders() {
    //Remove any borders
    for (let i = 0; i < this.repo.players.length; i++) {
      document.getElementById(i).style.border = "";
      document.getElementById(i).style.borderRadius = "";
      document.getElementById(i).style.padding = "5px";
    }//Id correspond to player div's
  }
  borderCurrentPlayer() {
    if (this.repo.players.length > 0) {
      document.getElementById(this.currentPlayer).style.border = "2px solid coral";
      if (!this.repo.players[this.currentPlayer].computer)
        document.getElementById(this.currentPlayer).style.border = "2px solid blue";
      document.getElementById(this.currentPlayer).style.borderRadius = "5px";
      document.getElementById(this.currentPlayer).style.padding = "3px";
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
        <button className="w3-button abutton" onClick={this.turnAI}><span>Advance one turn</span></button>
        <button className="w3-button pbutton" onClick={this.addAI}><span>Add AI</span></button>
        <button className="w3-button pbutton" onClick={this.addPlayer} style={{ marginRight: "10px" }}><span>Add player</span></button>
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

  //Dialogs
  renderRulesDialog() {
    return (
      <div>
        <Dialog
          open={this.rules1Open}
          onClose={() => this.closeRulesDialog(1, false)}
          aria-labelledby="rules1"
        >
          <DialogTitle id="rules1">Welcome to my uno.</DialogTitle>
          <DialogActions>
            <Button onClick={() => this.closeRulesDialog(1, true)} color="primary">Rules?</Button>
            <Button onClick={() => this.closeRulesDialog(1, false)} color="primary">Eh, whatever.</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.rules2Open}
          onClose={() => this.closeRulesDialog(2, false)}
          aria-labelledby="rules2"
          aria-describedby="rulz2"
        >
          <DialogTitle id="rules2">Okay, here it is:</DialogTitle>
          <DialogContent>
            <DialogContentText id="rulz2">
              Wikipedia dosn't know what they're talking about.
              This is how this is gonna go:<br /><br />
              - If you can't play a card, too bad. You will keep drawing untill you can.
              Even if that literally means all 108 cards.<br /><br />
              - Winning dosn't end the game. It goes on untill you stop playing.<br /><br />
              - You can add players and computers at will. Even during the game.<br /><br />
              - When a player reaches zero cards, they get thanos snapped.
              A message will appear declaring their victory.<br /><br />
              - The play pile makes a cool snake. Deal with it.<br /><br />
              - Other than that. Normal uno rules.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.closeRulesDialog(2, true)} color="primary">wait, but like, what do I do?</Button>
            <Button onClick={() => this.closeRulesDialog(2, false)} color="primary" autoFocus>Nice.</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.rules3Open}
          onClose={() => this.closeRulesDialog(3)}
          aria-labelledby="rules3"
          aria-describedby="rulz3"
        >
          <DialogTitle id="rules3">Wow you ask too many questions:</DialogTitle>
          <DialogContent>
            <DialogContentText id="rulz3">
              - By default, there is one player. You choose whitch cards they play.
              You add enemies and other players at will. But you can't remove them.<br /><br />
              - Each player is shown on the screen, this can be disabled
              A computer player is represented by a red border on their turn.
              A player is represented by a blue border on their turn.<br /><br />
              - You can choose how the turns work, but the rules stay the same.
              The game won't let you make an illegal play.
              (You will probably still try anyway.)
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.closeRulesDialog(3)} color="primary">k let me play plz</Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
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

  renderWinDialog() {
    return (
      <div>
        <Dialog
          open={this.winnerOpen}
          onClose={this.closeWinDialog}
          aria-labelledby="winner_msg"
        >
          <DialogTitle id="winner_msg">{this.winningMessage}</DialogTitle>
          <DialogActions>
            <Button onClick={this.closeWinDialog} color="primary" style={{ height: '70px', width: '75px' }}>
              k.
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  closeWinDialog = () => {
    this.winnerOpen = false;
    this.forceUpdate();
  }

  renderColorDialog() {
    return (
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.colorOpen}
          onClose={this.closeColorDialog}
          aria-labelledby="color_picker"
        >
          <DialogTitle id="color_pickercolor_picker">{"Pick a color: "}</DialogTitle>
          <DialogActions>
            <Button onClick={() => this.closeColorDialog("red")} color="primary">Red</Button>
            <Button onClick={() => this.closeColorDialog("yellow")} color="primary">Yellow</Button>
            <Button onClick={() => this.closeColorDialog("green")} color="primary">Green</Button>
            <Button onClick={() => this.closeColorDialog("blue")} color="primary">Blue</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  closeColorDialog = color => {
    this.colorOpen = false;
    this.currentColor = color;
    this.repo.playPile[this.repo.playPile.length - 1].color = this.currentColor;
    this.forceUpdate();
    if (this.autoPlayAI === true && this.repo.players[this.currentPlayer].computer === true) {
      this.turnAI();
    }
  }

  renderHelpDialog() {
    return (
      <Dialog
        open={this.helpOpen}
        onClose={this.toggleHelpDialog}
        aria-labelledby="help"
        aria-describedby="halp"
      >
        <DialogTitle id="help">What these options tho?</DialogTitle>
        <DialogContent>
          <DialogContentText id="halp">
            Autoplay: When the "advance one turn" button is clicked, it will
            skip every AI turn(red border) and stop at the next player(blue border).
            Reverse, Skip, and Draw cards are still calculated during these turns.<br /><br />
            Hide AI: By default, the oposition's cards are readily available to see.
            Unless you're a dirty cheater, you may feel inclined to hide their cards.
            This button dose that.<br /><br />
            No Skip: This button allows you to spam the "advance one turn" button
            without skipping a player turn by accident. Nothing will occur when the
            button is pressed on a player when this option is on.<br /><br />
            Oh and also you can advance one turn by pressing the right arrow key.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.toggleHelpDialog} color="primary">thx bro</Button>
        </DialogActions>
      </Dialog>
    );
  }
  toggleHelpDialog = () => {
    this.helpOpen = !this.helpOpen;
    this.forceUpdate();
  }

  //Options
  renderOptions() {
    return (
      <div style={{ display: 'inline-block', transform: "translateX(-1px) translateY(-1px)", width: "450px" }}>
        <button id="cogButton" className="w3-button cog" onClick={this.toggleOptionsMenu}><i className="glyphicon glyphicon-cog w3-large"></i></button>
        <div id="whiteBox" className="whitebox"></div>
        <button className={this.autoPlayAI ? "w3-button opbutton ob1" : "w3-button obutton ob1"} onClick={() => this.toggleOption(1)}>Autoplay</button>
        <button className={this.hideComputers ? "w3-button opbutton ob1" : "w3-button obutton ob1"} onClick={() => this.toggleOption(3)}>Hide AI</button>
        <button className={this.stopOnPlayer ? "w3-button opbutton ob1" : "w3-button obutton ob1"} onClick={() => this.toggleOption(2)}>No Skip</button>
        <button className={"w3-button obutton ob2 wiggle"} onClick={this.toggleHelpDialog}><div><div><div>?</div></div></div></button>
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
    var hands = [];
    for (let i = 0; i < this.repo.players.length; i++) {
      if (!this.repo.players[i].computer && i === this.currentPlayer) {
        hands.push(this.renderPlayerHand(i));
      } else {
        hands.push(this.renderAIHand(i));
      }
    }

    return <>{hands}</>;
  }
  renderPlayerHand(i) {
    let temp = [];
    temp.push(React.createElement("h3", { key: i + this.repo.players.length }, this.repo.players[i].name + "'s hand:"));
    temp.push(React.createElement(Hand, {
      player: this.repo.players[i],
      cardSetter: this.turnPlayer,
      canPlay: this.repo.players[i].playPossible(this.repo.playPile[this.repo.playPile.length - 1]),
      key: i
    }));
    return React.createElement("div", { key: i, id: i, style: { padding: "5px" } }, temp);
  }
  renderAIHand(i) {
    let temp = [];
    if (!this.repo.players[i].computer || !this.hideComputers) {
      temp.push(React.createElement("h3", { key: i + this.repo.players.length }, this.repo.players[i].name + "'s hand:"));
      temp.push(React.createElement(Hand, {
        player: this.repo.players[i],
        key: i
      }));
    }
    else {
      var msg = this.repo.players[i].name + " (" + this.repo.players[i].hand.length + (this.repo.players[i].hand.length === 1 ? " Card Hidden)" : " Cards Hidden)");
      temp.push(React.createElement("h3", { key: i + this.repo.players.length }, msg));
    }
    return React.createElement("div", { key: i, id: i, style: { padding: "5px" } }, temp);
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>

        <div id="curtain"></div>

        {this.renderButtons()}
        {this.renderOptions()}

        <button
          id="rulesButton"
          className="w3-button rulesr"
          style={{ marginTop: "5px", width: "100px", borderRadius: "12px" }}
          onClick={() => { this.closeRulesDialog(1, true); document.getElementById("rulesButton").className = "w3-button rulesp" }}>
          <span style={{ float: "left" }}>rules</span>
        </button>

        <h3 style={{
          paddingBottom: "3px",
          borderLeft: "4px solid " + this.currentColor,
          backgroundColor: "light" + (this.currentColor === "red" ? "coral" : this.currentColor)
        }}> &nbsp;Play Pile: </h3>
        <PlayPile playPile={this.state.repo.playPile} cturn={this.cturn} />

        {this.renderHands()}
        {this.renderRulesDialog()}
        {this.renderWinDialog()}
        {this.renderColorDialog()}
        {this.renderHelpDialog()}
      </div>
    );
  }
}

export default Game;
