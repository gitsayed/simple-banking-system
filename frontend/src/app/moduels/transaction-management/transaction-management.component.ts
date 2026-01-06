import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../_services/toaster.service';
import { LoaderService } from '../../_loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../../_services/transaction.service';
import { DepositFormDialogComponent } from '../components/deposit-form-dialog/deposit-form-dialog.component';
import { WithdrawFormDialogComponent } from '../components/withdraw-form-dialog/withdraw-form-dialog.component';
import { TransferFormDialogComponent } from '../components/transfer-form-dialog/transfer-form-dialog.component';
import { TransactionViewDialogComponent } from '../components/transaction-view-dialog/transaction-view-dialog.component';


@Component({
  selector: 'app-transaction-management',
  standalone: false,
  templateUrl: './transaction-management.component.html',
  styleUrl: './transaction-management.component.scss'
})
export class TransactionManagementComponent implements OnInit {

  displayedColumns = ["transactionId", "transactionDate", "referenceNumber", "transactionType", "fromAccountNumber", "toAccountNumber", "debitAmount", "creditAmount",  "remarks", "action"];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.loadTransactions();
  }

  loadTransactions(paramMap?: Map<string, any>): void {
    if (!paramMap) {
      paramMap = new Map<string, any>();
      paramMap.set("page", this.page);
      paramMap.set("size", this.size);
    }
    this.loader.show();
    this.transactionService.fetchPagedTransactions(paramMap).subscribe({
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
    this.loadTransactions();
  }

  onRowClick(row: any) {
    const dialogRef = this.dialog.open(TransactionViewDialogComponent, {
      width: '60%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }


  openDepositDialog() {

    const dialogRef = this.dialog.open(DepositFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadTransactions();
      }
    });
  }

  openWithdrawalDialog() {
    const dialogRef = this.dialog.open(WithdrawFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadTransactions();
      }
    });
  }

  openFundTransferDialog() {
    const dialogRef = this.dialog.open(TransferFormDialogComponent, {
      width: '65%',
      disableClose: true,
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadTransactions();
      }
    });
  }




}
