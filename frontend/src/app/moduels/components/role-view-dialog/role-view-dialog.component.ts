import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role-view-dialog',
  standalone: false,
  templateUrl: './role-view-dialog.component.html',
  styleUrl: './role-view-dialog.component.scss'
})
export class RoleViewDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<RoleViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  close(): void {
    this.dialogRef.close();
  }

  
}
