import { PartialType } from '@nestjs/mapped-types';
import { CreateDatafetchDto } from './create-datafetch.dto';

export class UpdateDatafetchDto extends PartialType(CreateDatafetchDto) {}
