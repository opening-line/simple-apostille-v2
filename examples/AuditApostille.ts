/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World';
const txHash = '4ADCC18B2D72D8D40922D14A03B077C7D8BEC1FEE9934FE69E54DBBC3800E342';
const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
