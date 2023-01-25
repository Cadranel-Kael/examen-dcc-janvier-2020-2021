// Nom    :
// Prénom :
// Groupe :

class Player {
    #score

    constructor() {
        this.#score = 0;
    }

    get score() {
        return this.#score;
    }

    resetscore() {
        this.#score = 0;
    }

    removePoint() {
        this.#score--;
    }

    addPoint() {
        this.#score++;
    }
}

const settings = {
    time: 50, // in seconds
    boardSize: 3 // n x n
}

const app = {
    board: document.getElementById('app'),
    timer: document.querySelector('.timer'),
    winPoses: [
    // row
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    // column
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    // diagonal
      [0, 4, 8],
      [2, 4, 6],
    ],
    boardItems: [],
    currentTime: settings.time,
    playable: 1,
    currentPlayer: 0,
    winner: null,
    players: [new Player(), new Player()],
    scoreContainer: [document.querySelector('.result_item--js'),document.querySelector('.result_item--love')],
    generateBoard() {
        this.board.classList.add('js');
        for (let i = 0; i < settings.boardSize*settings.boardSize; i++) {
            const item = document.createElement('li');
            item.classList.add('grid__item');
            item.addEventListener('click', (e) => this.onClick(e))
            this.boardItems.push(item);
            this.board.append(item);
        }
    },
    onClick(e) {
        this.board.classList.remove('js');
        this.board.classList.remove('love');
        if (!this.playable) return;
        if (e.currentTarget.classList.contains('grid__item--js') || e.currentTarget.classList.contains('grid__item--love')) {
            this.players[this.currentPlayer].removePoint();
            this.updateScore();
            return;
        }
        if (!this.currentPlayer) {
            e.currentTarget.classList.add('grid__item--js');
            this.board.classList.add('love');
            this.players[0].addPoint();
            this.currentPlayer = 1;
        } else {
            this.board.classList.add('js');
            e.currentTarget.classList.add('grid__item--love');
            this.players[1].addPoint();
            this.currentPlayer = 0;
        }
        this.updateScore();
        this.checkWin();
        if (this.winner != null) return;
        this.checkEnd();
    },
    startTimer() {
        if (!this.playable) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(()=> {
            this.currentTime--;
            this.updateTime();
            if (this.currentTime <= 0) {
                this.tie();
                this.end();
            }
        }, 1000)
    },
    stopTimer() {
        clearInterval(this.interval);
        this.updateTime();
    },
    updateTime () {
        let minutes = Math.floor((this.currentTime/60) % 60);
        if (minutes.toString().length <= 1) minutes = `0${minutes}`;
        let seconds = Math.floor(this.currentTime % 60);
        if (seconds.toString().length <= 1) seconds = `0${seconds}`;
        this.timer.textContent = `${minutes} : ${seconds}`;
    },
    updateScore() {
        this.scoreContainer[0].textContent = `Joueur 1 : ${this.players[0].score}`;
        this.scoreContainer[1].textContent = `Joueur 2 : ${this.players[1].score}`;
    },
    checkWin() {
        for (let i = 0; i < this.winPoses.length; i++) {
            if (!this.boardItems[this.winPoses[i][0]].classList.contains('grid__item--js') && !this.boardItems[this.winPoses[i][0]].classList.contains('grid__item--love')) continue;
            if (this.boardItems[this.winPoses[i][0]].className === this.boardItems[this.winPoses[i][1]].className &&
                this.boardItems[this.winPoses[i][1]].className === this.boardItems[this.winPoses[i][2]].className) {
                if ((this.boardItems[this.winPoses[i][0]]).classList.contains('grid__item--js')) {
                    this.jsWin();
                    this.end();
                }
                else {
                    this.loveWin();
                    this.end();
                }
                return;
            }
        }
    },
    jsWin() {
        this.form = document.querySelector('.play-again-template--js').innerHTML;
        document.body.insertAdjacentHTML('beforeend', this.form);
        this.form = document.querySelector('.play-again-template__form');
        // document.body.insertAdjacentHTML('beforeend', '<form class="play-again-template_form" method="get"><p class="play-again-template_form__message"><span class="play-again-template_form__message__winner play-again-template_form__message__winner--js">js</span> a gagné !</p><input class="btn play-again-template_form__submit" type="submit" value="Jouer à nouveau !"></form>')
        this.winner = 0;
        this.setupForm();
    },
    loveWin() {
        this.form = document.querySelector('.play-again-template--love').innerHTML;
        document.body.insertAdjacentHTML('beforeend', this.form);
        this.form = document.querySelector('.play-again-template__form');
        // document.body.insertAdjacentHTML('beforeend', '<form class="play-again-template_form" method="get"><p class="play-again-template_form__message"><span class="play-again-template_form__message__winner play-again-template_form__message__winner--Love">love</span> a gagné !</p><input class="btn play-again-template_form__submit" type="submit" value="Jouer à nouveau !"></form>')
        this.winner = 1;
        this.setupForm();
    },
    tie() {
        this.form = document.querySelector('.play-again-template--lost').innerHTML;
        document.body.insertAdjacentHTML('beforeend', this.form);
        this.form = document.querySelector('.play-again-template__form');
        // document.body.insertAdjacentHTML('beforeend', '<form class="play-again-template_form" method="get"><p class="play-again-template_form__message">Le jeu est perdu</p><input class="btn play-again-template_form__submit" type="submit" value="Jouer à nouveau !"></form>\n')
        this.winner = null;
        this.setupForm();
    },
    setupForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.reset();
        })
    },
    end() {
        this.stopTimer();
        this.playable = 0;
        this.board.classList.remove('js');
        this.board.classList.remove('love');
    },
    checkEnd() {
        for (const boardItem of this.boardItems) {
            if (!boardItem.classList.contains('grid__item--js') && !boardItem.classList.contains('grid__item--love')) return;
        }
        this.tie();
        this.end();
    },
    reset() {
        this.currentTime = settings.time;
        this.updateTime();
        this.startTimer();
        if (this.winner === 0 || this.winner == null) {
            this.currentPlayer = 0;
        } else {
            this.currentPlayer = 1;
        }
        for (const boardItem of this.boardItems) {
            boardItem.classList.remove('grid__item--js');
            boardItem.classList.remove('grid__item--love');
        }
        this.playable = 1;
        this.players.forEach((player) => player.resetscore());
        this.updateScore();
        this.form.remove();
        this.winner = null;
    },
    init() {
        document.body.classList.add('js-enabled');
        document.querySelector('p.no-js__message').remove();
        this.generateBoard();
        this.updateTime();
        this.startTimer();
    }
}

app.init();