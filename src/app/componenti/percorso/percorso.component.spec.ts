import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercorsoComponent } from './percorso.component';

describe('PercorsoComponent', () => {
  let component: PercorsoComponent;
  let fixture: ComponentFixture<PercorsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PercorsoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PercorsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
