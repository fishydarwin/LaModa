import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditComponent } from './article-edit.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';

describe('ArticleEditComponent', () => {
  let component: ArticleEditComponent;
  let fixture: ComponentFixture<ArticleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleEditComponent, RouterModule.forRoot(routes)]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
