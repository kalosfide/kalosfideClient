import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigService {

    private _config: { [key: string]: string };

    constructor() {
        this._config = {
            UrlAPI: 'https://localhost:44391/api/'
        };
    }

    get setting(): { [key: string]: string } {
        return this._config;
    }

    get(key: any) {
        return this._config[key];
    }
}
