import { Component } from '@angular/core';
import { LucideWarehouse, LucideUser, LucideLock, LucideLogIn, LucideEye } from '@lucide/angular';

@Component({
  selector: 'app-login.component',
  imports: [LucideWarehouse, LucideUser, LucideLock, LucideLogIn, LucideEye],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

}
