import React from "react";

class Controls extends React.Component {

  renderButtons() {
    return (
      <div style={{ display: 'inline-block', transform: "translateY(-3px)" }}>
        <button className="w3-button turnButton" onClick={this.props.turnAI}><span>Advance one turn</span></button>
        <button className="w3-button addAIButton" onClick={this.props.addAI}><span>Add Computer</span></button>
        <button className="w3-button addPlayerButton" onClick={this.props.addPlayer} style={{ marginRight: "10px" }}><span>Add player</span></button>
      </div>
    );
  }

  renderOptions() {
    return (
      <div id="optionsContainer" style={{ display: 'inline-block', transform: "translateX(-1px) translateY(-1px)", width: "450px" }}>
        <div id="optionsBorder" style={{ display: 'inline-block', border: "1px solid #f1f1f1" }}>
          <button id="cogButton" className={this.props.optionsOpen ? "w3-button cogspin" : "w3-button cog"} onClick={this.props.toggleOptionsMenu}><i className="glyphicon glyphicon-cog w3-large" /></button>
          <div id="whiteBox" className={this.props.optionsOpen ? "whitebox squish" : "whitebox"}></div>
          <button className={this.props.autoPlayAI ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.props.toggleOption(1)}>Autoplay</button>
          <button className={this.props.hideComputers ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.props.toggleOption(3)}>Hide AI</button>
          <button className={this.props.stopOnPlayer ? "w3-button opbutton" : "w3-button obutton"} onClick={() => this.props.toggleOption(2)}>No Skip</button>
          <button className={"w3-button obutton ob2 wiggle"} onClick={this.props.toggleHelpDialog}><div><div>?</div></div></button>
        </div>
      </div>
    );
  }

  render() {
    return (<div>
      {this.renderButtons()}
      {this.renderOptions()}

      <button
        id="rulesButton"
        className="w3-button rulesHide"
        style={{ marginTop: "5px", width: "100px", borderRadius: "12px" }}
        onClick={() => { this.props.closeRulesDialog(1, true); document.getElementById("rulesButton").className = "w3-button rulesPressed" }} >
        <span style={{ float: "left" }}>rules</span>
      </button>
    </div>);
  }
}

export default Controls;