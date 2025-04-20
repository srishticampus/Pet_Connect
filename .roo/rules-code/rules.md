Always use "react-router" instead of "react-router-dom" for routing. "react-router-dom" is deprecated and will be removed in future versions of React Router.
Always use axios for making API calls. If an API client service is already created, use that instead of creating a new one. In this project, it is in the utils folder.
Make sure to check package.json if the package is already in use. If not, then add it first.
Make sure to use express validator to validate fields instead of manually checking them.
Very importantly, In serverside JS, Make sure to use es6, not commonjs. so no module.exports or require.
