export function formatPrice(value?: number) {
  if (!value) {
    return ''
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
