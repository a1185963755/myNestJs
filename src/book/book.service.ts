import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BookEntity } from './entity/book.entity';

@Injectable()
export class BookService {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async list() {
    const books = await this.entityManager.find(BookEntity);
    return books;
  }

  async findById(id: number) {
    const book = await this.entityManager.find(BookEntity, {
      where: { id },
    });

    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const { name, description, author, cover } = createBookDto;
    const book = await this.entityManager.find(BookEntity, {
      where: {
        name,
      },
    });
    if (book.length > 0) {
      throw new HttpException('书籍已存在，换个名字吧', HttpStatus.BAD_REQUEST);
    }

    const newBook = this.entityManager.create(BookEntity, {
      name,
      description,
      author,
      cover,
    });
    await this.entityManager.save(newBook);
    return newBook;
  }

  async update(updateBookDto: UpdateBookDto) {
    const { id, name, description, author, cover } = updateBookDto;
    const book = await this.entityManager.find(BookEntity, {
      where: {
        id,
      },
    });
    if (book.length < 1) {
      throw new HttpException('书籍不存在', HttpStatus.BAD_REQUEST);
    }
    await this.entityManager.update(BookEntity, id, {
      name,
      description,
      author,
      cover,
    });
    return '书籍更新成功';
  }

  async delete(id: number) {
    const book = await this.entityManager.find(BookEntity, {
      where: {
        id,
      },
    });
    if (book.length < 1) {
      throw new HttpException('书籍不存在', HttpStatus.BAD_REQUEST);
    }
    await this.entityManager.delete(BookEntity, id);
    return '书籍删除成功';
  }
}
