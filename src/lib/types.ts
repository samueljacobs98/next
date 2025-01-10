/*
 * Will only use the idlist from the response for now
 * but the other fields could be useful for AI Eval in the future
 * to improve the query refinement process
 */
export type PubmedSearchResponse = {
  esearchresult: {
    count: string;
    retmax: string;
    retstart: string;
    idlist: string[];
    translationset: { from: string; to: string }[];
    querytranslation: string;
  };
};

export type PubmedArticleDetailsResponse = {
  result: {
    [key: string]: {
      uid: string;
      pubdate: string;
      source: string;
      authors: {
        name: string;
        authtype: string;
      }[];
      lastAuthor: string;
      title: string;
      sorttitle: string;
      volume: string;
      issue: string;
      pages: string;
      lang: string[];
      fulljournalname: string;
    };
  };
};

export type PubmedArticleDetails =
  PubmedArticleDetailsResponse["result"][string];

export type ErgodicKnowledgeResponse = {
  thoughts: string;
  relationships: {
    source: string;
    source_type: string;
    relationship: string;
    target: string;
    target_type: string;
    confidence: number;
  }[];
  n_iterations: number;
  n_relationships: number;
  article: {
    PMID: string;
    Title: string;
    Abstract: string;
    Authors: string[];
    Journal: string;
    PublicationDate: string;
    Volume: string;
    Issue: string;
    DOI: string;
    Keywords: string[];
    PMCID: string;
    FullText: string;
  };
};

export type QueryResult = {
  id: string;
  article?: PubmedArticleDetails;
  knowledge?: ErgodicKnowledgeResponse;
};
