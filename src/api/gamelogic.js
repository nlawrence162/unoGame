//This class is not an object class, it only holds functions.

class Logic {
  static turnPlayer(card, state) {
    var player = state.repo.players[state.currentPlayer];

    //If the card is a valid play.
    if (state.repo.validatePlay(state.repo.playPile[state.repo.playPile.length - 1], card)) {
      state.snakeIteration++;//Increase fun turn value to make the snake move
      player.plays++;//Used for win message and info
      state.repo.playPile.push(
        player.hand.splice(player.hand.indexOf(card), 1)[0]
      );//Add the card to the play pile and remove it from the players hand.

      //Reverse
      if (card.type === "reverse") {
        if (state.repo.players.length <= 2) state.skip = true;//Skip if there is only two players.
        else state.reversed = !state.reversed; //Flip the variable
      }
      //Skip
      if (card.type === "skip") {
        state.skip = true;//Next player will be skipped
      }
      //Draw
      if (card.type === "picker") {
        state.forceDraw = 2;//Next player will draw two before there turn starts.
      }
      if (card.type === "wild_picker") {
        state.forceDraw = 4;//Next player will draw four before there turn starts.
      }
      //manual color selection
      if (card.type === "wild" || card.type === "wild_picker") {
        state.colorOpen = true;//Opens the color selection menu for wild cards.
      }

      //set current color to color of top playPile card
      state.currentColor = state.repo.playPile[state.repo.playPile.length - 1].color;//Used for the draw pile backround color

      if (player.hand.length === 0) {
        state.winningMessage = player.name + " has won in " + player.plays + " turns!";//Set the winning message.
        state.winnerOpen = true;//Set the message to open

        //Remove player
        var playerIndex = state.repo.players.indexOf(player);
        const len = player.hand.length;
        for (let i = 0; i < len; i++)
          state.repo.deck.push(player.hand.pop());
        state.repo.players.splice(playerIndex, 1);
        state.repo.shuffle();

        //adjust current player
        if (state.repo.players.length !== 0) {
          if (state.currentPlayer === playerIndex)
            state.currentPlayer += state.reversed ? -1 : 0;
          else
            state.currentPlayer = state.repo.players.indexOf(player);
          if (state.currentPlayer < 0) state.currentPlayer = state.repo.players.length - 1; //Bottom boundry
          if (state.currentPlayer > state.repo.players.length - 1) state.currentPlayer = 0; //Top boundry
        }

        //Reset skip value when there are no players
        if (state.repo.players.length === 0)
          state.skip = false;
      } else {
        //Next player
        if (state.skip) {
          state.currentPlayer += state.reversed ? -1 : 1;//If reversed, remove one, if else, add one.
          if (state.currentPlayer < 0)//Checks if it broke boundries.
            state.currentPlayer = Math.max(0, state.repo.players.length - 1);//Under zero
          if (state.currentPlayer > state.repo.players.length - 1)
            state.currentPlayer = 0;//Over max, go back to start.
          state.skip = false;
        }
        state.currentPlayer += state.reversed ? -1 : 1;//If reversed, remove one, if else, add one.
        if (state.currentPlayer < 0)//Checks if it broke boundries.
          state.currentPlayer = Math.max(0, state.repo.players.length - 1);//Under zero
        if (state.currentPlayer > state.repo.players.length - 1)
          state.currentPlayer = 0;//Over max, go back to start.
        state.skip = false;
      }

      //force draw
      while (state.forceDraw > 0) {
        state.forceDraw--;
        if (state.repo.players.length > 0) state.repo.players[state.currentPlayer].draw(state.repo.deck);
        if (state.repo.deck.length === 0) state.repo.updateDeck();
      }
    }
    else if (card === "card_back_alt") {
      //Else draw a card
      state.repo.players[state.repo.players.indexOf(player)].draw(state.repo.deck);
      if (state.repo.deck.length === 0) state.repo.updateDeck();
    }

    //Make sure the AI dosn't auto play if there is no player to stop at.
    if (!state.repo.playerExists()) {
      state.autoPlayAI = false;
    }

    //Autoplay
    if (state.colorOpen === false && state.autoPlayAI === true && state.repo.players[state.currentPlayer].computer === true) {
      state = this.turnAI(state);
      console.log("Auto played");
    }

    return state;
  }

