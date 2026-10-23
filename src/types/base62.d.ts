declare module 'base62/lib/ascii' {
  /** 把 0-61 的数字编码成单个 base62 字符 */
  export function encode(num: number): string;
  /** 把 base62 字符解码回数字 */
  export function decode(str: string): number;
}
