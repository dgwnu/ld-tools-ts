/**
 *
 * @author Onno Haldar <onno@plan-k.nl>
 *
 * NodeJs SparQL Class (also working within node-ts)
 * 
 * @see based on <https://github.com/ncbo/sparql-code-examples/blob/master/javascript/node_test.js>
 *
 */

import { ClientRequest, ClientRequestArgs } from 'http';
import { Observable } from 'rxjs';

interface RequestArgs {
    host: string;
    port?: number;
    path?: string; 
    nameSpaces?: {
        prefix: string;
        uri: string;
    }[];
};

interface RequestResp {
    rowNr: number;
    values: {
        varName: string;
        varUri: string;
    }[];
};

export class SparqlClient {

    constructor(private clientArgs?: RequestArgs) {

    }

    getRequest(queryStatements: string[], reqArgs?: RequestArgs): Observable<RequestResp[]> {
        return new Observable<RequestResp[]>(observer => {

            if (!reqArgs && !this.clientArgs) {
                observer.error('!reqArgs && !this.baseArgs');
            }
            
            let reqResps: RequestResp[] = [];
            reqResps.push({ rowNr: 0, values: [{ varName: 'subject', varUri: 'test-uri' }] });

            observer.next(reqResps);
            observer.complete();
        });
    }

}