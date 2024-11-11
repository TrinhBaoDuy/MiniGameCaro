import { director, ISchedulable, macro } from "cc";

declare global {
    interface PromiseConstructor {
        wait(seconds: number, target?: ISchedulable): Promise<void>;
        waitUntil(
            func: () => boolean,
            target?: ISchedulable,
            interval?: number
        ): Promise<void>;
    }
}

Promise.wait = function (
    seconds: number,
    target?: ISchedulable
): Promise<void> {
    if (!target) {
        target = director.getScene();
    }
    return new Promise((res) => {
        if (seconds > 0) {
            director
                .getScheduler()
                .schedule(() => res(), target, seconds, 0, 0, false);
        } else {
            res();
        }
    });
};

Promise.waitUntil = function (
    func: () => boolean,
    target?: ISchedulable,
    interval = 0
): Promise<void> {
    return new Promise((res) => {
        if (!target) {
            target = director.getScene();
        }
        const callback = () => {
            if (func()) {
                director.getScheduler().unschedule(callback, target);
                res();
            }
        };
        director
            .getScheduler()
            .schedule(callback, target, interval, macro.REPEAT_FOREVER, 0, false);
    });
};

export class DeferredPromise<T = any> {
    public promise: Promise<T>;

    private _succeed = false;
    private _failed = false;

    private res: (value?: any) => void;
    private rej: (reason?: any) => void;

    constructor() {
        this.promise = new Promise((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
    }

    public resolve(value?: any) {
        this._succeed = true;
        this.res(value);
        return;
    }

    public reject(reason?: any) {
        this._failed = true;
        this.rej(reason);
        return;
    }

    public get succeed() {
        return this._succeed;
    }

    public get failed() {
        return this._failed;
    }

    public get completed() {
        return this._succeed || this._failed;
    }
}