export const getAUserQuery = `
  query getAUser($usernames: [String!]){
    users(usernames: $usernames, limit:1){
      items{
        status
        userId
        username
        profilePhoto
        bio
      }
    }
  }
`;
