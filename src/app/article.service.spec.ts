import { TestBed } from '@angular/core/testing';

import { ArticleService } from './article.service';
import { Article } from './article';
import { ARTICLES } from './mock-data';

describe('ArticleService', () => {
  let service: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#all() returns all articles', () => {
    let result = [];
    service.all().subscribe((articles) => { result = articles});
    expect(result.length).toEqual(5);
  })

  it('#any() sees if an article exists', () => {
    expect(service.any(10000)).toBe(false);
    expect(service.any(-1)).toBe(false);
    expect(service.any(1)).toBe(true);
  })

  it('#byId(1) should be created by Administrator', () => {
    expect(service.byId(1).id_author).toEqual(1);
  })

  it('#ofUser(2) should return 2 articles', () => {
    let result = [];
    service.ofUser(2).subscribe((articles) => { result = articles; });
    expect(result.length).toEqual(2);
  })

  it('#ofCategory(4) has the first article\'s name start with Eyeliner', () => {
    let result: Article[] = [];
    service.ofCategory(4).subscribe((articles) => { result = articles; });
    expect(result[0].name.startsWith('Eyeliner')).toBe(true);
  })

  it('#add(article) repeated 5 times means length is 10 and last_available_id is 11', () => {

    let ARTICLES_COPY = [...ARTICLES]; // make a copy of our mock data since 
                                       // it will be tarnished

    for(let i = 0; i < 5; i++) {
      let test_article: Article = 
      { 
        id: -1, id_author: 1, id_category:1,
        name: 'Test Article', summary: 'Whatever',
        attachment_array: [], creation_date: new Date()
      }
      service.add(test_article);
    }

    let result = [];
    service.all().subscribe((articles) => { result = articles; });
    expect(result.length).toEqual(10);
    expect(service.last_available_id).toEqual(11);

    ARTICLES.splice(0, ARTICLES.length);  // restore clean data to articles
    for (let article of ARTICLES_COPY) {
      ARTICLES.push(article);
    }

  })

  it('#update() should work', () => {

    let ARTICLES_COPY = [...ARTICLES]; // make a copy of our mock data since 
                                       // it will be tarnished

    let test_article: Article = service.byId(3);
    test_article.name = 'Something Else';
    service.update(test_article);

    expect(service.byId(3).name).toEqual('Something Else');

    ARTICLES.splice(0, ARTICLES.length);  // restore clean data to articles
    for (let article of ARTICLES_COPY) {
      ARTICLES.push(article);
    }
    
  })

  it('#delete() called 3 times means length is 2', () => {
    let ARTICLES_COPY = [...ARTICLES]; // make a copy of our mock data since 
                                       // it will be tarnished

    for (let i = 1; i <= 3; i++) {
      service.delete(service.byId(i));
    }

    let result = [];
    service.all().subscribe((articles) => { result = articles; });
    expect(result.length).toEqual(2);

    ARTICLES.splice(0, ARTICLES.length);  // restore clean data to articles
    for (let article of ARTICLES_COPY) {
      ARTICLES.push(article);
    }
  })
  
});
