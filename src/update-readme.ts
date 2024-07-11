import fs from 'fs';
import getData from './commons/get-data';
import { PlcInterface } from './interfaces/plc-interface';

function truncate(value: string, length: number): string {
  return value.length > length ? value.slice(0, length - 1) + '...' : value;
}

(async (): Promise<void> => {
  let readmeText: string = ``;

  readmeText += `# Crawled ATProto PDS 👀\n\n`;
  readmeText += `This is a list of ATProto PDS crawled from the ATProto website.\n\n`;
  readmeText += `You can follow me on Bluesky: https://bsky.app/profile/pirmax.fr\n\n`;
  readmeText += `Last Updated: ${new Date().toISOString()}\n\n`;

  const plcData: PlcInterface[] = await getData();

  for await (const plcDatum of plcData) {
    readmeText += `## 🌐 [${plcDatum.name}](https://${plcDatum.name})\n\n`;
    readmeText += `Last Crawled: ${plcDatum.lastCrawledAt}\n\n`;
    readmeText += `| Endpoint | Invite Code | Creation Date | Version |\n`;
    readmeText += `|---|:---:|:---:|:---:|\n`;

    for await (const pds of plcDatum.pds) {
      const pdsActiveText: string = `${pds.isActive ? '✅' : '❌'}`;
      const pdsDomainText: string = `[**${new URL(pds.domain).host}**](${pds.domain})`;
      const pdsInviteCodeRequiredText: string = `${pds.isInviteCodeRequired ? '🔒 - ✅' : '🔓 - ❌'}`;
      const pdsCreationDateText: string = `*${pds.createdAt}*`;
      const pdsVersionText: string = `[${truncate(pds.version ?? '⁉️', 8)}](${pds.domain}/xrpc/_health)`;

      readmeText += `| ${pdsActiveText} ${pdsDomainText} | ${pdsInviteCodeRequiredText} | ${pdsCreationDateText} | ${pdsVersionText} |\n`;
    }
  }

  fs.writeFileSync('README.md', readmeText);
})();
