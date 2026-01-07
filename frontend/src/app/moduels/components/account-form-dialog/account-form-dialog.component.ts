import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAccount, IAccountUpdate, ICustomer } from '../../model/common-model';
import { ToasterService } from '../../../_services/toaster.service';
import { LoaderService } from '../../../_loader/loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { AccountService } from '../../../_services/account.service';
import { CustomerService } from '../../../_services/customer.service';
import { map, startWith } from 'rxjs';
import { ConfirmDialogService } from '../../../_services/confirm.service';

@Component({
  selector: 'app-account-form-dialog',
  standalone: false,
  templateUrl: './account-form-dialog.component.html',
  styleUrl: './account-form-dialog.component.scss'
})
export class AccountFormDialogComponent {

  accountForm!: FormGroup;
  accountUpdateForm!: FormGroup;
  action = "add";
  accountInfo: IAccount | null = {} as IAccount;
  customerList: ICustomer[] | null = [];



  constructor(
    private fb: FormBuilder,
    private toast: ToasterService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private confirmService: ConfirmDialogService,
    private loader: LoaderService,
    private dialogRef: MatDialogRef<AccountFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data?.action) {
      this.action = data.action;
    }
    if (data && data?.accountInfo) {
      this.accountInfo = data.accountInfo;
    }
  }

  ngOnInit(): void {
    this.getCustomerList(null);
    this.initAccountUpdateForm()
    if (this.action == 'add') {
      this.initAccountForm();
    }

    if (this.action == 'update' && this.accountInfo?.id) {
      this.getAccountById(this.accountInfo?.id);
    }


  }

    confirmSave() {
    this.confirmService.confirm('Are you sure you want to proceed with this operation?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submit();
        }
      });
  }

  confirmUpdate() {
    this.confirmService.confirm('Are you sure you want to proceed with this operation?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.submitUpdate();
        }
      });
  }

  initAccountForm() {
    this.accountForm = this.fb.group({
      customer: [this.accountInfo?.customer, Validators.required],
      accountType: [this.accountInfo?.accountType, Validators.required],
      status: [this.accountInfo?.status, Validators.required],
      dailyTransactionLimit: [this.accountInfo?.dailyTransactionLimit, Validators.required],
      balance: [this.accountInfo?.balance, Validators.required]

    });
  }

  initAccountUpdateForm() {
    this.accountUpdateForm = this.fb.group({
      customer: [{ value: this.accountInfo?.customer?.name, disabled: true }],
      accountNumber: [{ value: this.accountInfo?.accountNumber, disabled: true }],
      balance: [{ value: this.accountInfo?.balance, disabled: true }],
      accountType: [this.accountInfo?.accountType, Validators.required],
      status: [this.accountInfo?.status, Validators.required],
      dailyTransactionLimit: [this.accountInfo?.dailyTransactionLimit, Validators.required],
    });

  }

  getAccountById(id: number) {
    this.loader.show();
    this.accountService.findAccountById(id).subscribe({
      next: res => {
        this.loader.hide();
        this.accountInfo = res;
        this.initAccountUpdateForm();
      },
      error: err => {
        this.loader.hide();
        this.toast.error(err.error.message);
      }
    })
  }

  submit(): void {
    if (this.action == "add") {
      if (this.accountForm.valid) {
        let formValue = this.accountForm.value;
        let payload: IAccount = {
          id: null,
          customerId: formValue?.customer?.id,
          accountType: formValue.accountType,
          status: formValue?.status,
          dailyTransactionLimit: formValue.dailyTransactionLimit,
          balance: formValue.balance
        };


        this.accountService.createAccount(payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("Account has been created successfully.");
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

  submitUpdate() {

    if (this.accountUpdateForm.valid) {
      let formValue = this.accountUpdateForm.value;
      let payload: IAccountUpdate = {
        accountType: formValue.accountType,
        status: formValue?.status,
        dailyTransactionLimit: formValue.dailyTransactionLimit,
      };


      if (this.action == "update" && this.accountInfo?.id) {
        this.accountService.updateAccount(this.accountInfo.id, payload).subscribe({
          next: res => {
            this.loader.hide();
            this.toast.success("Account has been updated successfully.");
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

  onKeyup(event: any) {
    let searchName = event.target.value;
    searchName = searchName?.trim();
    this.getCustomerList(searchName);
  }



  getCustomerList(name: string | null) {
    let paramMap = new Map<string, any>();
    if (name) {
      paramMap.set("name", name);
    }
    this.loader.show();
    this.customerService.fetchCustomerList(paramMap).subscribe({
      next: res => {
        this.loader.hide();
        this.customerList = res.map((item: any) => ({
          ...item,
          value: item.id,
          label: item.name
        }));
      }
    });
  }


  displayCustomer(customer: any): string {
    return customer ? customer.name : '';
  }


  close(): void {
    this.dialogRef.close();
  }

  
}
