import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositFormDialogComponent } from './deposit-form-dialog.component';

describe('AccountFormDialogComponent', () => {
  let component: DepositFormDialogComponent;
  let fixture: ComponentFixture<DepositFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
