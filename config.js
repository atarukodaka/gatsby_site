const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://atarukodaka.github.io',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    //logo: 'https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/brand.svg',
    logo: 'https://avatars.githubusercontent.com/u/9462327?s=60&v=4',
    //logoLink: 'https://hasura.io/learn/',
    logoLink: 'http://atarukodaka.github.io/',
    title: "",
      //"<a href='https://hasura.io/learn/'><img class='img-responsive' src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/learn-logo.svg' alt='Learn logo' /></a>",
    githubUrl: 'https://github.com/atarukodaka',
    helpUrl: '',
    tweetText: '',
    
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [ 
      
      
    ],
    collapsedNav: [      
      '/figureskating',
      '/game',
      '/workout',
      '/software',
      '/hobby',
    ],
    links: [{ text: 'Ataru KODAKA', link: 'https://atarukodaka.github.io' }],
    frontline: false,
    ignoreIndex: true,
    //ignoreIndex: false,
    title:
      "Ataru Kodaka Site",
      //"<a href='https://hasura.io/learn/'>graphql </a><div class='greenCircle'></div><a href='https://hasura.io/learn/graphql/react/introduction/'>react</a>",
  },
  siteMetadata: {
    title: 'Ataru Kodaka Site',
    description: 'figureskating / game ',
    ogImage: null,
    //docsLocation: 'https://github.com/hasura/gatsby-gitbook-boilerplate/tree/master/content',
    docsLocation: 'https://github.com/atarukodaka/gatsby_site/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
