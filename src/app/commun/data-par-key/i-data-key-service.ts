import { DataService } from 'src/app/services/data.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { RouteurService } from 'src/app/services/routeur.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IKeyUidRno } from './key-uid-rno/i-key-uid-rno';

export interface IDataKeyService {
    dataService: DataService;
    identification: IdentificationService;
    routeur: RouteurService;
    navigation: NavigationService;
    keyIdentifiant: IKeyUidRno;
    keySiteEnCours: IKeyUidRno;
}
