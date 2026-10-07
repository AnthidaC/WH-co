import { couchbaseCluster } from "@/lib/couchbase/cluster";
import { ConcertDocument, ConcertDocumentSchema } from "@/validators/concert.schema";

export class ConcertRepository {
  async findById(concertId: string): Promise<ConcertDocument | null> {
    const raw = await couchbaseCluster.getConcert(concertId);
    if (!raw) return null;
    return ConcertDocumentSchema.parse(raw);
  }

  async findAll(): Promise<ConcertDocument[]> {
    const list = await couchbaseCluster.getAllConcerts();
    return list.map((c) => ConcertDocumentSchema.parse(c));
  }
}

export const concertRepository = new ConcertRepository();
