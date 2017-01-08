'use strict';

describe('Service: MapService', function () {

  // load the service's module
  beforeEach(module('travelmapUiApp'));

  // instantiate service
  var MapService;
  beforeEach(inject(function (_MapService_) {
    MapService = _MapService_;
  }));

  it('should do something', function () {
    expect(!!MapService).toBe(true);
  });

});
