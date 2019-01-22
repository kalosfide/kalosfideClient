import { ClientModel } from 'src/app/client/client';

export class DevenirClientModel extends ClientModel {
    email: string;
    password: string;
    siteUid: string;
    siteRno: number;
}
