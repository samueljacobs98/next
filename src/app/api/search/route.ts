import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refineQuery as generateRefinedQuery } from "@/lib/ai/generate";
import {
  getErgodicKnowledge,
  getPubmedArticleDetails,
  searchPubmed,
} from "@/lib/api/requests";
import { ErgodicKnowledgeResponse, PubmedArticleDetails } from "@/lib/types";

const bodySchema = z.object({
  query: z.string(),
});

export async function POST(request: NextRequest) {
  auth();

  // can catch the error inline as it will then fail the validation and return a 400
  const body = await request.json().catch(() => ({}));
  const validationOutcome = bodySchema.safeParse(body);

  if (!validationOutcome.success) {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const query = validationOutcome.data.query;
  const refinedQuery = await generateRefinedQuery(query);

  const pubmedResults = await searchPubmed(refinedQuery);

  // ideally would stream these back as they come resolve
  // for now we can resolve them all in parallel
  const articlesMap = new Map<
    string,
    {
      article?: PubmedArticleDetails;
      knowledge?: ErgodicKnowledgeResponse;
    }
  >();

  /**
   * Ideally would do this but receiving a throttling error
   * Could use a batching approach to get around this
     await Promise.all(
    pubmedResults.esearchresult.idlist.map(async (id) => {
      const [article, knowledge] = await Promise.all([
        getPubmedArticleDetails(id),
        getErgodicKnowledge(id),
      ]);
      articlesMap.set(id, { article, knowledge });
    })
  );
   */

  for (const id of pubmedResults.esearchresult.idlist) {
    const [article, knowledge] = await Promise.all([
      getPubmedArticleDetails(id),
      getErgodicKnowledge(id),
    ]);
    articlesMap.set(id, { article, knowledge });
  }

  const articles = Array.from(articlesMap.entries()).map(([id, value]) => ({
    id,
    ...value,
  }));

  return NextResponse.json({ articles });
}
