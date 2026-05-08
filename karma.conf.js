// Karma config used in headless CI / sandboxed environments where Chromium
// can't open its own sandbox (Raspberry Pi, Docker, GitHub Actions runners).
// `--no-sandbox` is required for those, but we don't add it to the default
// ChromeHeadless launcher because it's a real security trade-off — the run
// must opt in via `--browsers=ChromeHeadlessNoSandbox`.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    customLaunchers: {
      // We deliberately base on `Chrome` (not `ChromeHeadless`) because the
      // ChromeHeadless launcher in karma-chrome-launcher 3.x injects
      // --no-decommit-pooled-pages, which Chromium 147+ rejects with a hard
      // error and never opens a window. Headless mode is re-enabled below.
      ChromeHeadlessNoSandbox: {
        base: 'Chrome',
        flags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--remote-debugging-port=9222',
        ],
      },
    },
    client: { clearContext: false },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadlessNoSandbox'],
    restartOnFileChange: true,
    // Chromium on aarch64 Raspberry Pi takes a long time to spin up headless;
    // the default 60s timeout is not enough for cold starts.
    captureTimeout: 240000,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 120000,
  });
};
