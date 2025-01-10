export const generateRefinedQueryPrompt = (
  userQuery: string
) => `You will refine a scientific query for precision and relevance. A user will provide a general topic they wish to research, and your task is to enhance this query for use with scientific search APIs like PubMed. Follow these instructions:
    1. Clarify the objects: Identify and expand on the key components of the topic, including its scope.
    2. Add Relevant Keywords: Incorporate synonyms, technical terms, or related concepts to improve search accuracy.
    3. Keep the Query Concise: The search will be provided directly to the API, so avoid unnecessary words or phrases and verbosity in general.
    
Example:

User Query: "The impact of exercise on mental health"
Refined Query: "Exercise AND 'mental health' OR 'psychological well-being' OR 'stress reduction' AND (adults OR adolescents) AND (review OR clinical trial)"

User Query: ${userQuery}
Refined Query:`;
