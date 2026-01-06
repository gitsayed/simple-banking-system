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
  selector: 'app-withdraw-form-dialog',
  standalone: false,
  templateUrl: './withdraw-form-dialog.component.html',
  styleUrl: './withdraw-form-dialog.component.scss'
})
export class WithdrawFormDialogComponent implements OnInit {

  withdrawForm!: FormGroup;
  searchSubject = new Subject<string>();

  accountInfo: IAccount | null = null;
  accountList: IAccount[] | null = null;

  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private confirmService: ConfirmDialogService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<WithdrawFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
this.accountInfo == null;
  }

  ngOnInit(): void {
    
    this.searchSubject
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe(searchName => {
        this.fetchAccountListByNumber(searchName);
      });
    this.initWithdrawForm();

  }

  initWithdrawForm() {
    this.withdrawForm = this.fb.group({
      fromAccount: ['', Validators.required],
      transactionType: ["WITHDRAWAL", Validators.required],
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
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    })
  }


  fetchAccountListByNumber(acNo: string) {
    this.loader.show();
    let searchMap = new Map();
    searchMap.set("accountNumber", acNo);
    this.accountService.fetchAccountList(searchMap).subscribe({
      next: res => {
        this.loader.hide();
        this.accountList = res;
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    })
  }

  confirm() {
    this.confirmService.confirm('Are you sure you want to proceed with WITHDRAWAL?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submit();
        }
      });
  }

  submit(): void {

    if (this.withdrawForm.valid) {


      let balance = Number(this.withdrawForm.value.fromAccount.balance);
      let dailyTrxLimit = Number(this.withdrawForm.value.fromAccount.dailyTransactionLimit);
      let trxAmount = Number(this.withdrawForm.value.transactionAmount);

      if (trxAmount > balance) {
        this.toast.error(`Transaction Amount ${trxAmount} is larger than Current Balance: ${balance}`);
        return;
      }

      if (trxAmount > dailyTrxLimit) {
        this.toast.error(`Transaction Amount ${trxAmount} is larger than Daily Transaction Limit: ${dailyTrxLimit}`);
        return;
      }

      let payload: ISubmitTransaction = {
        transactionType: this.withdrawForm.value.transactionType,
        fromAccountNumber: this.withdrawForm.value.fromAccount.accountNumber,
        transactionAmount: this.withdrawForm.value.transactionAmount,
        remarks: this.withdrawForm.value.remarks
      }

      this.loader.show();
      this.transactionService.submitTransaction(payload).subscribe({
        next: res => {
          this.loader.hide();
          this.toast.success("WITHDRAWAL has been submitted successfully.");
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
    this.accountInfo = null;
    let searchName = event.target.value;
    searchName = searchName?.trim();
    this.searchSubject.next(searchName);
  }

  onAccountSelected(event: any): void {
    this.accountInfo = event.option.value;
  }


  displayAccount(account: any): string {
    return account ? account.accountNumber : '';
  }

  get chechValidation(): boolean {

    if (this.accountInfo == null) {
      return true;
    }

    return this.withdrawForm.invalid;

  }


  close(): void {
    this.dialogRef.close();
  }



}
