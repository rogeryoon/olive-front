import { Injectable } from '@angular/core';

@Injectable()
export class OliveUserNameService {
  private map = new Map<string, string>();
  constructor() { }

  get(key: string): string {
    return '윤성은';
    // return this.map.get(key);
  }

  set(key: string, name: string): void {
    this.map.set(key, name);
  }

  exist(key): boolean {
    return this.map.has(key);
  }

  delete(key): void {
    this.map.delete(key);
  }
}
