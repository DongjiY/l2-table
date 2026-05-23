import { LRUCache } from "./lru-cache";

export class ContentWidthCache {
  // static content cache has an upper bound where N = # of cols <== ONLY ONE YOU NEED
  // dynamic content is N * M where N is the number of columns and M is the number of rows - DERIVABLE (total col width - static content width)
  // not derivable. need an LRU cache sized to the visible cells count. Not derivable because the cell width could be from a larger cells content
  private staticContentCache: Map<string, number> = new Map();
  private dynamicContentCache: LRUCache<string, number>;

  public static generateKey(content: string, font: string): string {
    return `${content}#${font}`;
  }

  constructor(dynamicCacheSize: number) {
    this.dynamicContentCache = new LRUCache(dynamicCacheSize);
  }

  public getStaticContentWidth(key: string): number | undefined {
    return this.staticContentCache.get(key);
  }

  public getDynamicContentWidth(key: string): number | undefined {
    return this.dynamicContentCache.get(key);
  }

  public setStaticContentWidth(key: string, value: number): void {
    this.staticContentCache.set(key, value);
  }

  public setDynamicContentWidth(key: string, value: number): void {
    this.dynamicContentCache.put(key, value);
  }
}
