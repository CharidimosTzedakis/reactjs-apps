import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.class}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    
    let buttonClass='';
    for (let j in this.props.winningSquares){
      if (i === this.props.winningSquares[Number(j)]) {
        buttonClass = 'winningSquare';
        break;
      }
    }
    
    return (
      <Square
        value={this.props.squares[i]}
        class={buttonClass}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
      let board = [];
      for (let i=0; i<9; i=i+3){
        let row = [];
        for (let j=i; j<i+3; j++){
          row.push(this.renderSquare(j));
        }
        board.push(React.createElement(
                    'div',
                    {className: 'board-row'},
                    row
                  ));
      }
      return(
        <div>
          {board}
        </div>
      );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),     /* specific board instance          */
        squarePlayed: -1,                 /* holds the move that was played   */
      }],                                 /* in the board described by squares*/
      stepNumber: 0,
      xIsNext: true,
      showMovesOrder: 'firstToLast',
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
          return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squarePlayed: i,
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

    //--> make bold the clicked button from move history list<--//
    let element;

    for (let i=0; i<this.state.history.length; i++){
      element = document.getElementById(i);
      if (i===step){
        element.style.fontWeight = "bold";
      }
      else{
        element.style.fontWeight = "normal";
      }
    }
  }

  //toggle sorting of moves Ascending/Descending
  toggleMoveButtonOrder(){
    if (this.state.showMovesOrder === 'firstToLast'){
      this.setState({
        showMovesOrder: 'lastToFirst',
      });
    }
    else{
      this.setState({
        showMovesOrder: 'firstToLast',
      });
    }
  }

  //--> calculate for a particular history which was the move by doing the diff <--//
  //--> or by just using squarePlayed from state                                <--//
  rowColPositionForStep (boardInstance, move){
    const history = this.state.history;
/*  const previousMove = move-1;
    const currentMoveIndex = boardInstance.squares.findIndex( (element, index) =>{
        if ((element ==='X' || element ==='O') &&
            (previousMove >= 0) &&
            (history[previousMove].squares[index] === null)){
          return true;
        }
        else {
          return false;
        }
    });     */
    const currentMoveIndex = boardInstance.squarePlayed;
    let rowColPositionString = '';
    if (currentMoveIndex !== -1){
      const row = Math.trunc(currentMoveIndex/3) +1;
      const col = (currentMoveIndex % 3) +1;
      rowColPositionString = boardInstance.squares[currentMoveIndex] + ' (' + row + ',' + col + ')';
    }
    return rowColPositionString;
  }
 //--> ----------------------------------------------------------------------- <---//
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerTriplet = calculateWinner(current.squares);
    const winner = winnerTriplet? winnerTriplet[0] : null ;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ':' + this.rowColPositionForStep(step, move) :
        'Go to game start';
      return (
        <li key={move}>
          <button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (this.state.showMovesOrder === 'lastToFirst'){
      moves.reverse();
    }

    let status;
    if (winner!==null) {
      status = 'Winner: ' + current.squares[winner];
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares = {winnerTriplet}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.toggleMoveButtonOrder()}>Sort Ascending/Descending</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

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
      return [a, b, c];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
