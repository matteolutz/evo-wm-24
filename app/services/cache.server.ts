import { GameTrackLeaderboardEntry } from '~/utils/game';

export class ServerCache<K, V> {
  private _cache: Map<K, { val: V; lastUpdated: number }> = new Map();

  public has(key: K): boolean {
    return this._cache.has(key);
  }

  public get(key: K): V | undefined {
    return this._cache.get(key)?.val;
  }

  public getWithTimestamp(key: K): { val: V; lastUpdated: number } | undefined {
    return this._cache.get(key);
  }

  public set(key: K, value: V): void {
    this._cache.set(key, { val: value, lastUpdated: Date.now() });
  }

  public delete(key: K): void {
    this._cache.delete(key);
  }

  public clear(): void {
    this._cache.clear();
  }
}

export const trackLeaderboardCache = new ServerCache<
  number,
  Array<GameTrackLeaderboardEntry>
>();
