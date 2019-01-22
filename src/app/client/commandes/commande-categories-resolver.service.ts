import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommandeLigne } from './commande-ligne';
import { Categorie } from '../../modeles/categorie';
import { groupePar } from '../../commun/outils/groupe-par';
import { CommandeVue } from './commande';

@Injectable()
export class CommandeCategoriesResolverService implements Resolve<Categorie[]> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<never> | Observable<Categorie[]> {
        const commande: CommandeVue = route.parent.data['commande'];
        const map = groupePar<CommandeLigne, Categorie>(commande.lignes, l => {
            const p = l.produit;
            const c = new Categorie();
            c.uid = p.uid;
            c.rno = p.rno;
            c.no = p.categorieNo;
            c.nom = p.nomCategorie;
            return c;
        });
        const categories: Categorie[] = [];
        map.forEach((lignes: CommandeLigne[], categorie: Categorie) => {
            categorie.nbProduits = lignes.length;
            categories.push(categorie);
        });
        return of(categories);
    }

}
