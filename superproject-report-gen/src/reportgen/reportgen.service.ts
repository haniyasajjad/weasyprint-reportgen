import { Injectable } from '@nestjs/common';
import { CreateReportgenDto } from './dto/create-reportgen.dto';
import { UpdateReportgenDto } from './dto/update-reportgen.dto';

@Injectable()
export class ReportgenService {
  create(createReportgenDto: CreateReportgenDto) {
    return 'This action adds a new reportgen';
  }

  findAll() {
    return `This action returns all reportgen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportgen`;
  }

  update(id: number, updateReportgenDto: UpdateReportgenDto) {
    return `This action updates a #${id} reportgen`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportgen`;
  }
}
