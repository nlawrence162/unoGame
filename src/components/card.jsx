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
        onClick={this.props.handleCardClick !== undefined ? () => { this.props.handleCardClick(this.props.card); } : undefined}

        src={this.getImg(this.props.card)}//Sets image using card object
        alt="card"//Required
        draggable="false"//Made so that the player dosn't drag instead of click a card.

        style={this.props.style === undefined ? { margin: "2px", height: "100px" } : this.props.style}//Sets style to regular, or playpile style.
        className={this.props.noAni !== true ? this.props.handleCardClick !== undefined ? "animateLeft card " + this.props.card.color : "animateLeft" : ""}
      />
    );
  }
}

export default Card;
