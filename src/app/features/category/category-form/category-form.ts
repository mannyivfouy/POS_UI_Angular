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
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-category-form',
  imports: [LucideAngularModule, CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnChanges {
  @Input() categoryData: any = null;

  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  categoryForm!: FormGroup;
  isEditingMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(100)]],
      status: ['active', Validators.required],
    });

    this.loadCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryData'] && this.categoryForm) {
      this.loadCategory();
    }
  }

  loadCategory() {
    if (!this.categoryData) {
      this.isEditingMode = false;
      this.categoryForm.reset({
        status: 'active',
      });
      return;
    }

    this.isEditingMode = true;
    this.categoryForm.patchValue({
      name: this.categoryData.name,
      description: this.categoryData.description,
      status: this.categoryData.status,
    });
  }

  toggleStatus() {
    const currentStatus = this.categoryForm.get('status')?.value;

    this.categoryForm.patchValue({
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  }

  submit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.saved.emit(this.categoryForm.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  resetForm() {
    this.isEditingMode = false;

    this.categoryForm.reset({
      name: '',
      description: '',
      status: 'active',
    });
  }

  setServerError(field: string, message: string) {
    console.log('Server Error', field, message);
    const control = this.categoryForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message,
    });

    control.markAllAsTouched();
  }
}
