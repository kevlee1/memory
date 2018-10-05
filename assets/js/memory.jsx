import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function memory_init(root, channel) {
  ReactDOM.render(<Memory channel={channel}/>, root);
}

class Channel extends React.Component {
  constructor(props) {
    super(props);
    // initiaze state 
    this.state = {
      board: [],
      actual: ([]),
      isEnabled: [],
      score: 0,
      noClick: 0,
      index1: -1,
      index2: -1,
      char1: "",
      char2: "",
      clickable: true,
      name: ""
    };
    this.name = props.name
    this.channel = props.channel
    this.channel.join()
      .receive("ok", this.sendToState.bind(this))
      .receive("error", resp => {console.log("Unable to join", resp) });
  }

  sendToState(gameState) {
    if (!gameState.game.clickable) {
      setTimeout(() => {
        var tempBoard = gameState.game.board
        tempBoard[gameState.game.index1] = "?"
        tempBoard[gameState.game.index2] = "?"
        var tempIsEnabled = gameState.game.isEnabled
        tempIsEnabled[gamestate.game.index1] = true
        tempIsEnabled[gamestate.game.index2] = true
        this.channel.push("update", {
          board: tempBoard,
          actual: gameState.game.actual,
          isEnabled: tempIsEnabled,
          score: gameState.game.score,
          noClick: gameState.game.noClick,
          index1: gameState.game.index1,
          index2: gameState.game.index2,
          char1: gameState.game.char1,
          char2: gameState.game.char2,
          clickable: true,
          name: gameState.game.name
        })
        .receive("ok", resp => { console.log("Updated", resp) })
        this.setState({
          board: tempBoard,
          isEnabled: tempIsEnabled,
          clickable: true
        })
      }, 2000);
    }
    this.setState(gameState.game)
  }

  handleClick(index) {
    if (this.state.clickable) {
      this.channel.push("click", {index: index}).receive("ok", this.sendToState.bind(this))
    }
  }

  getScore(gameState) {
    return gameState.score;
  }

  newGame() {
    this.channel.push("new", {name: this.state.name}).receive("ok", this.sendToState.bind(this))
  }

  render() {
    return <div>
      <div className="row">
        <div className="column">
          <div id="gameName">
            <p>Game: {this.state.name}</p>
          </div>
          <div id="score">
            <p>Score: {this.getScore(this.state)}</p>
          </div>
        </div>
        <div className="column">
          <div className="board">
            {this.state.board.map((cell, index) => {return <div className="cell" onClick={() => this.handleClick(index)} >{cell}</div>})}
          </div>
        </div>
        <div className="column">
          <div className="row">
            <button onClick={() => this.newGame()}>Restart Game</button>
          </div>
        </div>
      </div>
    </div>;
  }
}
