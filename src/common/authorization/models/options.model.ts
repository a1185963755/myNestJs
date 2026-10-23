import { Adapter } from 'casbin';

export interface RegisterOptions {
  modelPath: string;
  /** 策略文件路径，或任意 casbin 适配器实现 */
  policyAdapter: string | Adapter;
  global?: boolean;
}
