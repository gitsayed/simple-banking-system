import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountViewDialogComponent } from './account-view-dialog.component';

describe('AccountViewDialogComponent', () => {
  let component: AccountViewDialogComponent;
  let fixture: ComponentFixture<AccountViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
