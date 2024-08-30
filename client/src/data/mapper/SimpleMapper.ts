export interface SimpleMapper<R, M> {
    map(response: R): M
}