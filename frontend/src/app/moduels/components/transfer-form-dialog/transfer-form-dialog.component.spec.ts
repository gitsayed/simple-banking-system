import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFormDialogComponent } from './transfer-form-dialog.component';

describe('TransferFormDialogComponent', () => {
  let component: TransferFormDialogComponent;
  let fixture: ComponentFixture<TransferFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
