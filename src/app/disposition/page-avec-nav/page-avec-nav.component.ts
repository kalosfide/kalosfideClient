import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageAvecNav } from './page-avec-nav';
import { PageAvecNavService } from './page-avec-nav.service';

export abstract class PageAvecNavComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];

    abstract pageAvecNav: PageAvecNav;

    constructor(
        private _navService: PageAvecNavService,
    ) {}

    ngOnInit() {
        this._navService.section$().subscribe(section => this.pageAvecNav.activeSection(section.index));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
