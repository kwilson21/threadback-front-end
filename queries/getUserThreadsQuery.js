export const getUserThreadsQuery = `
  query getUserThreadsQuery($offset: Int!, $limit: Int!, $usernames: [String!]) {
    threads(offset: $offset, limit: $limit, usernames: $usernames, orderBy: {sort: CONVERSATION_ID, direction: DESC}) {
      items{
        conversationId
        tweets{
          date
          tweetId
          text
          mentions
          urls
          photos
          timezone
          video
          link
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
