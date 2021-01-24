import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement> | number) => void;
    value: SquareValue;
}

export interface BoardProps {
    onClick: (idx: number) => void;
    squares: SquareValue[]
}



export function Square(props: SquareProps): JSX.Element {
        return (
            <button
                className="square"
                onClick={ props.onClick }>
                {props.value}
            </button>
        );
}

class Board extends React.Component {
   // @ts-ignore
    props: BoardProps;

    renderSquare(i: number, j: number): JSX.Element {
        const squareIdx: number = (j === 1 ? i + 3 : (j === 2 ? i + 6 : i));
        return <Square key={`square-${i}-${j}-${squareIdx}`} value={this.props.squares[squareIdx]} onClick={() => this.props.onClick(squareIdx)}/>;
    }

    renderBoardRow(i: number): JSX.Element {
        return <div key={`board-row-${i}`} className="board-row">
                    {[...Array(3)].map((x, j) =>
                        this.renderSquare(i, j)
                    )}
                </div>;
    }

    render(): JSX.Element {
        return (
            <div>
                {[...Array(3)].map((x, i) =>
                    this.renderBoardRow(i)
                )}
            </div>
        );
    }
}



interface GameState {
    history: [{squares: SquareValue[]}];
    xIsNext: boolean;
    stepNumber: number;
}

class Game extends React.Component {
    state: GameState;

    constructor(props: SquareProps) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            xIsNext: true,
            stepNumber: 0
        }
    }

    getGameStatus(): string {
        const lastMoveSquares = [...this.state.history].pop();
        let winner: string | null = `err`;
        if (lastMoveSquares) {
            winner = calculateWinner(lastMoveSquares.squares);
        }
        return winner ? `Winner: ${winner}` : `Next player: ${this.getXorO()}`;
    }

    getXorO(): SquareValue {
        return this.state.xIsNext ? "X" : "O";
    }

    getMovesHistory(): JSX.Element[] {
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

    jumpTo(step: number): void {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i: number) {
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

    render(): JSX.Element {
        const current = this.state.history[this.state.stepNumber];
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i: number) => this.handleClick(i)}
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

function calculateWinner(squares: SquareValue[]): SquareValue {
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