import serverRoute from './server/serverRoutes';


export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'my_discover',
    uiExports: {

      app: {
        title: 'My discover',
        description: 'A discover app',
        icon: 'plugins/my_discover/icon/icon.svg',
        main: 'plugins/my_discover/app'
      }
    },

    init(server) {
      // Add server routes and initialize the plugin here
      serverRoute(server);
    }
  });
}
