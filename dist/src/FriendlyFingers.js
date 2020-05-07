var FriendlyFingers = /** @class */ (function () {
    function FriendlyFingers() {
        this.results = [];
        this.started = false;
        this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.init();
    }
    FriendlyFingers.prototype.init = function () {
        var _this = this;
        var elCurrent = document.querySelector('#currentLetter');
        this.timer = document.querySelector('#timer');
        this.letter = elCurrent;
        document.addEventListener('keydown', function (ev) {
            var keyPressed = ev.key.toUpperCase();
            if (ev.keyCode === 32) {
                _this.reset();
            }
        });
        this.start();
    };
    FriendlyFingers.prototype.reset = function () {
        clearInterval(this.intervalId);
        this.index = 0;
        this.letter.innerText = this.alphabet[this.index];
        this.timer.innerText = '0.00';
    };
    FriendlyFingers.prototype.start = function () {
        var _this = this;
        document.addEventListener('keydown', function (ev) {
            var key = ev.key.toUpperCase();
            if (key === 'A' && _this.index === 0) {
                _this.startTimer();
                _this.advance();
            }
            else {
                if (key === _this.alphabet[_this.index]) {
                    _this.advance();
                }
            }
        });
    };
    FriendlyFingers.prototype.advance = function () {
        this.index++;
        var letter = this.alphabet[this.index];
        if (letter) {
            this.letter.innerText = this.alphabet[this.index];
        }
        else {
            // No more letters
            this.saveTime(this.timer.innerText);
            this.finish();
        }
    };
    FriendlyFingers.prototype.fail = function () {
        alert('failed');
    };
    FriendlyFingers.prototype.startTimer = function () {
        var _this = this;
        var time = 0;
        this.intervalId = setInterval(function () {
            time += 10;
            _this.timer.innerText = (time / 1000).toFixed(3);
        }, 10);
    };
    FriendlyFingers.prototype.saveTime = function (time) {
        this.time = time;
        this.results.push(time);
    };
    FriendlyFingers.prototype.finish = function () {
        alert(this.time);
        this.reset();
    };
    return FriendlyFingers;
}());
export default FriendlyFingers;
//# sourceMappingURL=FriendlyFingers.js.map