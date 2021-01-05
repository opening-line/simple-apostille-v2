/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!';
const txHash = 'CC0987CA2939DF9DB3C9A7A951DDE86B695FD7F09DF68EB6A152616D5DF202F4';
const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
