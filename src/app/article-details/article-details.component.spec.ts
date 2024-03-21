import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsComponent } from './article-details.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';

describe('ArticleDetailsComponent', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailsComponent, RouterModule.forRoot(routes)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
