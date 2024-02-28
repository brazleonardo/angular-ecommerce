import { Component, Inject, OnInit, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle } from '@angular/material/dialog'
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms'

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'

import { formatPrice } from '@@helpers/price.helper'

import { CategoryService } from '@@services/category.service'
import { Product } from '@@models/product.models'

export interface DialogData {
  title: string
  product?: Product
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgxMaskDirective,
    MatDialogModule,
    MatDialogTitle,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './modal-details.component.html',
  styleUrl: './modal-details.component.scss',
})
export class ModalDetailsComponent implements OnInit {
  isLoading = signal(false)
  allCategories = signal<string[]>([])
  protected categoryService = inject(CategoryService)
  protected productForm!: FormGroup

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.productForm = new FormGroup({
      title: new FormControl(data?.product?.title ?? '', [Validators.required]),
      description: new FormControl(data?.product?.description ?? '', [Validators.required]),
      brand: new FormControl(data?.product?.brand ?? '', [Validators.required]),
      category: new FormControl(data?.product?.category ?? '', [Validators.required]),
      price: new FormControl(formatPrice(data?.product?.price), [Validators.required]),
      discountPercentage: new FormControl(data?.product?.discountPercentage ?? '', [
        Validators.required,
      ]),
      rating: new FormControl(data?.product?.rating ?? '', [Validators.required]),
      stock: new FormControl(data?.product?.stock ?? '', [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.getCategories()
  }

  getCategories() {
    this.categoryService.categories().subscribe({
      next: (result) => {
        this.allCategories.set(result)
      },
    })
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading.set(true)
      console.log(this.productForm.value)

      setTimeout(() => {
        this.isLoading.set(false)
      }, 1000)
    }
  }
}
