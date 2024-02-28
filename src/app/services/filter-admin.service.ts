import { Injectable, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { FormControl } from '@angular/forms'

import { FilterAdmin } from '@@models/filter-admin.models'

@Injectable({
  providedIn: 'root',
})
export class FilterAdminService {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  private hasFilter$ = new BehaviorSubject<FilterAdmin | null>(null)
  private openModal$ = new BehaviorSubject<boolean>(false)

  public searchForm = new FormControl<string>('')

  get getHasFilter() {
    return this.hasFilter$.asObservable()
  }

  set setHasFilter(value: FilterAdmin | null) {
    this.hasFilter$.next(value)
  }

  get getOpenModal() {
    return this.openModal$.asObservable()
  }

  set setOpenModal(value: boolean) {
    this.openModal$.next(value)
  }

  onSearch(value: string) {
    const queryParams = { search: value }
    if (value === '') {
      return this.router.navigate([])
    }
    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }
}
