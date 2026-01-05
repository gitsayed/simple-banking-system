import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../../_services/toaster.service';
import { LoaderService } from '../../../_loader/loader.service';
import { UserService } from '../../../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleFormDialogComponent } from '../role-form-dialog/role-form-dialog.component';
import { RoleViewDialogComponent } from '../role-view-dialog/role-view-dialog.component';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {

  displayedColumns = ['id', 'name', "action"];
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

    this.loadRoles();
  }

  loadRoles(paramMap?: Map<string, any>): void {
    if (!paramMap) {
      paramMap = new Map<string, any>();
      paramMap.set("page", this.page);
      paramMap.set("size", this.size);
    }
    this.loader.show();
    this.userService.fetchPagedRoles(paramMap).subscribe({
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
    this.loadRoles();
  }

  onRowClick(row: any) {
    const dialogRef = this.dialog.open(RoleViewDialogComponent, {
      width: '50%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }


  openRoleAddDialog() {
    const dialogRef = this.dialog.open(RoleFormDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { action: "add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0;
        this.loadRoles();
      }
    });
  }



}

