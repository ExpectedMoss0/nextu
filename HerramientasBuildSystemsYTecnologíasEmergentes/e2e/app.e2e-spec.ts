import { ProyectoAngularjsPage } from './app.po';

describe('proyecto-angularjs App', function() {
  let page: ProyectoAngularjsPage;

  beforeEach(() => {
    page = new ProyectoAngularjsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
