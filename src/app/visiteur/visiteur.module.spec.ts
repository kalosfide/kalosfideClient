import { VisiteurModule } from './visiteur.module';

describe('VisiteurModule', () => {
  let visiteurModule: VisiteurModule;

  beforeEach(() => {
    visiteurModule = new VisiteurModule();
  });

  it('should create an instance', () => {
    expect(visiteurModule).toBeTruthy();
  });
});
