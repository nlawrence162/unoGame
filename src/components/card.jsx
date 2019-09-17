import React from "react";
import images from "./image.def.js";

class Card extends React.Component {
  //this.props.card

  getImg(card) {
    if (card === "card_back_alt") return images[card];

    var current_img;
    if (card.type === "")
      current_img = images[card.color + "_" + card.number];
    else if (card.type === "wild" || card.type === "wild_picker")
      current_img = images[card.type];
    else
      current_img = images[card.color + "_" + card.type];

    return current_img;
  }

  render() {
    return (
      <img
        onClick={this.props.cardSetter !== undefined ? () => { this.props.cardSetter(this.props.card); } : undefined}
        src={this.getImg(this.props.card)}
        alt="card"
        height="100px"
        style={this.props.style === undefined ? { margin: "2px" } : this.props.style}
        className={this.props.noAni !== true ? this.props.cardSetter !== undefined ? "w3-animate-left card " + this.props.card.color : "w3-animate-left" : ""}
      />
    );
  }
}

export default Card;
