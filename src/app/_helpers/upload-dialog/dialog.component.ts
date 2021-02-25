import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from './../../_services/upload.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  @ViewChild('file') file;

  public files: Set<File> = new Set();
  private whiteList: Array<string> = ['csv'];
  private uploadtext: string = 'Please upload a CSV file';
  progress;
  canBeClosed = false;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  disabledAddButton = false;

  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadService: UploadService,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    if (this.data.whiteList) this.whiteList = this.data.whiteList;
    if (this.data.uploadtext) this.uploadtext = this.data.uploadtext;
  }



  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        if (this.whiteList.indexOf(files[key].name.split('.').pop()) === -1) {
          this.toastr.warning('Invalid file. ' + this.uploadtext, 'Warning!', { timeOut: 2000 });
        } else {
          this.files.add(files[key]);
          this.canBeClosed = true;
        }
      }
    }
    this.disabledAddButton = this.files.size >= 1;
    this.file.nativeElement.value = "";
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  clearFiles() {
    this.files = new Set();
    this.disabledAddButton = false;
    this.canBeClosed = false;
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files, this.data.url);
    console.log(this.progress);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));
      this.progress[key].result.subscribe(val => console.log(val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].result);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    //this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe((end: Array<any>)  => {




      if (end[0].Success) {
        return this.dialogRef.close(end[0].Message);;
      }
      this.toastr.error(end[0].Message, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });




      // ... the dialog can be closed again...
      //this.canBeClosed = false;
      this.dialogRef.disableClose = false;
      this.showCancelButton = true;
      this.clearFiles();

      // ... the upload was successful...
      //this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
