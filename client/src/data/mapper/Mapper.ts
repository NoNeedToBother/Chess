export interface Mapper<R, M> {
    map(response: R): M
}