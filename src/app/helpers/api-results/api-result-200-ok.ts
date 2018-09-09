import { ApiResult } from './api-result';

export class ApiResult200Ok<T> extends ApiResult {
    static code = 200;

    lecture: T;

    constructor(lecture: T) {
        super(200);
        this.lecture = lecture;
    }
}
