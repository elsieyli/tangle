const { CohereClient } = require('cohere-ai');



const cohere = new CohereClient({
  token: process.env.cohere_API_Key,
});

const vectorize_note = (async () => {
  const embed = await cohere.embed({
    texts: ['hello', 'goodbye'],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
  });
  console.log(embed);
});


 const vectorize_querry = (async () => {
    const embed = await cohere.embed({
      texts: ['hello', 'goodbye'],
      model: 'embed-english-v3.0',
      inputType: 'search_querry',
    });
    console.log(embed);
});
  
export const embed_doc = async (document: string ) => {
  const res = await cohere.embed({
    texts: [document],
    model: 'embed-english-v3.0',
    inputType: 'search_document'
  })
  


  return res.embeddings[0]
}

export const embed_search = async (search: string) => {
  const res = await cohere.embed({
    texts: [search],
    model: 'embed-english-v3.0',
    inputType: 'search_query',
  })
  console.log(res)
  return res.embeddings[0]
}