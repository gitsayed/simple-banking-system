import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawFormDialogComponent } from './withdraw-form-dialog.component';

describe('WithdrawFormDialogComponent', () => {
  let component: WithdrawFormDialogComponent;
  let fixture: ComponentFixture<WithdrawFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
