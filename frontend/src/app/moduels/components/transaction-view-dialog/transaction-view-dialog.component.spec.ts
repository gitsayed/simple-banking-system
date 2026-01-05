import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionViewDialogComponent } from './transaction-view-dialog.component';

describe('TransactionViewDialogComponent', () => {
  let component: TransactionViewDialogComponent;
  let fixture: ComponentFixture<TransactionViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
