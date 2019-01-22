import { SectionDeNavigation } from './section-de-navigation';
import { Subject, Observable, of } from 'rxjs';

export class PageAvecNavService {

    private _section = new Subject<SectionDeNavigation>();

    public section$(): Observable<SectionDeNavigation> {
        return this._section.asObservable();
    }

    changeSection(section: SectionDeNavigation) {
        this._section.next(section);
    }

}
