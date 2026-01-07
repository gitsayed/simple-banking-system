import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from '../../../_services/toaster.service';
import { AuthService } from '../../../_services/auth.service';
import { LoaderService } from '../../../_loader/loader.service';
import { UserInfo } from '../../model/common-model';
import { UserService } from '../../../_services/user.service';
import { ConfirmDialogService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
  standalone: false
})
export class UserFormDialogComponent implements OnInit {

  userUpdateForm!: FormGroup;
  userForm!: FormGroup;
  action = "add";
  userInfo: UserInfo | null = null;
  roleList: any[] = [];
  roleIds: any[] | null = null;
  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private authService: AuthService,
    private userService: UserService,
    private loader: LoaderService,
    private confirmService: ConfirmDialogService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data && this.data?.action) {
      this.action = this.data.action;
    }



  }


  ngOnInit(): void {
    this.getRoleList();
    this.initUserForm();
    if (this.data && this.data?.userInfo) {
      this.getUserById(this.data?.userInfo?.id);
    }
  }

  confirm() {
    this.confirmService.confirm('Are you sure you want to proceed with this operation?')
      .subscribe(confirmed => {
        if (confirmed) {
          if (this.action == "add") {
            this.submit();
          } else if (this.action == "update") {
            this.submitUpdate();
          }
        }
      });
  }

  initUserForm() {
    if (this.userInfo?.roles) {
      this.roleIds = this.userInfo.roles.map(item => item.id);
    }

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      employeeId: [''],
      password: ['', Validators.required],
      mobileNo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      status: [''],
      dept: [''],
      roleIds: ['']
    });

  }


  getUserById(id: number) {
    this.loader.show();
    this.userService.findUserById(id).subscribe({
      next: res => {
        this.loader.hide();
        this.userInfo = res;
        this.initUpdateUserForm();
      }
    });
  }



  initUpdateUserForm() {
    if (this.userInfo?.roles) {
      this.roleIds = this.userInfo.roles.map(item => item.id);
    }

    this.userUpdateForm = this.fb.group({
      username: [this.userInfo?.username, Validators.required],
      employeeId: [this.userInfo?.employeeId],
      password: ['',],
      mobileNo: [this.userInfo?.mobileNo, [Validators.required]],
      email: [this.userInfo?.email, [Validators.required, Validators.email]],
      status: [this.userInfo?.status],
      dept: [this.userInfo?.dept],
      roleIds: [this.roleIds]
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

    if (this.action === "add") {
      this.userForm.controls['roleIds'].setValue(selected);
    }
    if (this.action === "update") {
      this.userUpdateForm.controls['roleIds'].setValue(selected);
    }
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


  submitUpdate(): void {
    if (this.userUpdateForm.valid) {
      let payload = this.userUpdateForm.value;
      if (this.action == "update" && this.userInfo) {
        this.userService.updateUserById(this.userInfo.id, payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("User has been updated successfully.");
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
