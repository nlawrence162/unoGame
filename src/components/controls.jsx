import React from "react";

class Controls extends React.Component {

  renderButtons() {
    return (
      <div style={{ display: 'inline-block', transform: "translateY(-3px)" }}>
        <button className="turnButton" onClick={this.props.turnAI}><span>Advance one turn</span></button>
        <button className="addAIButton" onClick={this.props.addAI}><span>Add Computer</span></button>
        <button className="addPlayerButton" onClick={this.props.addPlayer} style={{ marginRight: "10px" }}><span>Add player</span></button>
      </div>
    );
  }

  renderOptions() {
    return (
      <div id="optionsContainer" style={{ display: 'inline-block', transform: "translateX(-1px) translateY(-1px)", width: "470px" }}>
        <div id="optionsBorder" style={{ display: 'inline-block', border: "1px solid #f1f1f1", height: "47px" }}>
          <button id="cogButton" className={this.props.optionsOpen ? "cogspin" : "cog"} onClick={this.props.toggleOptionsMenu}><i className="glyphicon glyphicon-cog" /></button>
          <button className={this.props.autoPlayAI ? "opbutton" : "obutton"} onClick={() => this.props.toggleOption(1)}>Autoplay</button>
          <button className={this.props.hideComputers ? "opbutton" : "obutton"} onClick={() => this.props.toggleOption(3)}>Hide AI</button>
          <button className={this.props.stopOnPlayer ? "opbutton" : "obutton"} onClick={() => this.props.toggleOption(2)}>No Skip</button>
          <button className={"obutton help"} onClick={this.props.toggleHelpDialog}><div><div>?</div></div></button>
          <div id="whiteBox" className={this.props.optionsOpen ? "whitebox squish" : "whitebox"}></div>
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
        className="rulesHide"
        style={{ marginTop: "5px", width: "100px", borderRadius: "12px" }}
        onClick={() => { this.props.closeRulesDialog(1, true); document.getElementById("rulesButton").className = "rulesPressed" }} >
        <span style={{ float: "left" }}>rules</span>
      </button>
    </div>);
  }
}

export default Controls;