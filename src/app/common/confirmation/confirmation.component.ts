import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [],
  providers: [BsModalRef],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  bsModalRef = inject(BsModalRef);
  @Input() headingText: string = 'Warning';
  @Input() warningText: string = 'Are you sure you want to continue?';
  @Output() confirmed: EventEmitter<boolean> = new EventEmitter();

  closeModal() {
    this.bsModalRef.hide();
    this.confirmed.emit(false);
  }

  cancel(): void {
    this.confirmed.emit(false);
    this.bsModalRef.hide();
  }

  confirm(): void {
    this.confirmed.emit(true);
    this.bsModalRef.hide();
  }
}
