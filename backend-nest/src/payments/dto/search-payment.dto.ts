import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchPaymentDto extends PaginationDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	userId?: number;
}
