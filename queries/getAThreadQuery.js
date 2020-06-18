export const getAThreadQuery = `
  query getAThread($offset: Int!, $limit: Int!,$conversationIds: [ID!]) {
    threads(offset: $offset, limit: $limit, conversationIds: $conversationIds) {
      items{
        conversationId
        tweets{
          date
          text
          mentions
          urls
          photos
          timezeon
        }
        user{
          status
          userId
          username
          profilePhoto
        }
      }
      count
    }
  }
`;
