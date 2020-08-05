/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!!';
const txHash = 'D2D40B7BE9E2029ABC948D323D6DC91BD417A36436F2CB451797BE78F19B2A4D';
const apiEndpoint = 'https://sym-test963.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
