import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppLoginPage } from './app-login.page';

describe('AppLoginPage', () => {
  let component: AppLoginPage;
  let fixture: ComponentFixture<AppLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
