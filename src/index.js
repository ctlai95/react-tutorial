import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            <font color={props.color}>{props.value}</font>
        </button >
    );
}

class Board extends React.Component {
    renderSquare(i, color) {
        return (
            <Square
                value={this.props.squares[i]}
                color={color}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        const items = [];
        for (let i = 0; i < 3; i++) {
            const squares = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                let color = this.props.winLine.includes(j) ? 'red' : 'black';
                squares.push(this.renderSquare(j, color));
            }
            items.push(<div className="board-row" key={i} >{squares}</div>);
        }

        return (
            <div>{items}</div >
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastLocation: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: false,
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
                lastLocation: getLocationFromIndex(i),
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

    toggleListView() {
        this.setState({
            ascending: !this.state.ascending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} (${history[move].lastLocation.col}, ${history[move].lastLocation.row})` :
                'Go to game start';
            return (
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)}>
                        <span style={move === this.state.stepNumber ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
                            {desc}
                        </span>
                    </button>
                </li >
            );
        });

        let movesList = <ol>{moves}</ol>;
        if (this.state.ascending) {
            moves = moves.reverse();
            movesList = <ol reversed>{moves}</ol>
        }

        let status;
        let winLine = [];
        if (winner) {
            status = 'Winner: ' + winner.team;
            winLine = winner.line;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleListView()}>Toggle List View</button>
                    {movesList}
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
            return {
                team: squares[a],
                line: lines[i],
            };
        }
    }
    return null;
}

function getLocationFromIndex(index) {
    return {
        col: index % 3,
        row: Math.floor(index / 3),
    }
}
