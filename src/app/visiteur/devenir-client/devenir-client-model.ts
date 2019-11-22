import { ClientData } from 'src/app/modeles/clientele/client';

export class DevenirClientModel extends ClientData {
    email: string;
    password: string;
    siteUid: string;
    siteRno: number;
}
