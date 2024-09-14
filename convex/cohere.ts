const { CohereClient } = require('cohere-ai');


require('dotenv').config()

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
  
const embed_docs = async (documents: string[]) => {
  const res = await cohere.embed({
    texts: documents,
    model: 'embed-english-v3.0',
    inputType: 'search_document'
  })

  return res
}

const embed_search = async (search: string) => {
  const res = await cohere.embed({
    texts: [search],
    model: 'embed-english-v3.0',
    inputType: 'search_query',
  })
  return res
}