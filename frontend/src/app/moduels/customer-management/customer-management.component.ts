import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../_services/toaster.service';
import { LoaderService } from '../../_loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormDialogComponent } from '../components/customer-form-dialog/customer-form-dialog.component';
import { CustomerViewDialogComponent } from '../components/customer-view-dialog/customer-view-dialog.component';
import { CustomerService } from '../../_services/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-management',
  standalone: false,
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {

  displayedColumns = ["id", "name", "mobileNo", "address", "nid", "action"];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  searchForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadCustomers();
  }

  loadCustomers(): void {
    let paramMap: Map<string, any> = this.getParamMap();
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



  openCustomerUpdateDialog(row: any) {

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

  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [''],
      name: [''],
      mobileNo: [''],
      address: [''],
      nid: ['']
    });
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.searchForm.updateValueAndValidity();
    this.loadCustomers();
  }

  getParamMap(): Map<string, any> {
    let searchObject = this.searchForm.value ? this.searchForm.value : {};
    let paramMap = new Map<string, any>(
      Object.entries(searchObject).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    paramMap.set("page", this.page);
    paramMap.set("size", this.size);
    return paramMap;
  }

}
