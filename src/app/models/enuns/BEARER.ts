import { HttpHeaders } from "@angular/common/http";

export const BEARER = "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NjM4NjIwNjYsImV4cCI6MTY5NTM5ODA2NiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9QQVJUTkVSIl19.50WM7bBFQIcbpDWJ6SYW59ssujgHxJ1YFXf1aWTOzzcFgfk8_4ObweeP020DYcffXqLFBlkAoTZN-W8j4BXoXg"
export const CLIENT_ID = "731978274268-sbo35fdt0t1egp1ci26c43j86m55133o.apps.googleusercontent.com"
export const HOST = "http://192.168.1.200"
export const HEADERS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + BEARER
    })
  };