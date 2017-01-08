'use strict';

describe('Service: CountryService', function () {

  // load the service's module
  beforeEach(module('travelmapUiApp'));

  // instantiate service
  var CountryService;
  beforeEach(inject(function (_CountryService_) {
    CountryService = _CountryService_;
  }));

  it('should do something', function () {
    expect(!!CountryService).toBe(true);
  });

});
