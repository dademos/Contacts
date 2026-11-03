import { Service, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmDialog, ConfirmOptions } from '../components/confirm-dialog/confirm-dialog';
import { DialogWidth } from '../models/dialog-width.enum';
import { If } from '../esm/util';

@Service()
export class NotificationService {
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  private showSnackBar(message: string, duration: number, panelClass?: string[]) {
    return this._snackBar.open(message, undefined, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    });
  }

  showSuccessBar(message: string, duration: number = 3000) {
    return this.showSnackBar(message, duration);
  }

  showErrorBar(message: string, duration: number = 7000) {
    return this.showSnackBar(message, duration, ['snackbar-error']);
  }

  confirm(options: ConfirmOptions): Observable<boolean> {
    const data = {
      title: 'Please confirm',
      message: 'Are you sure?',
      yesText: 'Yes',
      noText: 'No',
      ...options,
    };

    const dialogRef = this._dialog.open(ConfirmDialog, {
      maxWidth: DialogWidth.lg,
      data,
    });

    return dialogRef.afterClosed();
  }

  ifConfirmed(options: ConfirmOptions): Observable<boolean> {
    return If(this.confirm(options));
  }
}
