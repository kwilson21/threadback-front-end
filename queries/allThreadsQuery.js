export const allThreadsQuery = `
  query allThreads($offset: Int!, $limit: Int!) {
    threads(offset: $offset, limit: $limit, orderBy: {sort: CONVERSATION_ID, direction: DESC}) {
      items{
        conversationId
        tweets{
          date
          text
          mentions
          urls
          photos
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
