const SELECTOR_CLOCK = '.clock';
const SELECTOR_TIME_FORMAT = '.time-format'

const MILLISECONDS_PER_HOUR = 3600 * 1000;

const timezones = {
    'EST': -5,
    'UTC': 0,
    'EET': 2,
    'JST': 9
}


let clocks = [];

class Clock {
    constructor() {

        this.timeFormat = 24;

        this.run();

        this.setEventListeners();
    }

    run() {

        setTimeout(() => {
            this.updateTime();

            setTimeout(this.run.bind(this), 10);
        },10);

    }

    format(time) {
        let hours = time.getUTCHours(), meridiem = '';

        if(this.timeFormat == 12) {

            meridiem = 'AM';
            if(hours > 11) {
                meridiem = 'PM';
            }

            //12am - midnight
            if(hours == 0) {
                hours = 12;
            }

            if(hours > 12) {
                hours = hours - 12;
            }

        }

        return `${String(hours).padStart(2, 0)}:`+
               `${String(time.getUTCMinutes()).padStart(2, 0)}:`+
               `${String(time.getUTCSeconds()).padStart(2, 0)}`+
               ` ${meridiem}`;
    }

    updateTime() {

        clocks.forEach((clock) => {

            let time = this.getTime(clock.timezone);

            clock.el.innerHTML = this.format(time);
        });
    }

    getTime(timezone) {

        //timezone offset in milliseconds
        let offset = MILLISECONDS_PER_HOUR * timezones[timezone];

        return new Date( Date.now() + offset );
    }

    setEventListeners() {

        //12 or 24 hour time format dropdown
        document.querySelector(SELECTOR_TIME_FORMAT).addEventListener('change', (event) => {
            this.timeFormat = event.currentTarget.value;
        });
    }
}

let clock = new Clock();


//find all elements with class 'clock' on the page
document.addEventListener('DOMContentLoaded', () =>{
    
    document.querySelectorAll(SELECTOR_CLOCK).forEach((clock) => {
        clocks.push({
            'el': clock,
            'timezone': clock.dataset.tz
        });
    });

});