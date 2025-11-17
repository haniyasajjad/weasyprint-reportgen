import { PartialType } from '@nestjs/mapped-types';
import { CreateReportgenDto } from './create-reportgen.dto';

export class UpdateReportgenDto extends PartialType(CreateReportgenDto) {}
