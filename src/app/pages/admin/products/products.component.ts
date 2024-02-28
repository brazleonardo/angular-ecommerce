import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  signal,
  OnDestroy,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRoute, Router } from '@angular/router'
import { map, switchMap } from 'rxjs'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatRippleModule } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'

import { ModalFilterComponent } from './components/modal-filter/modal-filter.component'
import { ModalDetailsComponent } from './components/modal-details/modal-details.component'

import { formatPrice } from '@@helpers/price.helper'

import { FilterAdminService } from '@@services/filter-admin.service'
import { AuthService } from '@@services/auth.service'
import { ProductService } from '@@services/product.service'
import { Product, DataProducts } from '@@models/product.models'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ModalFilterComponent,
    ModalDetailsComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export default class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator

  private filterAdminService = inject(FilterAdminService)
  private authService = inject(AuthService)
  private productService = inject(ProductService)
  private dialogModal = inject(MatDialog)
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  protected pageEvent!: PageEvent
  protected displayedColumns: string[] = [
    'pos',
    'thumbnail',
    'title',
    'stock',
    'brand',
    'category',
    'price',
  ]
  protected dataSource = new MatTableDataSource<Product>([])
  protected pageSizeOptions = [5, 15, 25]

  protected pageLength = signal(0)
  protected pageIndex = signal(0)
  protected pageSize = signal(15)

  protected limit = signal(15)
  protected skip = signal(0)

  protected products$ = this.activatedRoute.queryParamMap.pipe(
    map((value) => {
      const limit = value.get('limit') ?? 15
      const skip = value.get('skip') ?? 0
      const search = value.get('search') ?? ''
      const category = value.get('category') ?? ''
      return { limit, skip, search, category }
    }),
    switchMap((params) => {
      if (params.search) {
        return this.productService
          .searchByProducts(params)
          .pipe(map((response) => this.getProducts(response)))
      }
      if (params.category) {
        return this.productService
          .productsByCategory(params)
          .pipe(map((response) => this.getProducts(response)))
      }

      return this.productService
        .products(params)
        .pipe(map((response) => this.getProducts(response)))
    }),
  )

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    this.filterAdminService.setHasFilter = {
      search: true,
      options: true,
    }
    this.getUser()
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const paramLimit = params.get('limit')
      const paramSkip = params.get('skip')
      if (paramLimit && this.pageSizeOptions.includes(Number(paramLimit))) {
        this.limit.set(Number(paramLimit))
        this.pageSize.set(Number(paramLimit))
      }
      if (paramSkip) {
        this.skip.set(Number(paramSkip))
      }
    })

    this.onWachModalFilter()
  }

  getUser() {
    this.authService.me().subscribe()
  }

  getProducts(response: DataProducts) {
    this.pageLength.set(response.total)
    this.pageIndex.set(response.skip / this.limit())
    this.skip.set(response.skip)
    this.dataSource = new MatTableDataSource<Product>(response.products)

    return response
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent = event
    this.pageLength.set(event.length)
    this.pageSize.set(event.pageSize)
    this.pageIndex.set(event.pageIndex)

    this.limit.set(event.pageSize)
    this.skip.set(event.pageIndex * event.pageSize)

    const queryParams = {
      limit: event.pageSize,
      skip: this.skip(),
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  onWachModalFilter() {
    this.filterAdminService.getOpenModal.subscribe((openModal) => {
      if (openModal) {
        const dialogRef = this.dialogModal.open(ModalFilterComponent, {
          position: { top: '80px' },
        })

        dialogRef.afterClosed().subscribe(() => {
          this.filterAdminService.setOpenModal = false
        })
      }
    })
  }

  onDetails(product?: Product) {
    const dialogRef = this.dialogModal.open(ModalDetailsComponent, {
      position: { top: '0', right: '0' },
      data: {
        title: product ? 'Editar Produto' : 'Adicionar Produto',
        product,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Modal Fechado: ${result}`)
    })
  }

  formatter(value: number) {
    return formatPrice(value)
  }

  ngOnDestroy() {
    this.filterAdminService.setHasFilter = null
    this.filterAdminService.searchForm.setValue('')
  }
}
