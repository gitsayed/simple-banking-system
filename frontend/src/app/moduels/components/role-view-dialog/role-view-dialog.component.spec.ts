import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleViewDialogComponent } from './role-view-dialog.component';

describe('RoleViewDialogComponent', () => {
  let component: RoleViewDialogComponent;
  let fixture: ComponentFixture<RoleViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
