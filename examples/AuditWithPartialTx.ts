/* eslint-disable no-console */
import { AuditService } from "../src/service";

const data = 'Hello World!';
const txHash = '__INPUT_AUDITED_TRANSACTION_HASH__';

const apiEndpoint = 'http://sym-test-01.opening-line.jp:3000';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
