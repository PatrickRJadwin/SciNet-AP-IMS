import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavmenuComponent } from './sidenavmenu.component';

describe('SidenavmenuComponent', () => {
  let component: SidenavmenuComponent;
  let fixture: ComponentFixture<SidenavmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
