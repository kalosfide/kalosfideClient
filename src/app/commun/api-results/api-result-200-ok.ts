import { ApiResult } from './api-result';

export class ApiResult200Ok<T> extends ApiResult {
    static code = 200;

    private _lecture: T;

    constructor(lecture: T) {
        super(200);
        this._lecture = lecture;
    }
    get lecture(): T {
        return this._lecture;
    }
}
