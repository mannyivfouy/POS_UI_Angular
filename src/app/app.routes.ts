import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin'],
        },
      },
      {
        path: 'users',
        loadComponent: () => import('./features/user/user-list/user-list').then((m) => m.UserList),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin'],
        },
      },
      {
        path: 'stocks',
        loadComponent: () =>
          import('./features/product/product-list/product-list').then((m) => m.ProductList),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Cashier'],
        },
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/supplier/supplier-list/supplier-list').then((m) => m.SupplierList),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager'],
        },
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customer/customer-list/customer-list').then((m) => m.CustomerList),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Cashier'],
        },
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/category/category-list/category-list').then((m) => m.CategoryList),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Cashier'],
        },
      },
      {
        path: 'purchases',
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import('./features/purchase/purchase-form/purchase-form').then((m) => m.PurchaseForm),
            canActivate: [roleGuard],
            data: {
              roles: ['Admin', 'Manager'],
            },
          },
          {
            path: 'purchases-history',
            loadComponent: () =>
              import('./features/purchase/purchase-history/purchase-history').then(
                (m) => m.PurchaseHistory,
              ),
            canActivate: [roleGuard],
            data: {
              roles: ['Admin', 'Manager'],
            },
          },
        ],
      },
      {
        path: 'sales',
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import('./features/sale/sale-form/sale-form').then((m) => m.SaleForm),
            canActivate: [roleGuard],
            data: {
              roles: ['Admin', 'Cashier'],
            },
          },
          {
            path: 'sales-history',
            loadComponent: () =>
              import('./features/sale/sale-history/sale-history').then((m) => m.SaleHistory),
            canActivate: [roleGuard],
            data: {
              roles: ['Admin', 'Manager'],
            },
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Cashier']
        }
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
