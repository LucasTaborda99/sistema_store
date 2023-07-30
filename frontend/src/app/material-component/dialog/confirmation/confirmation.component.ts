import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  emitirMudancaStatus = new EventEmitter()
  details: any = {}
  onEmitMudancaStatus: any;
  onEmitStatusChange: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    if(this.dialogData) {
      this.details = this.dialogData
    }
  }

  gerenciaAcaoMudanca() {
    this.emitirMudancaStatus.emit()
  }

}
