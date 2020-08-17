/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!';
const txHash = 'B08C7A64B1653AE8ACB34081857F8ADFD5D5BAA3247249313DC949108BFFA2C5';
const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
