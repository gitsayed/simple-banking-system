import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../shared-modules/shared.module";
import { Router } from "@angular/router";

@Component({

  selector: 'default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  standalone: false
})
export class DefaultLayoutComponent implements OnInit {


  constructor(private router: Router) { }


  ngOnInit(): void {

  }

  goToProfile(): void {
  this.router.navigate(['/profile']);
}

  logout() {
    sessionStorage.clear();
    window.sessionStorage.clear();
    window.location.reload();
  }


}
