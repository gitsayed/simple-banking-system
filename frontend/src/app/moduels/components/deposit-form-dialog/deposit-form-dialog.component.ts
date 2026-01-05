import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAccount, ISubmitTransaction } from '../../model/common-model';
import { ToasterService } from '../../../_services/toaster.service';
import { LoaderService } from '../../../_loader/loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../_services/account.service';
import { TransactionService } from '../../../_services/transaction.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ConfirmDialogService } from '../../../_services/confirm.service';


@Component({
  selector: 'app-deposit-form-dialog',
  standalone: false,
  templateUrl: './deposit-form-dialog.component.html',
  styleUrl: './deposit-form-dialog.component.scss'
})
export class DepositFormDialogComponent implements OnInit{

  depositForm!: FormGroup;
  searchSubject = new Subject<string>();

  accountInfo: IAccount | null = {} as IAccount;


  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private confirmService: ConfirmDialogService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<DepositFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(3000),
        distinctUntilChanged()
      )
      .subscribe(searchName => {
        this.getAccountByNumber(searchName);
      });
    this.initDepositForm();

  }

  initDepositForm() {
    this.depositForm = this.fb.group({
      toAccountNumber: ['', Validators.required],
      transactionType: ["DEPOSIT", Validators.required],
      transactionAmount: ['', Validators.required],
      remarks: [''],
    });
  }



  getAccountByNumber(acNo: string) {
    this.loader.show();
    this.accountService.findAccountByNumber(acNo).subscribe({
      next: res => {
        this.loader.hide();
        this.accountInfo = res;
        console.log(' this.accountInfo', this.accountInfo);

      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    })
  }

  confirm() {
    this.confirmService.confirm('Are you sure you want to proceed with DEPOSIT?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submit();
        }
      });
  }

  submit(): void {

    if (this.depositForm.valid) {
      let payload = this.depositForm.value as ISubmitTransaction;
      this.loader.show();
      this.transactionService.submitTransaction(payload).subscribe({
        next: res => {
          this.loader.hide();
          this.toast.success("Deposit has been submitted successfully.");
          this.dialogRef.close("ok");
        },
        error: err => {
          this.loader.hide();
          this.toast.error(err.error.message);
        }
      });
    }


  }


  onKeyup(event: any) {
    let searchName = event.target.value;
    searchName = searchName?.trim();
    this.searchSubject.next(searchName);
  }




  close(): void {
    this.dialogRef.close();
  }


}
