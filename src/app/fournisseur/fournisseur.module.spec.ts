import { FournisseurModule } from './fournisseur.module';

describe('FournisseurModule', () => {
  let fournisseurModule: FournisseurModule;

  beforeEach(() => {
    fournisseurModule = new FournisseurModule();
  });

  it('should create an instance', () => {
    expect(fournisseurModule).toBeTruthy();
  });
});
