import { Component, Inject, OnInit } from '@angular/core';
import { IAccount } from '../../model/common-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../_services/account.service';
import { LoaderService } from '../../../_loader/loader.service';
import { ToasterService } from '../../../_services/toaster.service';

@Component({
  selector: 'app-transaction-view-dialog',
  standalone: false,
  templateUrl: './transaction-view-dialog.component.html',
  styleUrl: './transaction-view-dialog.component.scss'
})
export class TransactionViewDialogComponent implements OnInit {

  accountInfo: IAccount | null = null;

  constructor(
    public dialogRef: MatDialogRef<TransactionViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    private loader: LoaderService,
    private toast: ToasterService
  ) {

  }
  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getAccountById(this.data.id);
    }

  }


  getAccountById(id: number) {
    this.loader.show();
    this.accountService.findAccountById(id).subscribe({
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


  close(): void {
    this.dialogRef.close();
  }




}
