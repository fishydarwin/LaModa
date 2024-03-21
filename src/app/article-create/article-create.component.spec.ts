import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCreateComponent } from './article-create.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';

describe('ArticleCreateComponent', () => {
  let component: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreateComponent, RouterModule.forRoot(routes)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
