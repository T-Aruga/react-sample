import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className={props.isHighlight ? 'square highlight': 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isHighlight) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        isHighlight={isHighlight}
      />
    );
  }

  render() {
    const boardSize = 3;
    const boardRow = [];
    let isHighlight;

    for(let row=0; row<boardSize; row++){
      const squres = [];

      for(let col=0; col<boardSize; col++){
        isHighlight = this.props.winLine.includes(row * 3 + col);
        squres[col] = this.renderSquare(row * 3 + col, isHighlight);
      }

      boardRow.push(
        <div className="board-row" key={row}>
          {squres}
        </div>
      )
    }

    return (
      <div>
        {boardRow}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: {
            col: null,
            row: null
          }
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortType: 'ascending',
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: {
            col: i % 3 + 1,
            row: Math.trunc(i / 3 + 1),
          }
        }
      ]),
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

  toggleSortType() {
    if(this.state.sortType === 'ascending'){
      this.setState({
        sortType: 'descending',
      });
    }else if(this.state.sortType === 'descending'){
      this.setState({
        sortType: 'ascending',
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}.` :
        'Go to game start';

      const descLocation = move ?
        `(${step.location.col}, ${step.location.row})` :
        '';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? "selected" : ""}>
            {desc} {descLocation}
          </button>
        </li>
      );

    });
    if(this.state.sortvType === 'descending'){
      moves.reverse();
    }

    let status;
    if (winInfo.winner) {
      status = "Winner: " + winInfo.winner;
    } else if(!current.squares.includes(null)) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button type="button" onClick={() => this.toggleSortType()}>sort</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const winInfo = {
    winner: null,
    line: [null],
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winInfo.winner = squares[a];
      winInfo.line = lines[i];
      return winInfo;
    }
  }
  return winInfo;
}
