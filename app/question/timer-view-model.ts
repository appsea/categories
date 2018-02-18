import {EventData, Observable} from "data/observable";
import {clearInterval, setInterval, setTimeout} from "timer";
import {QuestionViewModel} from "./question-view-model";
import {State} from "../shared/questions.model";
import {SettingsService} from "../services/settings.service";

export class TimerViewModel extends QuestionViewModel {
    private _seconds: number = 0;
    private _minutes: number = 5;
    private _time: string;
    private clock: any;

    constructor(mode: string) {
        super(mode);
        this._minutes = this.state.time;
        if(this._minutes>5){
            this._minutes = 2;
        }
        this.clock = setInterval(() => {
            if (this._seconds <= 0) {
                if(--this._minutes==-1){
                    this._minutes = 0;
                    this.stopTimer();
                    this.showResult();
                }else{
                    this._seconds = 10;
                }
            } else {
                this._seconds--;
            }
            this._time = (("0" + this._minutes).slice(-2)) + ":"+(("0" + this._seconds).slice(-2));
            this.publish();
        }, 1000);
    }

    public publish() {
        super.publish();
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'time', value: this._time});
    }

    public saveAndPublish(mode: string, state: State) {
        state.time = this._minutes;
        SettingsService.getInstance().saveCache(mode, state);
        this.publish();
    }

    stopTimer() {
        clearTimeout(this.clock);
    }
}