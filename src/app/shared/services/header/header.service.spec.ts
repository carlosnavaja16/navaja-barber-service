import { TestBed } from "@angular/core/testing";

import { HeaderService } from "./header.service";

describe("TitleService", () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
