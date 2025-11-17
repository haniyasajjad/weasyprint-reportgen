import { Injectable } from '@nestjs/common';
import { CreateDatafetchDto } from './dto/create-datafetch.dto';
import { UpdateDatafetchDto } from './dto/update-datafetch.dto';

@Injectable()
export class DatafetchService {
  create(createDatafetchDto: CreateDatafetchDto) {
    return 'This action adds a new datafetch';
  }

  findAll() {
    return `This action returns all datafetch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datafetch`;
  }

  update(id: number, updateDatafetchDto: UpdateDatafetchDto) {
    return `This action updates a #${id} datafetch`;
  }

  remove(id: number) {
    return `This action removes a #${id} datafetch`;
  }
}
