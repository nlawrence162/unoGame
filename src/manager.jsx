import React from "react";
import Repo from "./api/repo.js";
import Logic from "./api/gamelogic.js";
import Controls from "./components/controls.jsx";
import PlayArea from "./components/playarea.jsx";
import Dialogs from "./components/dialogs.jsx";

//This manages the game. Calls on the repo to change values, and controlls logic.
class Game extends React.Component {

  constructor(props) {
    super(props);
    var repo = new Repo();

    this.state = {
      repo: repo,

      //manager data
      currentPlayer: 0,
      reversed: false,
      skip: false,
      forceDraw: 0,
      currentColor: repo.playPile[repo.playPile.length - 1].color,

      //options data
      optionsOpen: false,
      autoPlayAI: false,
      stopOnPlayer: false,
      hideComputers: false,

      //snakedata
      snakeIteration: 0,

      //dialog data
      colorOpen: false,
      winnerOpen: false,
      winningMessage: "",
      rules1Open: true,
      rules2Open: false,
      rules3Open: false,
      helpOpen: false
    };

    //On right arrow key press
    window.onkeydown = (e) => {
      if (e.keyCode === 39 && !this.colorOpen && !this.winnerOpen) {
        this.turnAI();
      }
    }
  }

  turnPlayer = card => {
    var newState = Logic.turnPlayer(card, this.state);
    this.setState(newState);
  }
  turnAI = () => {
    var newState = Logic.turnAI(this.state);
    this.setState(newState);
  }

  //Play actions
  addAI = () => {
    var repo = this.state.repo;
    if (repo.deck.length <= 7) repo.updateDeck();
    if (repo.deck.length > 7) {
      repo.addPlayer();
    }
    this.setState({ repo: repo });
  }
  addPlayer = () => {
    var repo = this.state.repo;
    if (repo.deck.length <= 7) repo.updateDeck();
    if (repo.deck.length > 7) {
      repo.addPlayer();
      repo.players[repo.players.length - 1].computer = false;
    }
    this.setState({ repo: repo });
  }
  removePlayer = index => {
    var repo = this.state.repo;
    var currentPlayer = this.state.currentPlayer;
    var currentPlayerObj = repo.players[currentPlayer];
    const len = repo.players[index].hand.length;
    for (let i = 0; i < len; i++)
      repo.deck.push(repo.players[index].hand.pop());
    repo.players.splice(index, 1);
    repo.shuffle();

    //adjust current player
    if (repo.players.length !== 0) {
      if (currentPlayer === index)
        currentPlayer += this.state.reversed ? -1 : 0;
      else
        currentPlayer = repo.players.indexOf(currentPlayerObj);
      if (currentPlayer < 0) currentPlayer = repo.players.length - 1; //Bottom boundry
      if (currentPlayer > repo.players.length - 1) currentPlayer = 0; //Top boundry
    }

    this.setState({ repo: repo, currentPlayer: currentPlayer });
  }
  handleCardClick = card => {
    this.turnPlayer(card);
  }

  //Dialog actions
  closeRulesDialog = (value, next) => {
    var rules1Open = this.state.rules1Open;
    var rules2Open = this.state.rules2Open;
    var rules3Open = this.state.rules3Open;
    switch (value) {
      case 1:
        document.getElementById("curtain").className = "curtain"
        if (next) {
          rules2Open = true;
        }
        else {
          document.getElementById("rulesButton").className = "rules"
        }
        rules1Open = false;
        break;

      case 2:
        if (next) {
          rules3Open = true;
        }
        else {
          document.getElementById("rulesButton").className = "rules"
        }
        rules2Open = false;
        break;

      case 3:
        rules3Open = false;
        document.getElementById("rulesButton").className = "rules"
        break;

      default:
        break;
    }
    this.setState({ rules1Open: rules1Open, rules2Open: rules2Open, rules3Open: rules3Open });
  }
  closeWinDialog = () => {
    this.setState({ winnerOpen: false });
  }
  closeColorDialog = color => {
    var state = this.state;
    if (state.colorOpen) {
      state.colorOpen = false;
      state.currentColor = color;
      state.repo.playPile[state.repo.playPile.length - 1].color = state.currentColor;

      if (state.autoPlayAI === true && state.repo.players[state.currentPlayer].computer === true) {
        var newState = Logic.turnAI(state);
        this.setState(newState);
      } else {
        this.setState({ colorOpen: state.colorOpen, currentColor: state.currentColor, repo: state.repo });
      }
    }
  }
  toggleHelpDialog = () => {
    if (this.state.optionsOpen) {
      this.setState({ helpOpen: !this.state.helpOpen });
    }
  }

  //Option actions
  toggleOptionsMenu = () => {
    this.setState({ optionsOpen: !this.state.optionsOpen });
  }
  toggleOption = (option) => {
    switch (option) {
      case 1:
        this.setState({ autoPlayAI: !this.state.autoPlayAI });
        break;
      case 2:
        this.setState({ stopOnPlayer: !this.state.stopOnPlayer });
        break;
      case 3:
        this.setState({ hideComputers: !this.state.hideComputers });
        break;
      case 4:
        this.setState({ dragCards: !this.state.dragCards });
        break;
      default:
        break;
    }

  }

  //Background
  renderBackground() {
    return (
      <div className="area" >
        <ul className={"circles c-" + this.state.currentColor + " " + (this.reversed ? "c-up" : "c-down")}>
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
      <div id="main">
        {this.renderBackground()}

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>

        <div id="curtain"></div>

        <Controls
          optionsOpen={this.state.optionsOpen}
          autoPlayAI={this.state.autoPlayAI}
          hideComputers={this.state.hideComputers}
          stopOnPlayer={this.state.stopOnPlayer}

          turnAI={this.turnAI}
          addAI={this.addAI}
          addPlayer={this.addPlayer}
          toggleOptionsMenu={this.toggleOptionsMenu}
          toggleOption={this.toggleOption}
          toggleHelpDialog={this.toggleHelpDialog}
          closeRulesDialog={this.closeRulesDialog} />

        <PlayArea
          repo={this.state.repo}
          hideComputers={this.state.hideComputers}
          currentPlayer={this.state.currentPlayer}
          currentColor={this.state.currentColor}
          snakeIteration={this.state.snakeIteration}

          removePlayer={this.removePlayer}
          handleCardClick={this.handleCardClick} />

        <Dialogs
          colorOpen={this.state.colorOpen}
          winnerOpen={this.state.winnerOpen}
          winningMessage={this.state.winningMessage}
          rules1Open={this.state.rules1Open}
          rules2Open={this.state.rules2Open}
          rules3Open={this.state.rules3Open}
          helpOpen={this.state.helpOpen}

          closeRulesDialog={this.closeRulesDialog}
          closeWinDialog={this.closeWinDialog}
          closeColorDialog={this.closeColorDialog}
          toggleHelpDialog={this.toggleHelpDialog} />


      </div>
    );
  }
}

export default Game;
