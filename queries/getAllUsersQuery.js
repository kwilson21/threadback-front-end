export const getAllUsersQuery = `
    query getAllUsers{
        users(limit: 99999){
        items{
            status
            userId
            username
        }
        }
    }
`;
