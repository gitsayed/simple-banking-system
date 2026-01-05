import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../_services/toaster.service';
import { LoaderService } from '../../_loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormDialogComponent } from '../components/customer-form-dialog/customer-form-dialog.component';
import { CustomerViewDialogComponent } from '../components/customer-view-dialog/customer-view-dialog.component';
import { CustomerService } from '../../_services/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: false,
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {

  displayedColumns = ["id", "name", "mobileNo", "address", "action"];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private customerService: CustomerService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.loadCustomers();
  }

  loadCustomers(paramMap?: Map<string, any>): void {
    if (!paramMap) {
      paramMap = new Map<string, any>();
      paramMap.set("page", this.page);
      paramMap.set("size", this.size);
    }
    this.loader.show();
    this.customerService.fetchPagedCustomer(paramMap).subscribe({
      next: res => {
        if (res) {

          this.dataSource.data = res.content;
          this.page = res.page.number;
          this.size = res.page.size;
          this.totalElements = res.page.totalElements;
          this.totalPages = res.page.totalPages;
          this.loader.hide();
        }
      },

      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);

      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize
    this.loadCustomers();
  }

  onRowClick(row: any) {
    const dialogRef = this.dialog.open(CustomerViewDialogComponent, {
      width: '60%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }


  openCustomerAddDialog() {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadCustomers();
      }
    });
  }



  openCustomerUpdateDialog(row:any) {
    
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "update", customerInfo: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadCustomers();
      }
    });
  }




}
