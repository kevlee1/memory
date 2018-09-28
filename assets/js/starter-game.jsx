import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
     
    this.state = {
      // cells represented as a 2D array
      cells: [["A", "A", "B", "B"],
              ["C", "C", "D", "D"],
              ["E", "E", "F", "F"],
              ["G", "G", "H", "H"]],
      // eliminated are the cells that are cleared
      eliminated: [],
      choice1: null,
      choice2: null,
      // right now, score is calculated by #of clicks
      score: 0,
      // gamestate controls between game and win screen
      gameState: "game",
    };
  }

  // switches gamestate to game
  switchGame() {
    let state1 = _.assign({}, this.state, {gameState: "game"});
    this.setState(state1);
  }

  // switches gamestate to win screen
  switchWin() {
    let stateWin = _.assign({}, this.state, {gameState:"win"});
    this.setState(stateWin);
  }

  // reset the game - if this doesn't work
  // try button to reload page
  resetGame() {
    let stateReset = _.assign({}, this.state, {
      cells: this.randomBoard(["A", "B", "C", "D", "E", "F", "G"]),
      eliminated: [],
      choice1: null,
      choice2: null,
      score: 0,
      gameState: "game"
    });
    this.setState(stateReset);
  }

  // creates a random 2D array of cells
  randomBoard(chars) {
    // letiable for charactesr
    // generate coordinates
    let coordinates = [];
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        coordinates.push({x: j, y: i});
      }
    }
    // randomize coordinates to place letters
    coordinates = _.shuffle(coordinates);
    // construct the board by pushing letters based on coordinates into rows
    // then pushing the rows onto the board - another 2D array
    let board = [];
    for (i = 0; i < 4; i++) {
      // create 4 rows
      let row = [];
      for (j = 0; j < 4; j++) {
        // populate a row with 4 letters
        row.push(0);
      }
      // then push the row onto the board
      board.push(row);
    }
    let lastSeen = null;
    let charIndex = 0;
    for (i = 0; i < coordinates.length; i++) {
      let coord = coordinates[i];
      let character;
      if (lastSeen) {
        character = lastSeen;
        lastSeen = null;
        charIndex = (charIndex + 1) % chars.length;
      }
      else {
        character = chars[charIndex];
        lastSeen = character;
      }
      board[coord['y']][coord['x']] = character;
    }
    return board;
  }

  // logic for choosing cells
  choose(coord) {
    if (_.isEqual(this.state.choice1, coord) || _.isEqual(this.state.choice2, coord) || _.some(this.state.eliminated, coord)) {
      // don't do anything
    }

    else {
      if (this.state.choice1) {
        if (this.state.cells[coord.y][coord.x] == this.state.cells[this.state.choice1.y][this.state.choice1.x]) {
          let newEliminated = _.concat(this.state.eliminated, [this.state.choice1, coord]);
          this.setState(_.assign(this.state, {
            eliminated: newEliminated,
            choice1: null,
            score: this.state.score + 1
          }));
        }

        else {
          // arrow function acts like lambda
          window.setTimeout(() => {
            this.setState(_.assign(this.state, {
              choice1: null,
              choice2: null
            }));
          }, 1000);
          this.setState(_.assign(this.state, {
            choice2: coord,
            score: this.state.score + 1
          }));
        }
      }
      else {
        this.setState(_.assign(this.state, {
          choice1: coord,
          score: this.state.score + 1,
        }));
      }

      if (this.won()) {
        this.switchWin();
      }
    }
  }

  // returns true if the board is cleared
  won() {
    return this.state.eliminated.length == 16;
  }


  render() {
    switch (this.state.gameState) {
      case "game":
        return <GameScreen root={this}/>;
        break;
      case "win":
        return <WinScreen root={this}/>;
        break;
      default:
        throw "not a valid game state";
    }
   }
  }
  
  
  function GameScreen(props) {
    let onCellClicked = (coord) => {
      props.root.choose(coord);
    }
    return <div>
            <div className="row">
              <div className="column"><h1>Memory Game</h1></div>
            </div>
            <div className="row">
              <div className="column"><form action="http://memory1.leekev.com"><button type="submit" value="Reset">Restart</button></form></div>
              <div className="column"><p>Score: {props.root.state.score}</p></div>
            </div>
            <Board cells={props.root.state.cells}
                   shown={props.root.state.eliminated.concat([props.root.state.choice1,
                                                               props.root.state.choice2])}
                   onGuess={onCellClicked} />
           </div>;
  }

  function WinScreen(props) {
    return <div>
              <div classname="row">
                <div className="column"><h1>YOU WON</h1></div>
              </div>
              <div className="row">
                <div className="column"><p>Score: {props.root.state.score}</p></div>
              </div>
              <div className="row">
                 <div className="column"><form action="http://memory1.leekev.com"><button type="submit" value="Reset">Reset</button></form></div>
              </div>
            </div>;
  }

  function Board(props) {
    let board = [];
    let i, j;
    for (i = 0; i < 4; i++) {
      let columns = [];
      for (j = 0; j < 4; j++) {
        let card = <div key = {j.toString()} className="column">
                      <Card text = {props.cells[i][j]}
                            hidden = {!_.some(props.shown, {x: j, y: i})}
                            onGuess = {props.onGuess}
                            coord = {{x: j, y: i}} />
                    </div>;
        columns.push(card);
      }
      let row = <div key={i.toString()} className="row">{columns}</div>;
      board.push(row);
    }
    return board;
  }
  
  function Card(props) {
    if (props.hidden) {
      return <button className="card hidden-card" onClick={(e) => props.onGuess(props.coord)}>?</button>;
    }
    else {
      return <div className="card shown-card">{props.text}</div>;
    }
}

