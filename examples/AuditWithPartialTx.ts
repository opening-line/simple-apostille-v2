/* eslint-disable no-console */
import { AuditService } from "../src/service";

const data = 'Hello World!';
const txHash = 'D5E1DA97843B6144770214F29046EB8E3A6BA5B8327182A07288F92CB7116A42';

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
