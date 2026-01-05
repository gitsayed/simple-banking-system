import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToasterService } from './_services/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {


   constructor(private toast: ToasterService) {
  
 
  }

  title = 'cbs-bank';
}
