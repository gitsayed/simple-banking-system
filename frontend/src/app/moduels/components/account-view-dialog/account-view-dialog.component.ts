import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../_services/customer.service';
import { IAccount, ICustomer } from '../../model/common-model';
import { LoaderService } from '../../../_loader/loader.service';
import { ToasterService } from '../../../_services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from '../../../_services/account.service';

@Component({
  selector: 'app-account-view-dialog',
  standalone: false,
  templateUrl: './account-view-dialog.component.html',
  styleUrl: './account-view-dialog.component.scss'
})
export class AccountViewDialogComponent implements OnInit {

  accountInfo: IAccount | null = null;

  constructor(
    public dialogRef: MatDialogRef<AccountViewDialogComponent>,
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
