export class UrlFormatter {
    format(url: string, params: Map<string, string>) {
        if (params.size > 0) {
            url = url + "?"
            params.forEach((value, key) =>
                url = url + key + "=" + value
            )
        }
        return url
    }
}