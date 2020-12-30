/**
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 * SparQL Client Class
 *
 * @see based on:
 *      Example <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
 *      W3C-standard <https://www.w3.org/TR/sparql11-protocol/#query-operation>
 *
 */
import { Observable } from 'rxjs';
interface RequestArgs {
    host: string;
    port?: number;
    path?: string;
    nameSpaces?: {
        prefix: string;
        uri: string;
    }[];
}
export declare class SparqlClient {
    private defaultClientArgs?;
    /**
     * Sparql Client Constructor
     * @param clientArgs Default Sparql Client Parameters for all Requests
     */
    constructor(defaultClientArgs?: RequestArgs | undefined);
    /**
     * Query via GET @see <https://www.w3.org/TR/sparql11-protocol/#query-via-get>
     * @param query Sparql query
     * @param defaultGraphUri Default Graph Uri (optional)
     * @param namedGraphUri Named Graph Uri (optional)
     * @param reqArgs Endpoint server args (required of no default client args specified)
     */
    query(query: string, defaultGraphUri?: string, namedGraphUri?: string, reqArgs?: RequestArgs): Observable<any>;
}
export {};
