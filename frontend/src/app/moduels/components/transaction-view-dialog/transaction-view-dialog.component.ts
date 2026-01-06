import { Component, Inject, OnInit } from '@angular/core';
import { IAccount, ITransactionDetail } from '../../model/common-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../_services/account.service';
import { LoaderService } from '../../../_loader/loader.service';
import { ToasterService } from '../../../_services/toaster.service';
import { TransactionService } from '../../../_services/transaction.service';

@Component({
  selector: 'app-transaction-view-dialog',
  standalone: false,
  templateUrl: './transaction-view-dialog.component.html',
  styleUrl: './transaction-view-dialog.component.scss'
})
export class TransactionViewDialogComponent implements OnInit {

  transactionInfo: ITransactionDetail | null = null;

  constructor(
    public dialogRef: MatDialogRef<TransactionViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService,
    private loader: LoaderService,
    private toast: ToasterService
  ) {

  }
  ngOnInit(): void {
    if (this.data && this.data.transactionId) {
      this.findTransactionById(this.data.transactionId);
    }

  }


  findTransactionById(id: number) {
    this.loader.show();
    this.transactionService.findTransactionById(id).subscribe({
      next: res => {
        this.loader.hide();
        this.transactionInfo = res as ITransactionDetail;
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
