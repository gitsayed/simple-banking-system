import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'multi-select',
  standalone: false,
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent implements OnChanges, OnInit {


  @Input() selectedList: any[] | null = null;
  @Input() dataList: any[] = [];
  @Input() label = 'Select';

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();

  searchCtrl = new FormControl('');
  selectCtrl = new FormControl([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedList']?.currentValue) {
      this.selectCtrl.setValue(changes['selectedList'].currentValue);
      this.onSelectionChange();
    }

  }

  ngOnInit(): void {

  }




  onKeyup(): void {
    this.selectCtrl.setValue([]);
    this.selectionChange.emit([]);
    this.searchChange.emit(this.searchCtrl.value || '');
  }


  onSelectionChange(): void {
    this.selectionChange.emit(this.selectCtrl.value ? this.selectCtrl.value : []);
  }

}
