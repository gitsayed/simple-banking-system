import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../_services/customer.service';
import { ICustomer } from '../../model/common-model';
import { LoaderService } from '../../../_loader/loader.service';
import { ToasterService } from '../../../_services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-view-dialog',
  standalone: false,
  templateUrl: './customer-view-dialog.component.html',
  styleUrl: './customer-view-dialog.component.scss'
})
export class CustomerViewDialogComponent implements OnInit {

  displayedColumns: string[] = ['accountNumber', 'accountType', 'status', 'balance'];
  dataSource = new MatTableDataSource<any>([]);
  customerInfo: ICustomer | null = null;

  constructor(
    public dialogRef: MatDialogRef<CustomerViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    private loader: LoaderService,
    private toast: ToasterService
  ) {

  }
  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getCustomerInfoById(this.data.id);
    }

  }


  getCustomerInfoById(id: number) {
    this.loader.show();
    this.customerService.findCustomerById(id).subscribe({
      next: res => {
        this.loader.hide();
        if (res) {
          this.customerInfo = res as ICustomer;
          if (this.customerInfo.accounts && this.customerInfo.accounts.length > 0) {
            this.dataSource.data = this.customerInfo.accounts;
          }
        }
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    });
  }


  close(): void {
    this.dialogRef.close();
  }



}
