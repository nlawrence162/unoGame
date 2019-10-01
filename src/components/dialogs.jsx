import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

class Dialogs extends React.Component {

    renderRulesDialog() {
        return (
            <div>
                <Dialog
                    open={this.props.rules1Open}
                    onClose={() => this.props.closeRulesDialog(1, false)}
                    aria-labelledby="rules1"
                >
                    <DialogTitle id="rules1">Welcome to my uno.</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.props.closeRulesDialog(1, true)} color="primary">Rules?</Button>
                        <Button onClick={() => this.props.closeRulesDialog(1, false)} color="primary">Eh, whatever.</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.props.rules2Open}
                    onClose={() => this.props.closeRulesDialog(2, false)}
                    aria-labelledby="rules2"
                    aria-describedby="rulz2"
                >
                    <DialogTitle id="rules2">Okay, here it is:</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="rulz2">
                            <span style={{ fontStyle: "italic" }}>Wikipedia dosn't know what they're talking about:</span><br /><br />
                            - Drawing cards will not end your turn. You can still play after you are forced to draw cards.<br /><br />
                            - Winning doesn't end the game. You simply reuse the remaining cards by adding players and computers at any time.<br /><br />
                            - Shouting "UNO" won't do you any good in this game.
                            This is because robots tend to have faster reaction times than humans do.<br /><br />
                            - When a player reaches zero cards, they get thanos snapped.
                            A message will appear declaring their victory.<br /><br />
                            - Other than that. <a href="https://www.unorules.com/" style={{ color: "#647a9e" }}>Normal uno rules.</a>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.closeRulesDialog(2, true)} color="primary">wait, but like, what do I do?</Button>
                        <Button onClick={() => this.props.closeRulesDialog(2, false)} color="primary" autoFocus>Nice.</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.props.rules3Open}
                    onClose={() => this.props.closeRulesDialog(3)}
                    aria-labelledby="rules3"
                    aria-describedby="rulz3"
                >
                    <DialogTitle id="rules3">Instructions:</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="rulz3">
                            <span style={{ fontStyle: "italic" }}>The best way to learn the game is by clicking around and observing
                  the results, but if you would like some pointers, here they are:</span><br /><br />
                            - By default, there is one player. You choose which cards they play.
                  You add oponents and other players at will. But you cannot remove them.<br /><br />
                            - Every player is shown on the screen, this can be disabled.
                  A computer player is represented by a <span style={{ color: "coral" }}>red</span> border.
                  A player is represented by a <span style={{ color: "MediumTurquoise " }}>blue</span> border.
                  These borders will appear when it is their turn to play.<br /><br />
                            - You can choose how the turns work, but the rules stay the same.
                  The game won't let you make an illegal play.<br /><br />
                            <span style={{ fontWeight: "bold" }}>Note: For extra options, open the <i className="glyphicon glyphicon-cog" /> menu.</span>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.closeRulesDialog(3)} color="primary">Alright, let me play.</Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }

    renderWinDialog() {
        return (
            <div>
                <Dialog
                    open={this.props.winnerOpen}
                    onClose={this.props.closeWinDialog}
                    aria-labelledby="winner_msg"
                >
                    <DialogTitle id="winner_msg">{this.props.winningMessage}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.props.closeWinDialog} color="primary" style={{ height: '70px', width: '75px' }}>
                            k.
                </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    renderColorDialog() {
        return (
            <div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.props.colorOpen}
                    onClose={this.props.closeColorDialog}
                    aria-labelledby="color_picker"
                >
                    <DialogTitle id="color_pickercolor_picker">{"Pick a color: "}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.props.closeColorDialog("red")} style={{ backgroundColor: "lightcoral" }}>Red</Button>
                        <Button onClick={() => this.props.closeColorDialog("yellow")} style={{ backgroundColor: "lightyellow" }}>Yellow</Button>
                        <Button onClick={() => this.props.closeColorDialog("green")} style={{ backgroundColor: "lightgreen" }}>Green</Button>
                        <Button onClick={() => this.props.closeColorDialog("blue")} style={{ backgroundColor: "lightblue" }}>Blue</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    renderHelpDialog() {
        return (
            <Dialog
                open={this.props.helpOpen}
                onClose={this.props.toggleHelpDialog}
                aria-labelledby="help"
                aria-describedby="halp"
            >
                <DialogTitle id="help">Like, what even are these options?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="halp">
                        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>Autoplay</span>: When the "advance one turn" button is clicked, it will
                automatically play every <span style={{ color: "coral" }}>AI turn</span> and stop at the next <span style={{ color: "MediumTurquoise " }}>player</span>.
                Reverse, Skip, and Draw cards are still calculated during these turns.<br /><br />
                        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>Hide AI</span>: By default, the oposition's cards are readily available to see.
                Unless you're a dirty cheater, you may feel inclined to hide their cards.This button dose that.<br /><br />
                        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>No Skip</span>: This button allows you to spam the "<span style={{ fontStyle: "italic" }}>advance one turn</span>"
                button without skipping a player turn by accident. A turn will not be advanced on players when this button is on.<br /><br />
                        <span style={{ fontWeight: "bold" }}>Oh, and also you can advance one turn by pressing the right arrow key.</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.toggleHelpDialog} color="primary">Thanks, bro.</Button>
                </DialogActions>
            </Dialog>
        );
    }

    render() {
        //Only render one dialog at a time.
        if (this.props.rules1Open || this.props.rules2Open || this.props.rules3Open)
            return (this.renderRulesDialog());
        if (this.props.helpOpen)
            return (this.renderHelpDialog());
        if (this.props.colorOpen)
            return (this.renderColorDialog());
        if (this.props.winnerOpen)
            return (this.renderWinDialog());
        return null;
    }
}
export default Dialogs;