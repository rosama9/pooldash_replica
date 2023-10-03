
/// These are the parts of config that are shared between our offline scripts (preloader etc) and the app itself.
export class DevConfig {
    static gql_url = 'https://devapi.poolcloud.com/graphql';
    static web_url = 'https://pooldash.com';
    static web_app_url = 'https://dev.pooldash.com';
    static forum_url = 'https://forum.pooldash.com';
}

export class ProdConfig {
    static gql_url = 'https://api.poolcloud.com/graphql';
    static web_url = 'https://pooldash.com';
    static web_app_url = 'https://app.pooldash.com';
    static forum_url = 'https://forum.pooldash.com';
}
