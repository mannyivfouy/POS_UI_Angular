import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-supplier-form',
  imports: [LucideAngularModule, CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm implements OnChanges {
  @Input() supplierData: any = null;

  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  icons = {
    X,
  };

  supplierForm!: FormGroup;
  isEditingMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      contactPerson: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      status: ['active', Validators.required],
      note: ['', [Validators.maxLength(100)]],
    });

    this.loadSupplier();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplierData'] && this.supplierForm) {
      this.loadSupplier();
    }
  }

  loadSupplier() {
    if (!this.supplierData) {
      this.isEditingMode = false;
      this.supplierForm.reset({
        status: 'active',
      });
      return;
    }

    this.isEditingMode = true;
    this.supplierForm.patchValue({
      name: this.supplierData.name,
      contactPerson: this.supplierData.contactPerson,
      phone: this.supplierData.phone,
      email: this.supplierData.email,
      address: this.supplierData.address,
      status: this.supplierData.status,
      note: this.supplierData.note,
    });
  }

  toggleStatus() {
    const currentStatus = this.supplierForm.get('status')?.value;

    this.supplierForm.patchValue({
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  }

  submit() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.saved.emit(this.supplierForm.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  resetForm() {
    this.isEditingMode = false;

    this.supplierForm.reset({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      status: 'active',
      note: '',
    });
  }

  setServerError(field: string, message: string){
    const control = this.supplierForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message
    })

    control.markAllAsTouched()
  }
}
