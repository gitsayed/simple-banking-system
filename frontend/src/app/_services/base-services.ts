import { HttpHeaders, HttpParams } from "@angular/common/http";






export class BaseService {

    headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    public mapToQueryString(map: Map<string, any>): string {
        if (!map || map.size === 0) {
            return '';
        }

        const query = Array.from(map.entries())
            .filter(([_, v]) => v !== null && v !== undefined)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');

        return query ? `?${query}` : '';
    }

    public create(a: string, b: string): string {

        return a + b;
    }
}

