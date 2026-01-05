import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";


@Injectable({  providedIn: 'root'
})
export class ToasterService {
    
    constructor(private toastrService: ToastrService) {

    }

    success(message: string, title?: string) {
        this.toastrService.success(message, title, { positionClass: 'toast-top-right', progressAnimation: 'decreasing', progressBar: true, enableHtml: true, closeButton: true, timeOut: 5000 });
    }

    error(message: string, title?: string) {
        this.toastrService.error(message, title, { positionClass: 'toast-top-right', progressAnimation: 'decreasing', progressBar: true, enableHtml: true, closeButton: true, timeOut: 5000 });
    }

    info(message: string, title?: string) {
        this.toastrService.info(message, title, { positionClass: 'toast-top-right', progressAnimation: 'decreasing', progressBar: true, enableHtml: true, closeButton: true, timeOut: 5000 }  );
    }

    warning(message: string, title?: string) {
        this.toastrService.warning(message, title, { positionClass: 'toast-top-right', progressAnimation: 'decreasing', progressBar: true, enableHtml: true, closeButton: true, timeOut: 5000 });
    }   

}