import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    const classAttribute = (props.winningSquare) ? "square winning" : "square";
    return (
      <button className={classAttribute} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {  
    renderSquare(i, winning) {
      return (
        <Square
          key = {i}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
          winningSquare = {winning}
        />
      );
    }
  
    render() {
      let squaresRows = [];
      let squareBoard = []; 
      for (let i = 0; i < 3; i++){
        squaresRows = [];
        for (let j = 0; j < 3; j++){
          if (this.props.winningLines !== null && 
            this.props.winningLines.find((line) => (line === 3*i+j)) !== undefined ) {
            squaresRows.push(this.renderSquare(3*i+j, true));
          } else {
            squaresRows.push(this.renderSquare(3*i+j, false));
          }
        }
        squareBoard.push(
          <div key={i} className="board-row">
            {squaresRows}
            </div>
        );
      }

      return (
        <div>
          {squareBoard}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        movesOrder: 'descending',
      };
    }
    
    findMovePositionForAnyStep (stepNumber, history) {
      let previousMove = 0;
      let row,col;
      const current = history[stepNumber].squares;
      if (stepNumber > 0) {
        const previous = history[stepNumber-1].squares;
        previousMove = current.reduce((acc, val, indx) => {
          if (previous[indx] === null && val !== null) {
            acc = indx;
            console.log(acc);
          }
          return acc;
        }, 0); 
        row = Math.floor(previousMove / 3) + 1;
        col = (previousMove % 3) + 1;  
      } else {
        row = 0;
        col = 0;
      }
      return ({row, col});
    }

    revertMovesOrder() {
      this.setState({
        movesOrder: (this.state.movesOrder === 'descending') ? 
          'ascending' : 
          'descending' 
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares).winner;
      const winningLines = calculateWinner(current.squares).lines;

      const moves = history.map((step, move) => {
        const movePosition = this.findMovePositionForAnyStep (move, history);
        const desc = move ?
          `Go to move # ${move} (col,row)=(${movePosition.col},${movePosition.row})` :
          'Go to game start';
        if (move === this.state.stepNumber){
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
            </li>
          );
        } else {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else if (this.state.stepNumber === 9) {
        status = 'This is a draw.'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winningLines = {winningLines}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <button onClick={() => this.revertMovesOrder()}>sort order</button>
            {this.state.movesOrder === 'descending'? 
              <ol>{ moves }</ol> : 
              <ol reversed>{ moves.reverse() }</ol> 
            }
          </div>
        </div>
      );
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
  
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], lines: lines[i]};
      }
    }
    return {winner:null, lines:null};
  }