import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiArticlesComponent } from './infi-articles.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';

describe('InfiArticlesComponent', () => {
  let component: InfiArticlesComponent;
  let fixture: ComponentFixture<InfiArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiArticlesComponent, RouterModule.forRoot(routes)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfiArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