  static turnAI(state) {
    if (state.repo.players.length === 0) return;
    var player = state.repo.players[state.currentPlayer];
    if (player.computer === false && state.stopOnPlayer === true) return;

    //the turn
    state.snakeIteration++;
    player.plays++;
    var playedCard = state.repo.doAPlayAI(state.repo.players.indexOf(player));

    if (playedCard !== null) {
      //Reverse
      if (playedCard.type === "reverse") {
        if (state.repo.players.length <= 2) state.skip = true;
        else state.reversed = !state.reversed;
      }
      //Skip
      if (playedCard.type === "skip") {
        state.skip = true;
      }
      //Draw
      if (playedCard.type === "picker") {
        state.forceDraw = 2;
      }
      if (playedCard.type === "wild_picker") {
        state.forceDraw = 4;
      }
    }
    //set current color to color of top playPile card
    state.currentColor = state.repo.playPile[state.repo.playPile.length - 1].color;

    if (player.hand.length === 0) {
      state.winningMessage = player.name + " has won in " + player.plays + " turns!";//Set the winning message.
      state.winnerOpen = true;//Set the message to open

      //Remove player
      var playerIndex = state.repo.players.indexOf(player);
      const len = player.hand.length;
      for (let i = 0; i < len; i++)
        state.repo.deck.push(player.hand.pop());
      state.repo.players.splice(playerIndex, 1);
      state.repo.shuffle();

      //adjust current player
      if (state.repo.players.length !== 0) {
        if (state.currentPlayer === playerIndex)
          state.currentPlayer += state.reversed ? -1 : 0;
        else
          state.currentPlayer = state.repo.players.indexOf(player);
        if (state.currentPlayer < 0) state.currentPlayer = state.repo.players.length - 1; //Bottom boundry
        if (state.currentPlayer > state.repo.players.length - 1) state.currentPlayer = 0; //Top boundry
      }

      //Reset skip value when there are no players
      if (state.repo.players.length === 0)
        state.skip = false;
    } else {
      //All actions are done. Move to next player.
      if (state.skip) {
        state.currentPlayer += state.reversed ? -1 : 1;//If reversed, remove one, if else, add one.
        if (state.currentPlayer < 0)//Checks if it broke boundries.
          state.currentPlayer = Math.max(0, state.repo.players.length - 1);//Under zero
        if (state.currentPlayer > state.repo.players.length - 1)
          state.currentPlayer = 0;//Over max, go back to start.
        state.skip = false;
      }
      state.currentPlayer += state.reversed ? -1 : 1;//If reversed, remove one, if else, add one.
      if (state.currentPlayer < 0)//Checks if it broke boundries.
        state.currentPlayer = Math.max(0, state.repo.players.length - 1);//Under zero
      if (state.currentPlayer > state.repo.players.length - 1)
        state.currentPlayer = 0;//Over max, go back to start.
      state.skip = false;
    }

    //Force draw next player
    while (state.forceDraw > 0) {
      state.forceDraw--;
      if (state.repo.players.length > 0) state.repo.players[state.currentPlayer].draw(state.repo.deck);
      if (state.repo.deck.length === 0) state.repo.updateDeck();
    }

    if (!state.repo.playerExists()) {
      state.autoPlayAI = false;
    }

    if (state.autoPlayAI === true && state.repo.players[state.currentPlayer].computer === true) {
      state = this.turnAI(state);
      console.log("Auto played");
    }

    return state;
  }

}

export default Logic;