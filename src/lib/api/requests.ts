import axios from "axios";
import { PubmedArticleDetailsResponse, PubmedSearchResponse } from "../types";

const pubmedClient = axios.create({
  baseURL: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
});

/**
 * As this is coming from an external API we would ideally validate the response
 * For now I assume the response is correct
 */
export const searchPubmed = async (query: string) => {
  const response = await pubmedClient.get<PubmedSearchResponse>(
    "/esearch.fcgi",
    {
      params: {
        db: "pubmed",
        term: query,
        retmode: "json",
        retstart: 10,
        retmax: 10,
      },
    }
  );

  return response.data;
};

export const getPubmedArticleDetails = async (id: string) => {
  const response = await pubmedClient.get<PubmedArticleDetailsResponse>(
    "/esummary.fcgi",
    {
      params: {
        db: "pubmed",
        id,
        retmode: "json",
      },
    }
  );

  const data = response.data.result[id];

  return data;
};

const ergodicClient = axios.create({
  baseURL: "https://scraperfns.azurewebsites.net/api/pmid",
});

export const getErgodicKnowledge = async (pmid: string) => {
  const response = await ergodicClient.post("/", {
    pmid,
  });

  return response.data;
};
