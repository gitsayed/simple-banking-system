import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from '../../../_services/toaster.service';
import { AuthService } from '../../../_services/auth.service';
import { LoaderService } from '../../../_loader/loader.service';
import { UserInfo } from '../../model/common-model';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
  standalone: false
})
export class UserFormDialogComponent implements OnInit {

  userForm!: FormGroup;
  action = "add";
  userInfo: UserInfo | null = null;
  roleList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private authService: AuthService,
    private userService: UserService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data?.action) {
      this.action = data.action;
    }
    if (data && data?.action) {
      this.userInfo = data.userInfo;
    }


  }


  ngOnInit(): void {
    this.getRoleList();

    let roleIds: number[] = [];
    if (this.userInfo?.roles) {
      roleIds = this.userInfo.roles.map(item => item.id);
    }

    this.userForm = this.fb.group({
      username: [this.userInfo?.username, Validators.required],
      employeeId: [this.userInfo?.employeeId],
      password: ['', Validators.required],
      mobileNo: [this.userInfo?.mobileNo, [Validators.required]],
      email: [this.userInfo?.email, [Validators.required, Validators.email]],
      status: [this.userInfo?.status],
      dept: [this.userInfo?.dept],
      roleIds: [roleIds]

    });
  }

  getRoleList(name?: string): void {
    let paramMap = new Map<string, any>();
    if (name) {
      paramMap.set("name", name);
    }
    this.loader.show();
    this.userService.fetchRoleList(paramMap).subscribe({
      next: res => {
        this.loader.hide();
        this.roleList = res.map((item: any) => ({
          ...item,
          value: item.id,
          label: item.name
        }));
      }
    });
  }

  onRoleSearch(name: string) {
    this.getRoleList(name);
  }

  onRoleSelect(selected: any[]) {
    this.userForm.controls['roleIds'].setValue(selected);

  }

  submit(): void {
    if (this.userForm.valid) {
      let payload = this.userForm.value;
      if (this.action == "add") {
        this.authService.register(payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("User has been created successfully.");
            this.dialogRef.close("ok");
          },
          error: err => {
            this.loader.hide();
            this.toast.error(err.error.message);
          }
        });
      }

    }
  }

  close(): void {
    this.dialogRef.close();
  }


}
