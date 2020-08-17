/* eslint-disable no-console */
import { AuditService } from "../src/service";

const data = 'Hello World!';
const txHash = '2A669AF717E946171AA976ACA6634606D7E177F70DE2D705E832EAB97D716B53';

const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';

AuditService.audit(data, txHash, apiEndpoint).then((result) => {
  console.log(result);
}).catch((err) => {
  console.error(`err: ${err}`);
});
