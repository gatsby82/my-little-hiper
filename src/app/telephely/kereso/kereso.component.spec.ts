import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeresoComponent } from './kereso.component';

describe('KeresoComponent', () => {
  let component: KeresoComponent;
  let fixture: ComponentFixture<KeresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
