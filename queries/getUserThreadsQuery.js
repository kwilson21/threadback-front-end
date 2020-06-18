export const getUserThreadsQuery = `
  query getUserThreadsQuery($offset: Int!, $limit: Int!, $usernames: [String!]) {
    threads(offset: $offset, limit: $limit, usernames: $usernames, orderBy: {sort: CONVERSATION_ID, direction: DESC}) {
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
