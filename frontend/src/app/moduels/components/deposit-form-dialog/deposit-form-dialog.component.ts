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
export class DepositFormDialogComponent implements OnInit {

  depositForm!: FormGroup;
  searchSubject = new Subject<string>();

  accountInfo: IAccount | null = {} as IAccount;
  accountList: IAccount[] | null = null;

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
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe(searchName => {
        this.fetchAccountListByNumber(searchName);
      });
    this.initDepositForm();

  }

  initDepositForm() {
    this.depositForm = this.fb.group({
      toAccount: ['', Validators.required],
      transactionType: ["DEPOSIT", Validators.required],
      transactionAmount: [null, Validators.required],
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
        if (res) {
          this.accountList = res;
        }
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

      let payload: ISubmitTransaction = {
        transactionType: this.depositForm.value.transactionType,
        toAccountNumber: this.depositForm.value.toAccount.accountNumber,
        transactionAmount: this.depositForm.value.transactionAmount,
        remarks: this.depositForm.value.remarks
      }

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


  close(): void {
    this.dialogRef.close();
  }


  get chechValidation(): boolean {

    if (this.accountInfo == null) {
      return true;
    }

    return this.depositForm.invalid;

  }


}
