import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  rmSync,
  statSync,
  cpSync,
  mkdirSync,
} from 'fs';
import { join, relative, resolve, sep } from 'path';
import sharp from 'sharp';

/** 上传根目录，统一用 path.join 拼，避免 Windows 的反斜杠泄漏到 URL 里。 */
const UPLOAD_ROOT = join(process.cwd(), 'uploads');

@Injectable()
export class UploadService {
  uploadFile(files: Array<Express.Multer.File>) {
    if (!files || files.length < 1) {
      throw new HttpException(
        { msg: '请选择一个文件', code: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    // 之前用 replace('uploads\\', ...)，在 Linux/Docker 下路径分隔符是 /，替换不生效
    const paths = files.map((item) =>
      relative(UPLOAD_ROOT, item.path).split(sep).join('/'),
    );
    return {
      path: paths.map((p) => `static/${p}`),
    };
  }

  mergeChunks(name: string) {
    const chunkDir = join(UPLOAD_ROOT, `chunks_${name}`);
    if (!existsSync(chunkDir)) {
      throw new HttpException(
        { msg: '文件分片不存在', code: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 按分片序号排序后顺序追加，避免并发写同一文件导致内容错乱
    const files = readdirSync(chunkDir).sort((a, b) => {
      const seq = (value: string) => Number(value.match(/-(\d+)$/)?.[1] ?? 0);
      return seq(a) - seq(b);
    });
    const target = join(UPLOAD_ROOT, name);
    writeFileSync(target, Buffer.alloc(0));
    for (const file of files) {
      appendFileSync(target, readFileSync(join(chunkDir, file)));
    }
    rmSync(chunkDir, { recursive: true, force: true });
    return { path: `static/${name}`, size: statSync(target).size };
  }

  uploadChunk(chunk: Array<Express.Multer.File>, name: string) {
    if (!chunk?.[0]) {
      throw new HttpException(
        { msg: '请选择一个文件', code: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = name.match(/(.+)\-\d+$/)?.[1] ?? name;
    const chunkDir = join(UPLOAD_ROOT, `chunks_${fileName}`);
    if (!existsSync(chunkDir)) {
      mkdirSync(chunkDir, { recursive: true });
    }
    cpSync(chunk[0].path, join(chunkDir, name));
    rmSync(chunk[0].path);
    return '分片上传成功';
  }

  async compression(filePath: string, color: number) {
    // 只允许 uploads 目录内的文件，阻断 ../../ 之类的路径穿越
    const resolved = resolve(UPLOAD_ROOT, filePath);
    if (!resolved.startsWith(UPLOAD_ROOT + sep)) {
      throw new HttpException(
        { msg: '非法的文件路径', code: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!existsSync(resolved)) {
      throw new HttpException(
        { msg: '文件不存在', code: 400 },
        HttpStatus.BAD_REQUEST,
      );
    }
    return sharp(resolved, {
      animated: true,
      limitInputPixels: false,
    })
      .gif({
        colours: color,
      })
      .toBuffer();
  }
}
