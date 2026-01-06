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
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ITransactionDetail } from '../model/common-model';


@Component({
  selector: 'app-transaction-management',
  standalone: false,
  templateUrl: './transaction-management.component.html',
  styleUrl: './transaction-management.component.scss'
})
export class TransactionManagementComponent implements OnInit {

  displayedColumns = ["transactionId", "transactionDate", "referenceNumber", "transactionType", "fromAccountNumber", "toAccountNumber", "debitAmount", "creditAmount", "remarks", "action"];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  trxSearchForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {

    this.loadTransactions();
    this.initTrxSearchForm();
  }

  searchTrx() {
    let searchObject = this.trxSearchForm.value;

    let map = new Map<string, any>(
      Object.entries(searchObject).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
    let startDate = map.get("startDate");
    let endDate = map.get("endDate");
    if (startDate) {
      startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
      map.set("startDate", startDate);
    }

    if (endDate) {
      endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
      map.set("endDate", endDate);
    }

    this.loadTransactions(map);
  }


  searchDownload() {
    let searchObject = this.trxSearchForm.value;

    let map = new Map<string, any>(
      Object.entries(searchObject).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
    let startDate = map.get("startDate");
    let endDate = map.get("endDate");
    if (startDate) {
      startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
      map.set("startDate", startDate);
    }

    if (endDate) {
      endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
      map.set("endDate", endDate);
    }

    this.loadTransactionList(map);
  }





  clearSearchForm() {
    this.trxSearchForm.reset();
    this.trxSearchForm.updateValueAndValidity();
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


  loadTransactionList(paramMap?: Map<string, any>): void {
    if (!paramMap) {
      paramMap = new Map<string, any>();
    }
    this.loader.show();
    this.transactionService.fetchTransactionList(paramMap).subscribe({
      next: (response: any) => {
        this.loader.hide();
        if (response) {
          let responseString = JSON.stringify(response);
          // const blob = new Blob([responseString], { type: 'text/plain;charset=utf-8;' });
          // const url = window.URL.createObjectURL(blob);
          // const a = document.createElement('a');
          // a.href = url;
          // a.download = 'Account_Statement.txt';
          // a.click();
          // window.URL.revokeObjectURL(url);
          this.generatePdfFromList(response);

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
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadTransactions();
      }
    });
  }

  initTrxSearchForm() {
    this.trxSearchForm = this.fb.group({
      referenceNumber: [''],
      transactionType: [''],
      accountNumber: [''],
      startDate: [''],
      endDate: ['']

    });
  }

  generatePdfFromList(statementList: any[]) {


    const pdf = new jsPDF();


    pdf.setFontSize(18);
    pdf.text('Account Statement', 105, 20, { align: 'justify' });


    autoTable(pdf, {
      startY: 30,
      head: [['Transaction ID', 'Transaction Date', 'Reference Number', 'Transaction Type', 'From Account Number',
        'To Account Number', 'Debit Amount', 'Credit Amount', 'Remarks'
      ]],
      body: statementList.map(t => [
        t.transactionId,
        t.transactionDate,
        t.referenceNumber,
        t.transactionType,
        t.fromAccountNumber,
        t.toAccountNumber,
        t.debitAmount,
        t.creditAmount
      ]),
      styles: {
        fontSize: 11,
        cellPadding: 4
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0
      },
      didParseCell: function (data: any) {
        if (data.column.index === 6) {
          data.cell.styles.fillColor = [220, 255, 220]; 
        }
        if (data.column.index === 7) {
          data.cell.styles.fillColor = [255, 220, 220]; 
        }

        
      }

    });


    pdf.setFontSize(10);
    pdf.text(
      `Generated on ${new Date().toISOString().substring(0, 10)}`,
      105,
      285,
      { align: 'center' }
    );

    pdf.save('transaction-list.pdf');
  }


}
