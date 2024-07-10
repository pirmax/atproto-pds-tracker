import fs from 'fs';
import { PlcInterface } from './interfaces/plc-interface';
import data from '../data.json';

(async (): Promise<void> => {
  let readmeText: string = ``;

  readmeText += `# Crawled ATProto PDS 👀\n\n`;
  readmeText += `This is a list of ATProto PDS crawled from the ATProto website.\n\n`;
  readmeText += `You can follow me on Bluesky: https://bsky.app/profile/pirmax.fr\n\n`;
  readmeText += `Last Updated: ${new Date().toISOString()}\n\n`;

  const plcData: PlcInterface[] = (
    data as {
      plc: PlcInterface[];
    }
  ).plc;

  for await (const plcDatum of plcData) {
    readmeText += `## 🌐 ${plcDatum.name}\n\n`;
    readmeText += `Last Crawled: ${plcDatum.lastCrawledAt}\n\n`;
    readmeText += `| PDS Endpoint | Active | Invite Code Required | Created At |\n`;
    readmeText += `|---|:---:|:---:|:---:|\n`;

    for await (const pds of plcDatum.pds) {
      readmeText += `| ${new URL(pds.domain).host} | ${pds.isActive ? '✅' : '❌'} | ${pds.isInviteCodeRequired ? '✅' : '❌'} | ${pds.createdAt} |\n`;
    }
  }

  fs.writeFileSync('README.md', readmeText);
})();
