import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatafetchService } from './datafetch.service';
import { CreateDatafetchDto } from './dto/create-datafetch.dto';
import { UpdateDatafetchDto } from './dto/update-datafetch.dto';

@Controller('datafetch')
export class DatafetchController {
  constructor(private readonly datafetchService: DatafetchService) {}

  @Post()
  create(@Body() createDatafetchDto: CreateDatafetchDto) {
    return this.datafetchService.create(createDatafetchDto);
  }

  @Get()
  findAll() {
    return this.datafetchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datafetchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatafetchDto: UpdateDatafetchDto) {
    return this.datafetchService.update(+id, updateDatafetchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datafetchService.remove(+id);
  }
}
