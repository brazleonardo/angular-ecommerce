import { MatPaginatorIntl } from '@angular/material/paginator'

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl()

  paginatorIntl.nextPageLabel = 'Próxima Página'
  paginatorIntl.previousPageLabel = 'Página Anterior'
  paginatorIntl.lastPageLabel = 'Última Página'
  paginatorIntl.firstPageLabel = 'Primeira Página'
  paginatorIntl.itemsPerPageLabel = 'Registros por Página'
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize
    return `${startIndex + 1} - ${endIndex} de ${length}`
  }

  return paginatorIntl
}
