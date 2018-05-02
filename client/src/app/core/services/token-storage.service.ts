// import { Injectable } from '@angular/core';

// declare var tokenStorage: NodeTokenStorage;

// @Injectable()
// export class TokenStorageService implements NodeTokenStorage {

//     getItem(key: string): string {
//         if (!isBrowser) {
//             return tokenStorage.getItem(key);
//         }
//         else {
//             return getCookie(key);
//         }
//     }

//     setItem(key: string, value: string): void {
//         if (!isBrowser) {
//             tokenStorage.setItem(key, value);
//         }
//         else {
//             setCookie(key, value, 1);
//         }
//     }

//     removeItem(key: string): void {
//         if (!isBrowser) {
//             tokenStorage.removeItem(key);
//         }
//         else {
//             removeCookie(key);
//         }
//     }
// }

// interface NodeTokenStorage {
//     getItem(key: string): string;
//     setItem(key: string, value: string): void;
//     removeItem(key: string): void;
// }
