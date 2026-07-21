import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  imports: [],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm {

  customerForm!: FormGroup;









  resetForm(){

  }

  setServerError(field: string, message: string){
    const control = this.customerForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message
    })

    control.markAllAsTouched()
  }
}
