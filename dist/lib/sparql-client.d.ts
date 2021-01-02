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
import { IRI } from 'rdflib-ts';
interface RequestArgs {
    host: string;
    port?: number;
    path?: string;
}
/**
 * Data Bindings of a Query Result
 */
interface VariableBinding {
    varName: string;
    varValue: IRI;
}
interface QueryResultRow {
    rowNr: number;
    bindings: VariableBinding[];
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
    queryViaGet(query: string, defaultGraphUri?: string, namedGraphUri?: string, reqArgs?: RequestArgs): Observable<QueryResultRow[]>;
}
export {};
