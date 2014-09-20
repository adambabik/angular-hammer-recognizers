exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/**/*-spec.js'],
  jasmineNodeOpts: {
  	showColors: true
  },
  baseUrl: 'http://localhost:8085',
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  }
};
