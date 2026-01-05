import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICustomer, Role } from '../../model/common-model';
import { ToasterService } from '../../../_services/toaster.service';
import { UserService } from '../../../_services/user.service';
import { LoaderService } from '../../../_loader/loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { CustomerService } from '../../../_services/customer.service';

@Component({
  selector: 'app-customer-form-dialog',
  standalone: false,
  templateUrl: './customer-form-dialog.component.html',
  styleUrl: './customer-form-dialog.component.scss'
})
export class CustomerFormDialogComponent {

  customerForm!: FormGroup;
  action = "add";
  customerInfo: ICustomer | null = {} as ICustomer;

  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private customerService: CustomerService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data?.action) {
      this.action = data.action;
    }
    if (data && data?.customerInfo) {
      this.customerInfo = data.customerInfo;
    }
  }

    ngOnInit(): void {

    this.customerForm = this.fb.group({
      name: [this.customerInfo?.name, Validators.required],
      gender: [this.customerInfo?.gender, Validators.required],
      address: [this.customerInfo?.address, Validators.required],
      mobileNo: [this.customerInfo?.mobileNo, Validators.required],
      nid: [this.customerInfo?.nid, Validators.required],
    

    });
  }

  submit(): void {
    if (this.customerForm.valid) {
      let payload = this.customerForm.value as ICustomer;
      if (this.action == "add") {
        this.customerService.createCustomer(payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("Customer has been created successfully.");
            this.dialogRef.close("ok");
          },
          error: err => {
            this.loader.hide();
            this.toast.error(err.error.message);
          }
        });
      } else if (this.action == "update" && this.customerInfo?.id) {
        this.customerService.updateCustomer( this.customerInfo.id, payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("Customer has been updated successfully.");
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
