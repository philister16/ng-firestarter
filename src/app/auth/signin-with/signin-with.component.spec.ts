import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninWithComponent } from './signin-with.component';

describe('SigninWithComponent', () => {
  let component: SigninWithComponent;
  let fixture: ComponentFixture<SigninWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninWithComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
