import { Component, OnInit, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialogModule, MatDialogTitle, MatDialog } from '@angular/material/dialog'
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'

import { CategoryService } from '@@services/category.service'
import { FilterAdminService } from '@@services/filter-admin.service'

@Component({
  selector: 'app-modal-filter',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './modal-filter.component.html',
  styleUrl: './modal-filter.component.scss',
})
export class ModalFilterComponent implements OnInit {
  isLoading = signal(false)
  allCategories = signal<string[]>([])
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  private dialogModal = inject(MatDialog)
  private filterAdminService = inject(FilterAdminService)
  protected categoryService = inject(CategoryService)
  protected filterForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
    this.getCategories()
  }

  getQueryParam() {
    this.activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        const paramCategory = params.get('category')
        if (paramCategory) {
          this.filterForm.setValue({ category: paramCategory })
        }
      },
    })
  }

  getCategories() {
    this.categoryService.categories().subscribe({
      next: (result) => {
        this.allCategories.set(result)
        this.getQueryParam()
      },
    })
  }

  onClearFilter() {
    this.router.navigate([])

    this.dialogModal.closeAll()
    this.filterAdminService.setOpenModal = false
  }

  onSubmit() {
    if (this.filterForm.valid) {
      const queryParams = { category: this.filterForm.value.category }
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      })

      this.dialogModal.closeAll()
      this.filterAdminService.setOpenModal = false
    }
  }
}
