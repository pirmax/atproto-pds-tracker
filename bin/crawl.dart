import 'package:atproto_pds_crawler/atproto_pds_crawler.dart';
import 'package:atproto_pds_crawler/core/io/index_file.dart';

Future<void> main() async {
  final indexFile = IndexFile();

  indexFile.write(await ATProtoPdsCrawler(
    indexFile.read(),
    DateTime.now().toUtc(),
  ).execute());
}
