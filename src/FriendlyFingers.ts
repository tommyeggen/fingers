import Scores from "./Scores";
import * as Mustache from "mustache";

export default class FriendlyFingers {

    private time: number
    private startTime: number;
    private index: number
    private timer: HTMLElement
    private intervalId: any;

    private scores: Scores;
    private letter: any;

    private soundToggle: HTMLElement;

    private alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    private endTemplate: string;

    private soundFail: HTMLAudioElement;
    private soundSuccess: HTMLAudioElement;
    private soundHighScore: HTMLAudioElement;

    constructor() {
        this.endTemplate = document.querySelector('[data-id="tpl-end-screen"]').innerHTML;
        this.soundFail = document.querySelector('#sound-fail');
        this.soundSuccess = document.querySelector('#sound-success');
        this.soundHighScore = document.querySelector('#sound-high-score');
        this.init();
    }


    init() {
        const elCurrent = document.querySelector('#current-letter');
        this.soundToggle = document.querySelector('#toggle-sound');
        this.scores = new Scores(document.querySelector('#scores'));
        this.scores.render();
        this.timer = document.querySelector('#timer');
        this.letter = elCurrent;
        this.timer.click();
        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            let keyPressed = ev.key.toUpperCase();

            if(keyPressed === ' ') {
                this.timer.parentElement.classList.add('--is-visible');
                this.removeEndScreen();
                this.reset();
            }
        })

        if(this.isMuted()) {
            this.mute();
        }

        this.soundToggle.addEventListener('click', () => {
            this.toggleSound();
        });

        this.start()
    }

    mute() {
        this.soundToggle.firstChild.textContent = 'volume_up'
        this.soundFail.volume = 0;
        this.soundSuccess.volume = 0;
        this.soundHighScore.volume = 0;
        localStorage.setItem('is_muted', 'true');
    }

    unMute() {
        this.soundToggle.firstChild.textContent = 'volume_off'
        this.soundFail.volume = 1;
        this.soundSuccess.volume = 1;
        this.soundHighScore.volume = 1;
        localStorage.setItem('is_muted', 'false');
    }

    reset() {
        clearInterval(this.intervalId);
        this.letter.parentElement.classList.remove('--is-wrong')
        this.index = 0;
        this.letter.innerText = this.alphabet[this.index];
        this.letter.classList.add('cta');
        this.timer.innerText = 'Start by hitting';
    }

    start() {
        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            let key = ev.key.toUpperCase();
            if(key === 'A' && this.index === 0) {
                this.letter.classList.remove('cta')
                this.startTimer();
                this.advance();
            } else {
                if(key === this.alphabet[this.index]) {
                    this.advance();
                }

                else {
                    if(this.index > 0) {
                        this.fail();
                    }
                }

            }
        })
    }

    advance() {
        this.playSound('success');
        this.letter.parentElement.classList.remove('--is-wrong')
        let scale = 1;
        let interval = setInterval(() => {
            if(scale < 1.8) {
                scale = scale + .05;
            } else {
                scale = 1;
                clearInterval(interval)
            }
            this.letter.parentElement.style.transform = 'scale(' + scale + ')';
        }, 5)

        this.index++;
        let letter = this.alphabet[this.index];

        if(letter) {
            this.letter.innerText = this.alphabet[this.index];
            this.letter.parentElement.style.removeProperty('transform');

        } else {
            // Congratulations, you finished
            this.finish()
        }

    }

    fail() {
        this.playSound('fail');
        this.letter.parentElement.classList.add('--is-wrong');
    }

    startTimer() {
        this.startTime = Date.now();
        let time = 0;
        this.intervalId = setInterval(() => {
            time += 10;
            this.timer.innerText = String((time / 1000).toFixed(2));
        }, 10)
    }

    finish() {
        clearInterval(this.intervalId);
        let actualTime = (Date.now() - this.startTime);
        let score = Scores.createScore(actualTime);
        this.scores.saveScore(score);
        this.reset();
        this.scores.render();
        this.displayEndScreen(score);
    }

    displayEndScreen(score: Score) {

        let highScore = this.scores.getHighScore();

        const isHighScore = score.actualTime <= highScore.actualTime;


        let getGreeting = () => {

            if(isHighScore) {
                return 'NEW HIGH SCORE!'
            }

            let diff = score.actualTime - highScore.actualTime;

            if(diff < 500) {
                return 'Ah, so close...'
            } else {
                return 'Not good enough...';
            }

        }
        let context = {
            time: score.score,
            greeting: getGreeting(),
            isHighScore: isHighScore,
        }
        let dialog = document.createElement('div')
        dialog.classList.add('dialog');
        dialog.innerHTML = Mustache.render(this.endTemplate, context)
        document.body.appendChild(dialog);
        if(isHighScore) {
            this.playSound('high-score');
        }
    }

    removeEndScreen() {
        let dialog = document.querySelector('.dialog');
        if(dialog) {
            dialog.parentElement.removeChild(dialog);
        }
    }

    playSound(sound: string) {
        let el: HTMLAudioElement;
        switch(sound) {
            case 'success':
                el = this.soundSuccess;
                break;
            case 'fail':
                el = this.soundFail;
                break;
            case 'high-score':
                el = this.soundHighScore;
        }
        el.play().then(() => {
            el.currentTime = 0;
        })
    }

    isMuted() {
        return localStorage.getItem('is_muted') === 'true';
    }

    toggleSound() {
        if(this.isMuted() === false) {
            this.mute();
        } else {
            this.unMute();
        }
    }

}