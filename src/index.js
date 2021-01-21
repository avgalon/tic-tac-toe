import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

export function Square(props) {
        return (
            <button
                className="square"
                onClick={props.onClick}>
                {props.value}
            </button>
        );
}

class Board extends React.Component {
    renderSquare(i, j) {
        const squareIdx = (j === 1 ? i + 3 : (j === 2 ? i + 6 : i));
        return <Square key={`square-${i}-${j}-${squareIdx}`} value={this.props.squares[squareIdx]} onClick={() => this.props.onClick(squareIdx)}/>;
    }

    renderBoardRow(i) {
        return <div key={`board-row-${i}`} className="board-row">
                    {[...Array(3)].map((x, j) =>
                        this.renderSquare(i, j)
                    )}
                </div>;
    }

    render() {
        return (
            <div>
                {[...Array(3)].map((x, i) =>
                    this.renderBoardRow(i)
                )}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            xIsNext: true,
            stepNumber: 0
        }
    }

    getGameStatus() {
        const winner = calculateWinner( [...this.state.history].pop().squares);
        return winner ? `Winner: ${winner}` : `Next player: ${this.getXorO()}`;
    }

    getXorO() {
        return this.state.xIsNext ? "X" : "O";
    }

    getMovesHistory() {
        return this.state.history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.getXorO();
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    render() {
        const current = this.state.history[this.state.stepNumber];
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{this.getGameStatus()}</div>
                    <ol>{this.getMovesHistory()}</ol>
                </div>
            </div>
        );
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
            return squares[a];
        }
    }
    return null;
}