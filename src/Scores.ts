import * as Mustache from "mustache";
import DateTimeFormat = Intl.DateTimeFormat;

export default class Scores {

    private scores: Score[];

    private container: HTMLElement;
    private readonly template: string;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scores = this.getSavedScores();
        this.template = document.querySelector('[data-id="tpl-scores"]').innerHTML;
    }

    saveScore(score: Score) {

        ga('set', 'dimension1', score.score);

        let scores: any;
        if (this.getSavedScores()) {
            scores = this.getSavedScores();
        } else {
            scores = [];
        }

        scores = scores.sort((a:any, b:any) => {
            return a.actualTime - b.actualTime
        });

        if(scores.length > 10) {
            scores[scores.length - 1] = score;
        } else {
            scores.push(score);
        }

        localStorage.setItem('scores', JSON.stringify(scores));
        this.scores = scores;
    }

    getSavedScores(): Score[] {
        return JSON.parse(localStorage.getItem('scores'));
    }

    render() {
        let scores: any = this.scores;

        if(scores && scores.length >= 1) {
            scores.sort((a: any, b: any) => {
                return a.actualTime > b.actualTime;
            });
        }

        const context = {
            scores: scores,
            highScore: this.getHighScore()
        }

        this.container.innerHTML = Mustache.render(this.template, context);
        this.setup();
    }

    setup() {
        const clearBtn = document.querySelector('#clear-scores');
        clearBtn.addEventListener('click', () => {
            this.clear();
        });
    }

    getHighScore(): Score {
        let scores: any = this.scores;
        if(scores && scores.length >= 1) {
            scores.sort((a: any, b: any) => {
                return a.actualTime - b.actualTime;
            });
        } else {
            return {};
        }

        return scores[0];
    }

    clear() {
        this.scores = [];
        localStorage.setItem('scores', JSON.stringify([]));
        this.render();
    }

    static createScore(time: any): Score {
        const date: Date = new Date();
        const dtf = new DateTimeFormat;
        return {
            timestamp: Date.now(),
            date: dtf.format(date),
            score: (time / 1000).toFixed(3),
            actualTime: time,
        };
    }


}