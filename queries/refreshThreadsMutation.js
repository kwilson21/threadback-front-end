export const refreshThreadsMutation = `
  mutation refreshThreads($username: String!) {
    refresh(username: $username) {
      status
      userId
      username
      profilePhoto
      bio
    }
  }
`;
