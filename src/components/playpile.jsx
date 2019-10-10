import React from "react";
import Card from "./card.jsx";

class PlayPile extends React.Component {
  //this.props.playPile

  render() {
    var cards = [];
    for (let i = this.props.playPile.length - 1; i >= 0; i--) {
      if (this.props.playPile[i] !== undefined || this.props.playPile[i] !== null) {
        cards.push(React.createElement(Card, {
          card: this.props.playPile[i],
          key: i,
          noAni: true,
          style: {
            height: "100px",
            position: "absolute",
            left: Math.max(0, this.props.playPile.length - i) * 10 + "px",
            top: Math.sin((Math.max(0, this.props.playPile.length - i) + this.props.snakeIteration) / 10) * Math.min(Math.max(0, this.props.playPile.length - i), 50) + 45,
            zIndex: 109 - Math.max(0, this.props.playPile.length - i),
            opacity: 1 / ((this.props.playPile.length - i) / (3 / ((this.props.playPile.length - i) / 15)))
          }
        }));
      }
    }
    return <div style={{ height: "200px", position: "relative" }}>{cards}</div>;
  }
}

export default PlayPile;
