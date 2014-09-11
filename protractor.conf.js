exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/**/*-spec.js'],
  jasmineNodeOpts: {
  	showColors: true
  },
  baseUrl: 'http://localhost:8085',
};
