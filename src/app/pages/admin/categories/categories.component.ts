import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { FilterAdminService } from '@@services/filter-admin.service'
import { AuthService } from '@@services/auth.service'
import { CategoryService } from '@@services/category.service'

@Component({
  standalone: true,
  imports: [AsyncPipe, MatTableModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export default class CategoriesComponent implements OnInit, OnDestroy {
  private filterAdminService = inject(FilterAdminService)
  private authService = inject(AuthService)
  private categoryService = inject(CategoryService)
  private activatedRoute = inject(ActivatedRoute)

  protected displayedColumns: string[] = ['pos', 'name']
  protected dataSource = new MatTableDataSource<string>([])

  protected categories$ = this.activatedRoute.queryParamMap.pipe(
    map((value) => {
      const search = value.get('search') ?? ''

      return this.categoryService.categories().subscribe({
        next: (response) => {
          if (search) {
            const searchResponse = response.filter(
              (item) => item.toLowerCase().indexOf(search.toLowerCase()) >= 0,
            )
            this.dataSource = new MatTableDataSource<string>(searchResponse)
            return
          }
          this.dataSource = new MatTableDataSource<string>(response)
        },
      })
    }),
  )

  ngOnInit(): void {
    this.filterAdminService.setHasFilter = {
      search: true,
      options: false,
    }
    this.getUser()
  }

  getUser() {
    this.authService.me().subscribe()
  }

  getCategories() {
    this.categoryService.categories().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<string>(response)
      },
    })
  }

  ngOnDestroy() {
    this.filterAdminService.setHasFilter = null
    this.filterAdminService.searchForm.setValue('')
  }
}
