import { PageDef } from '../page-def';
import { IDataKeyService } from './i-data-key-service';

export interface IDataKeyComponent {
    pageDef: PageDef;
    service?: IDataKeyService;
}
