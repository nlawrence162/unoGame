import React from "react";
import Card from "./card.jsx";

class Dragged extends React.Component {
    //yet to be implemented

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <Card card={this.props.card} />
        </div>);
    }
}