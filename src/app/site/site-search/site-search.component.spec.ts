import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSearchComponent } from './site-search.component';

describe('SiteSearchComponent', () => {
  let component: SiteSearchComponent;
  let fixture: ComponentFixture<SiteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
