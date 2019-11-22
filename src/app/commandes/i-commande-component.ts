import { CommandeService } from './commande.service';

/**
 * fournit l'accès au client, au site, au CommandeService, à la clé de la commande
 */
export interface ICommandeComponent {

    service: CommandeService;
}
