/* eslint-disable no-console */
import { AuditService } from "../src/service";

const data = 'Hello World!';
const txHash = '77CB1A251B028529C5AB07394D4DD5E769382C0E47FA4267B8694649ED75D003';

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
