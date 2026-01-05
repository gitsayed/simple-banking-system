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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private toast: ToasterService,
    private loader: LoaderService,
    private userService: UserService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.loadUsers();
  }

  loadUsers(paramMap?: Map<string, any>): void {
    if (!paramMap) {
      paramMap = new Map<string, any>();
      paramMap.set("page", this.page);
      paramMap.set("size", this.size);
    }
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


}
