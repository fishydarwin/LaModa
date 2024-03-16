import { Routes } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticlesComponent } from './articles/articles.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CategoryComponent } from './category/category.component';
import { ArticleCreateComponent } from './article-create/article-create.component';

export const routes: Routes = [
    { path: '', redirectTo: '/articles', pathMatch: 'full' },

    { path: 'articles', component: ArticlesComponent },
    { path: 'article/create', component: ArticleCreateComponent },
    { path: 'article/:id', component: ArticleDetailsComponent },

    { path: 'user/:id', component: UserDetailsComponent },
    
    { path: 'category/:id', component: CategoryComponent },

    // special
    { path: 'terms', component: TermsAndConditionsComponent},
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: '**', component: PageNotFoundComponent }
];
