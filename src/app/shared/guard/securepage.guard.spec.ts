import { TestBed, async, inject } from '@angular/core/testing';

import { SecurepageGuard } from './securepage.guard';

describe('SecurepageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurepageGuard]
    });
  });

  it('should ...', inject([SecurepageGuard], (guard: SecurepageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
