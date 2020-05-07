export default class FriendlyFingers {

    private time: number
    private index: number
    private timer: HTMLElement
    private intervalId: any;
    private results: any = [];
    private started: boolean = false;

    private letter: any;

    private alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    constructor() {
        this.init();
    }


    init() {
        const elCurrent = document.querySelector('#currentLetter');
        this.timer = document.querySelector('#timer');
        this.letter = elCurrent;
        document.addEventListener('keydown', (ev: KeyboardEvent) => {

            let keyPressed = ev.key.toUpperCase();

            if(ev.keyCode === 32) {
                this.reset();
            }
        })

        this.start()
    }

    reset() {
        clearInterval(this.intervalId);
        this.index = 0;
        this.letter.innerText = this.alphabet[this.index];
        this.timer.innerText = '0.00';

    }

    start() {
        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            let key = ev.key.toUpperCase();
            if(key === 'A' && this.index === 0) {
                this.startTimer();
                this.advance();
            } else {
                if(key === this.alphabet[this.index]) {
                    this.advance();
                }
            }
        })
    }

    advance() {
        this.index++;
        let letter = this.alphabet[this.index];

        if(letter) {
            this.letter.innerText = this.alphabet[this.index];
        } else {
            // No more letters
            this.saveTime(this.timer.innerText)
            this.finish()
        }

    }

    fail() {
        alert('failed');
    }

    startTimer() {
        let time = 0;
        this.intervalId = setInterval(() => {
            time += 10
            this.timer.innerText = (time / 1000).toFixed(3);
        }, 10)
    }

    saveTime(time: any) {
        this.time = time;
        this.results.push(time);
    }

    finish() {
        alert(this.time)
        this.reset();
    }


}