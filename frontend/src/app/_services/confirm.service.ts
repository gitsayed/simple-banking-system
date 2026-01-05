import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ConfirmDialogComponent } from "../moduels/components/confirm-dialog/confirm-dialog.component";

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) {}

  confirm(message: string, title = 'Confirm Action'): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        disableClose: true,
        data: { message, title }
      })
      .afterClosed();
  }
}
