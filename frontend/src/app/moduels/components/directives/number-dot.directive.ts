import { Directive, ElementRef, HostListener } from '@angular/core';
import { ToasterService } from '../../../_services/toaster.service';

@Directive({
    selector: '[appNumberDot]',
    standalone: false
})
export class NumberDotDirective {

    constructor(private toast: ToasterService,
        private el: ElementRef<HTMLInputElement>
    ) {

    }

    @HostListener('keyup')
    onKeyup(): void {
        const input = this.el.nativeElement;
        const originalValue = input.value;

        let cleanedValue = originalValue
            .replace(/[^0-9.]/g, '');


        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            cleanedValue = parts.shift() + '.' + parts.join('');
            this.toast.error(` Only one dot (.) is allowed`);
        }


        if (originalValue !== cleanedValue) {
            this.toast.error(`Invalid input: "${originalValue}"`);
            input.value = cleanedValue;
            input.dispatchEvent(new Event('input'));
        }

    }


    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
        const pasted = event.clipboardData?.getData('text') || '';

        if (!/^\d*\.?\d*$/.test(pasted)) {
            this.toast.error(`Invalid pasted value: "${pasted}"`);
            event.preventDefault();
        }
    }


}
