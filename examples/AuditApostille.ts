/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!';
const txHash = 'E4736F00707FC818A606274CACF03C32BA6F437CFE55551BC6CF00C920B8DA9C';
const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
