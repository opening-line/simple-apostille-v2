/* eslint-disable no-console */
import { AuditService } from '../src/service';

const data = 'Hello World!!';
const txHash = '2AC0887364EC2AD45A103C2477A1DB5A69E4BC1B2F401D84D1A4BE25A96E5AC0';
const apiEndpoint = 'https://sym-test963.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
