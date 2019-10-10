import React from "react";
import PlayPile from "./playpile.jsx";
import Hand from "./hand.jsx";

class PlayArea extends React.Component {

  //Hand renderer
  renderHands() {
    if (this.props.repo.players.length === 0) {
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
    for (let i = 0; i < this.props.repo.players.length; i++) {
      if (!this.props.repo.players[i].computer && i === this.props.currentPlayer) {
        hands.push(this.renderPlayerHand(i));
      } else {
        hands.push(this.renderStaticHand(i));
      }
    }

    return <>{hands}</>;
  }

  renderPlayerHand(i) {
    let hand = [];
    hand.push(
      <div key={i}>
        <div>
          <button className="delete" onClick={() => this.props.removePlayer(i)}><span></span><i className="glyphicon glyphicon-remove" /></button>
          <h3 style={{ display: "inline-block" }} > {this.props.repo.players[i].name + "'s hand:"}</h3>
        </div>
        <Hand player={this.props.repo.players[i]}
          handleCardClick={this.props.handleCardClick}
          handleCardDown={this.props.handleCardDown}
          handleCardUp={this.props.handleCardUp}
          canPlay={this.props.repo.players[i].playPossible(this.props.repo.playPile[this.props.repo.playPile.length - 1])} />
      </div>);
    return React.createElement("div", { key: i, id: i, style: (i === this.props.currentPlayer) ? { border: "3px blue", borderTopStyle: "double", borderBottomStyle: "double", borderRadius: "10px", padding: "3px" } : { padding: "5px" } }, hand);
  }

  renderStaticHand(i) {
    let hand = [];
    if (!this.props.repo.players[i].computer || !this.props.hideComputers) {
      hand.push(
        <div key={i}>
          <div>
            <button className="delete" onClick={() => this.props.removePlayer(i)} ><span></span> <i className="glyphicon glyphicon-remove" /></button>
            <h3 style={{ display: "inline-block" }}>{this.props.repo.players[i].name + "'s hand:"}</h3>
          </div>
          <Hand player={this.props.repo.players[i]} />
        </div>);
    }
    else {
      hand.push(<div key={i + this.props.repo.players.length}>
        <button className="delete" onClick={() => this.props.removePlayer(i)} ><span></span> <i className="glyphicon glyphicon-remove" /></button>
        <h3 style={{ display: "inline-block" }}>{this.props.repo.players[i].name + " (" + this.props.repo.players[i].hand.length + (this.props.repo.players[i].hand.length === 1 ? " Card Hidden)" : " Cards Hidden)")}</h3>
      </div>);
    }
    return React.createElement("div", { key: i, id: i, style: (i === this.props.currentPlayer) ? { border: "3px coral", borderTopStyle: "double", borderBottomStyle: "double", borderRadius: "10px", padding: "3px" } : { padding: "6px 3px" } }, hand);
  }

  render() {
    return (<div>
      <h3 style={{
        paddingBottom: "3px",
        borderLeft: "4px solid " + this.props.currentColor,
        backgroundColor: "light" + (this.props.currentColor === "red" ? "coral" : this.props.currentColor)
      }}> &nbsp;Play Pile: </h3>
      <PlayPile playPile={this.props.repo.playPile} snakeIteration={this.props.snakeIteration} />

      {this.renderHands()}
    </div>);
  }
}

export default PlayArea;