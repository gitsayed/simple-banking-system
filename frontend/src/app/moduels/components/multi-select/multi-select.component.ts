import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'multi-select',
  standalone: false,
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent {


  @Input() roles: any[] = [];    
  @Input() label = 'Seelct';

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();

  searchCtrl = new FormControl('');
  selectCtrl = new FormControl([]);

 
  onKeyup(): void {
    this.selectCtrl.setValue([]);        
    this.selectionChange.emit([]);         
    this.searchChange.emit(this.searchCtrl.value || '');
  }


  onSelectionChange(): void {
    this.selectionChange.emit(this.selectCtrl.value? this.selectCtrl.value: []);
  }

}
