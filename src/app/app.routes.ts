import { Routes } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticlesComponent } from './articles/articles.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CategoryComponent } from './category/category.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { StatsComponent } from './stats/stats.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { ArticlesSearchComponent } from './articles-search/articles-search.component';

export const routes: Routes = [
    { path: '', redirectTo: '/articles', pathMatch: 'full' },

    { path: 'articles', component: ArticlesComponent },
    { path: 'articles/search/:text', component: ArticlesSearchComponent },
    { path: 'article/create', component: ArticleCreateComponent },
    { path: 'article/:id', component: ArticleDetailsComponent },
    { path: 'article/edit/:id', component: ArticleEditComponent },

    { path: 'user/login', component: UserLoginComponent },
    { path: 'user/register', component: UserRegisterComponent },
    { path: 'user/:id', component: UserDetailsComponent },
    
    { path: 'category/:id', component: CategoryComponent },

    { path: 'admin/stats', component: StatsComponent },

    // special
    { path: 'terms', component: TermsAndConditionsComponent},
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: '**', component: PageNotFoundComponent }
];
