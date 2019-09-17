import React from "react";
import Card from "./card.jsx";

class Hand extends React.Component {
  //this.props.player

  render() {
    var cards = [];
    for (let i = 0; i < this.props.player.hand.length; i++) {
      if (this.props.player.hand[i] !== undefined || this.props.player.hand[i] !== null)
        cards.push(
          React.createElement(Card, {
            className: "card",
            card: this.props.player.hand[i],
            cardSetter: this.props.cardSetter,
            key: i
          })
        );
    }
    //Add an extra draw card graphic on the end of the hand if the player must draw a card
    if (this.props.canPlay === false && this.props.player.hand.length > 0) {
      cards.push(
        React.createElement(Card, {
          className: "card",
          card: "card_back_alt",
          cardSetter: this.props.cardSetter,
          key: -1
        })
      );
    }
    return <>{cards}</>;
  }
}

export default Hand;
