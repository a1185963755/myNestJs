export enum QrCodeStatus {
  noscan = 'noscan',
  scan_wait_confirm = 'scan-wait-confirm',
  scan_confirm = 'scan-confirm',
  scan_cancel = 'scan-cancel',
  expired = 'expired',
}

export interface QrCodeInfo {
  status: QrCodeStatus;
  userInfo?: {
    userId: number;
  };
}
