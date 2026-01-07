import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../_services/toaster.service';
import { LoaderService } from '../../_loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountViewDialogComponent } from '../components/account-view-dialog/account-view-dialog.component';
import { AccountFormDialogComponent } from '../components/account-form-dialog/account-form-dialog.component';
import { AccountService } from '../../_services/account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../_services/confirm.service';

@Component({
  selector: 'app-account-management',
  standalone: false,
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss'
})
export class AccountManagementComponent implements OnInit {

  acSearchForm!: FormGroup;
  displayedColumns = ["id", "accountNumber", "accountType", "customerId", "customerName", "status", "balance", "action"];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private accountService: AccountService,
    private confirmService: ConfirmDialogService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.initAcSearchForm();
    this.loadAccounts();

  }



  loadAccounts(): void {
    let paramMap: Map<string, any> = this.getParamMap();
    this.loader.show();
    this.accountService.fetchPagedAccounts(paramMap).subscribe({
      next: res => {
        if (res) {
          this.loader.hide();
          this.dataSource.data = res.content;
          this.page = res.page.number;
          this.size = res.page.size;
          this.totalElements = res.page.totalElements;
          this.totalPages = res.page.totalPages;

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
    this.loadAccounts();
  }

  onRowClick(row: any) {
    const dialogRef = this.dialog.open(AccountViewDialogComponent, {
      width: '60%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }


  openCustomerAddDialog() {
    const dialogRef = this.dialog.open(AccountFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadAccounts();
      }
    });
  }



  openCustomerUpdateDialog(row: any) {

    const dialogRef = this.dialog.open(AccountFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "update", accountInfo: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadAccounts();
      }
    });
  }

  getParamMap(): Map<string, any> {
    let searchObject = this.acSearchForm.value ? this.acSearchForm.value : {};
    let paramMap = new Map<string, any>(
      Object.entries(searchObject).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
    paramMap.set("page", this.page);
    paramMap.set("size", this.size);
    return paramMap;
  }

  clearSearchForm() {
    this.acSearchForm.reset();
    this.acSearchForm.updateValueAndValidity();
    this.loadAccounts();
  }

  initAcSearchForm() {
    this.acSearchForm = this.fb.group({
      id:[''],
      accountNumber: [''],
      accountType: [''],
      status: [''],
      customerId: [''],
      customerName: [''],
    });
  }


}
