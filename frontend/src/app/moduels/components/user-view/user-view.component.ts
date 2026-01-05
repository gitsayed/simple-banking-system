import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-view',
  standalone: false,
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent {


   constructor(
    public dialogRef: MatDialogRef<UserViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  close(): void {
    this.dialogRef.close();
  }
}
