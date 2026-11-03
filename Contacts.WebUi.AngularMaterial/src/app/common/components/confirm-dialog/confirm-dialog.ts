import { Component, inject } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  details?: string;
  yesText?: string;
  noText?: string;
  yesDanger?: boolean;
}

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'],
})
export class ConfirmDialog {
  protected options: ConfirmOptions = inject<ConfirmOptions>(MAT_DIALOG_DATA);
}
