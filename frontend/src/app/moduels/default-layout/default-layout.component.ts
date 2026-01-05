import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../shared-modules/shared.module";

@Component({

  selector: 'default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  standalone: false
})
export class DefaultLayoutComponent implements OnInit {

  
  ngOnInit(): void {

  }

  logout(){
    sessionStorage.clear();
  window.sessionStorage.clear();
   window.location.reload();
  }


}
