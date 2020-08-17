/* eslint-disable no-console */
import { AuditService } from "../src/service";

const data = 'Hello World!';
const txHash = '24DAE3EDCB7330C6159AE1724E822626EB88341B6F3602D6CA4355FF86FCF548';

const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';

AuditService.auditWithPartial(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
