import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserInfo } from '../model/common-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserViewComponent } from '../components/user-view/user-view.component';
import { LoaderService } from '../../_loader/loader.service';
import { ToasterService } from '../../_services/toaster.service';
import { UserFormDialogComponent } from '../components/user-form-dialog/user-form-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  displayedColumns = ['id', 'username', 'email', 'mobileNo', 'status', "dept", "action"];
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
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadUsers();
  }

  loadUsers(): void {
    let paramMap: Map<string, any> = this.getParamMap();
 
    this.loader.show();
    this.userService.fetchPagedUser(paramMap).subscribe({
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
    this.loadUsers();
  }

  onRowClick(row: any) {
    this.loader.show();
    this.userService.findUserById(row.id).subscribe({
      next: res => {
        this.loader.hide();
        if (res) {
          const dialogRef = this.dialog.open(UserViewComponent, {
            width: '50%',
            data: res
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
          });
        }
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    });
  }


  openUserAddDialog() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: {action:"add"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadUsers();
      }
    });
  }


  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [''],
      username: [''],
      email: [''],
      mobileNo: [''],
      status: [''],
      dept: ['']
    });
  }

  clearSearchForm() {
    this.searchForm.reset();
    this.searchForm.updateValueAndValidity();
    this.loadUsers();
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
