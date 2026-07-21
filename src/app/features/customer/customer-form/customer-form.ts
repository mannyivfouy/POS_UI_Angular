import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm implements OnChanges {
  @Input() customerData: any = null;

  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  customerForm!: FormGroup;
  isEditingMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerData'] && this.customerForm) {
      this.loadCustomer();
    }
  }

  loadCustomer() {
    if (!this.customerData) {
      this.isEditingMode = false;
      this.customerForm.reset();
      return;
    }

    this.isEditingMode = true;
    this.customerForm.patchValue({
      name: this.customerData.name,
      phone: this.customerData.phone,
    });
  }

  submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.saved.emit(this.customerForm.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  resetForm() {
    this.isEditingMode = false;

    this.customerForm.reset({
      name: '',
      phone: '',
    });
  }

  setServerError(field: string, message: string) {
    const control = this.customerForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message,
    });

    control.markAllAsTouched();
  }
}
