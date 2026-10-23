import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);

  async getStatus() {
    return {
      cpu: this.getCpuInfo(),
      mem: this.getMemInfo(),
      dist: await this.getDiskStatus(),
      sys: this.getSysInfo(),
    };
  }

  /**
   * 获取磁盘状态信息
   * 跨平台实现:
   * - Windows: 通过 fs.statfsSync 遍历所有可访问的盘符
   * - Linux/macOS: 通过解析 /proc/mounts 获取所有挂载点(Linux),或兜底只检查根目录
   * 已移除对已废弃 wmic 命令的依赖,改用 Node.js 内置 fs.statfsSync。
   */
  async getDiskStatus() {
    try {
      if (process.platform === 'win32') {
        return this.getWindowsDiskInfo();
      }
      return this.getUnixDiskInfo();
    } catch (err) {
      this.logger.error('获取磁盘信息失败', (err as Error)?.stack);
      return [];
    }
  }

  /**
   * Windows: 遍历 A-Z 盘符,使用 fs.statfsSync 读取每个盘符的磁盘信息
   */
  private getWindowsDiskInfo() {
    const disks: Array<{
      dirName: string;
      typeName: string;
      total: string;
      used: string;
      free: string;
      usage: string;
    }> = [];
    for (let code = 65; code <= 90; code++) {
      const letter = String.fromCharCode(code);
      const mountPath = `${letter}:\\`;
      // 先判断盘符是否可访问,跳过未挂载的盘符
      try {
        fs.accessSync(mountPath, fs.constants.R_OK);
      } catch {
        continue;
      }
      const info = this.readDiskByStatfs(mountPath, 'NTFS');
      if (info) disks.push(info);
    }
    return disks;
  }

  /**
   * Linux/macOS: 优先解析 /proc/mounts 拿到所有挂载点,失败时兜底只检查根目录
   */
  private getUnixDiskInfo() {
    const disks: Array<{
      dirName: string;
      typeName: string;
      total: string;
      used: string;
      free: string;
      usage: string;
    }> = [];

    const mountPoints = this.parseProcMounts();
    const targets =
      mountPoints.length > 0
        ? mountPoints
        : [{ mountPoint: '/', fsType: 'unix' }];

    for (const { mountPoint, fsType } of targets) {
      const info = this.readDiskByStatfs(mountPoint, fsType);
      if (info) disks.push(info);
    }
    return disks;
  }

  /**
   * 解析 Linux 的 /proc/mounts,提取真实磁盘挂载点(过滤掉 tmpfs/proc/sys 等虚拟文件系统)
   */
  private parseProcMounts(): Array<{ mountPoint: string; fsType: string }> {
    try {
      const content = fs.readFileSync('/proc/mounts', 'utf-8');
      const result: Array<{ mountPoint: string; fsType: string }> = [];
      const seen = new Set<string>();
      // 过滤虚拟文件系统
      const skipFs =
        /^(tmpfs|devtmpfs|overlay|aufs|squashfs|devpts|sysfs|proc|cgroup|nsfs|autofs|binfmt_misc|debugfs|tracefs|hugetlbfs|mqueue|pstore|ramfs|rootfs|fusectl|configfs|securityfs|selinuxfs|efivarfs)$/i;
      for (const line of content.split('\n')) {
        if (!line.trim()) continue;
        const parts = line.split(' ');
        if (parts.length < 3) continue;
        const [fsName, mountPoint, fsType] = parts;
        if (skipFs.test(fsName) || skipFs.test(fsType)) continue;
        if (seen.has(mountPoint)) continue;
        seen.add(mountPoint);
        result.push({ mountPoint, fsType });
      }
      return result;
    } catch {
      return [];
    }
  }

  /**
   * 使用 Node.js 内置的 fs.statfsSync 读取指定路径所在文件系统的磁盘使用情况
   */
  private readDiskByStatfs(
    mountPath: string,
    typeName: string,
  ): {
    dirName: string;
    typeName: string;
    total: string;
    used: string;
    free: string;
    usage: string;
  } | null {
    try {
      const stats = fs.statfsSync(mountPath);
      const total = stats.bsize * stats.blocks;
      const free = stats.bsize * stats.bavail; // bavail: 非 root 用户可用的块数
      const used = total - free;
      if (total === 0) return null;
      return {
        dirName: mountPath,
        typeName,
        total: `${this.bytesToGB(total)}GB`,
        used: `${this.bytesToGB(used)}GB`,
        free: `${this.bytesToGB(free)}GB`,
        usage: ((used / total) * 100).toFixed(2),
      };
    } catch {
      return null;
    }
  }

  bytesToGB(bytes: number) {
    const gb = bytes / (1024 * 1024 * 1024);
    return Number.isFinite(gb) ? gb.toFixed(2) : '0.00';
  }

  getMemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage =
      totalMemory > 0
        ? (((totalMemory - freeMemory) / totalMemory) * 100).toFixed(2)
        : '0.00';
    const mem = {
      total: this.bytesToGB(totalMemory),
      used: this.bytesToGB(usedMemory),
      free: this.bytesToGB(freeMemory),
      usage: memoryUsagePercentage,
    };
    return mem;
  }

  getCpuInfo() {
    const cpus = os.cpus();
    const cpuInfo = cpus.reduce(
      (info, cpu) => {
        info.cpuNum += 1;
        info.user += cpu.times.user;
        info.sys += cpu.times.sys;
        info.idle += cpu.times.idle;
        info.total += cpu.times.user + cpu.times.sys + cpu.times.idle;
        return info;
      },
      { user: 0, sys: 0, idle: 0, total: 0, cpuNum: 0 },
    );
    const total = cpuInfo.total || 1;
    const cpu = {
      cpuNum: cpuInfo.cpuNum,
      sys: ((cpuInfo.sys / total) * 100).toFixed(2),
      used: ((cpuInfo.user / total) * 100).toFixed(2),
      free: ((cpuInfo.idle / total) * 100).toFixed(2),
    };
    return cpu;
  }

  getSysInfo() {
    return {
      computerName: os.hostname(),
      computerIp: this.getServerIP(),
      osName: os.platform(),
      osArch: os.arch(),
    };
  }

  getServerIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
}
