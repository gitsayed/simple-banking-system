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
  selector: 'app-transfer-form-dialog',
  standalone: false,
  templateUrl: './transfer-form-dialog.component.html',
  styleUrl: './transfer-form-dialog.component.scss'
})
export class TransferFormDialogComponent implements OnInit {

  transferForm!: FormGroup;
  fromSubject = new Subject<string>();
  toSubject = new Subject<string>();

  fromAccountInfo: IAccount | null = null;
  toAccountInfo: IAccount | null = null;
  fromAccountList: IAccount[] | null = null;
  toAccountList: IAccount[] | null = null;


  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private confirmService: ConfirmDialogService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<TransferFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.initTransferForm();
    this.fromSubject
      .pipe(
        debounceTime(3000),
        distinctUntilChanged()
      )
      .subscribe(searchName => {
        this.fetchFromAccountListByNumber(searchName);
      });

    this.toSubject
      .pipe(
        debounceTime(3000),
        distinctUntilChanged()
      )
      .subscribe(searchName => {
        this.fetchToAccountListByNumber(searchName);
      });



  }

  initTransferForm() {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      transactionType: ["ACCOUNT_TRANSFER", Validators.required],
      transactionAmount: ['', Validators.required],
      remarks: [''],
    });
  }

  fetchFromAccountListByNumber(acNo: string) {
    this.loader.show();
    let searchMap = new Map();
    searchMap.set("accountNumber", acNo);
    this.accountService.fetchAccountList(searchMap).subscribe({
      next: res => {
        this.loader.hide();
        this.fromAccountList = res;
        if (this.toAccountInfo && this.fromAccountList && this.fromAccountList.length > 0) {
          this.fromAccountList = this.fromAccountList.filter((item: any) => item.accountNumber != this.toAccountInfo?.accountNumber);
        }
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    })
  }


  fetchToAccountListByNumber(acNo: string) {
    this.loader.show();
    let searchMap = new Map();
    searchMap.set("accountNumber", acNo);
    this.accountService.fetchAccountList(searchMap).subscribe({
      next: res => {
        this.loader.hide();
        this.toAccountList = res;

        if (this.fromAccountInfo && this.toAccountList && this.toAccountList.length > 0) {
          this.toAccountList = this.toAccountList.filter((item: any) => item.accountNumber != this.fromAccountInfo?.accountNumber);
        }

      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    });
  }



  confirm() {
    this.confirmService.confirm('Are you sure you want to proceed with FUND TRANSFER?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submit();
        }
      });
  }

  submit(): void {

    if (this.transferForm.valid) {

      let balance = Number(this.transferForm.value.fromAccount.balance);
      let dailyTrxLimit = Number(this.transferForm.value.fromAccount.dailyTransactionLimit);
      let trxAmount = Number(this.transferForm.value.transactionAmount);

      if (trxAmount > balance) {
        this.toast.error(`From Account Insufficient Balanne.`);
        return;
      }

      if (trxAmount > dailyTrxLimit) {
        this.toast.error(`Transaction Amount ${trxAmount} is larger than Daily Transaction Limit: ${dailyTrxLimit}`);
        return;
      }

      let payload: ISubmitTransaction = {
        transactionType: this.transferForm.value.transactionType,
        fromAccountNumber: this.transferForm.value.fromAccount.accountNumber,
        toAccountNumber: this.transferForm.value.toAccount.accountNumber,
        transactionAmount: this.transferForm.value.transactionAmount,
        remarks: this.transferForm.value.remarks
      }

      this.loader.show();
      this.transactionService.submitTransaction(payload).subscribe({
        next: res => {
          this.loader.hide();
          this.toast.success("FUND TRANSFER has been submitted successfully.");
          this.dialogRef.close("ok");
        },
        error: err => {
          this.loader.hide();
          this.toast.error(err.error.message);
        }
      });
    } else {
      this.toast.error("Form invalid");
    }


  }


  fromKeyup(event: any) {
    let searchName = event.target.value;
    searchName = searchName?.trim();
    this.fromSubject.next(searchName);
  }

  toKeyup(event: any) {
    let searchName = event.target.value;
    searchName = searchName?.trim();
    this.toSubject.next(searchName);
  }

  displayFromAccount(account: any): string {
    return account ? account.accountNumber : '';
  }

  displayToAccount(account: any): string {
    return account ? account.accountNumber : '';
  }

  onFromAccountSelected(event: any): void {
    this.fromAccountInfo = event.option.value;
  }

  onToAccountSelected(event: any): void {
    this.toAccountInfo = event.option.value;
  }

  get chechValidation(): boolean {

    if (this.fromAccountInfo == null) {
      return true;
    }

    if (this.toAccountInfo == null) {
      return true;
    }

    return this.transferForm.invalid;

  }

  close(): void {
    this.dialogRef.close();
  }


}

