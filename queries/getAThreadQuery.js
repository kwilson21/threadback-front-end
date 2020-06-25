export const getAThreadQuery = `
  query getAThread($offset: Int!, $limit: Int!,$conversationIds: [ID!]) {
    threads(offset: $offset, limit: $limit, conversationIds: $conversationIds) {
      items{
        conversationId
        tweets{
          tweetId
          date
          text
          mentions
          urls
          photos
          timezone
        }
        user{
          status
          userId
          username
          profilePhoto
          bio
        }
      }
      count
    }
  }
`;
