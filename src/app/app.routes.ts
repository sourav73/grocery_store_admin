import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'pages', pathMatch: 'full'
    },
    {
        path: 'pages', component: PagesComponent,
        children: [
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
                path: 'dashboard', title: 'Dashboard', component: DashboardComponent
            },
            {
                path: 'categories', title: 'Categories', component: CategoriesComponent
            }
        ]
    },
    {
        path: '**', component: PageNotFoundComponent
    }
];
