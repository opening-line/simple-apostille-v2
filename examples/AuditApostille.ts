/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!!';
const txHash = 'C832FB0A1997D09F692549E3167015AB9B3F24740141E0869B6298132B0AE16F';
const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
