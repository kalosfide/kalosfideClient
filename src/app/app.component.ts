import { Component, OnInit, HostListener } from '@angular/core';
import { EventListener } from '@angular/core/src/debug/debug_node';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    dev = true;

    constructor(
    ) {
    }

    ngOnInit() {
        if (!this.dev) {
            window.addEventListener('beforeunload', (ev: BeforeUnloadEvent) => {
                console.log('window.beforeunload', event);
                // Cancel the event as stated by the standard.
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = false;
            });
       }
   }
}
