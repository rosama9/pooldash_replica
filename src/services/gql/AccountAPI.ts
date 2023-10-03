import gql from 'graphql-tag';

export const ACCOUNT = gql`
    query AccountInfo {
        pools {
            count
        }
        me {
            joined_ts
            email
        }
        history {
            count
        }
    }
`;


