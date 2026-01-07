import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../model/common-model';
import { ToasterService } from '../../../_services/toaster.service';
import { UserService } from '../../../_services/user.service';
import { LoaderService } from '../../../_loader/loader.service';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-role-form-dialog',
  standalone: false,
  templateUrl: './role-form-dialog.component.html',
  styleUrl: './role-form-dialog.component.scss'
})
export class RoleFormDialogComponent implements OnInit {

  roleForm!: FormGroup;
  action = "add";
  roleInfo: Role | null = null;

  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private userService: UserService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<RoleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmService: ConfirmDialogService
  ) {
    if (data && data?.action) {
      this.action = data.action;
    }
    if (data && data?.roleInfo) {
      this.roleForm = data.roleInfo;
    }


  }


  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: [this.roleInfo?.name, Validators.required],
    });
  }

  confirm() {
    this.confirmService.confirm('Are you sure you want to proceed with this operation?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submit();
        }
      });
  }



  submit(): void {
    if (this.roleForm.valid) {
      let payload = this.roleForm.value as Role;
      if (this.action == "add") {
        this.userService.createRole(payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("Role has been created successfully.");
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