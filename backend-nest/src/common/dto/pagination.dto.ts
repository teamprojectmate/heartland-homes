import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const DEFAULT_PAGE_SIZE = 10;

export class PaginationDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	page: number = 0;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	size: number = DEFAULT_PAGE_SIZE;

	@IsOptional()
	@IsString()
	sort?: string;

	get skip(): number {
		return this.page * this.size;
	}
}

export class PaginatedResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;

	constructor(content: T[], totalElements: number, page: number, size: number) {
		this.content = content;
		this.page = page;
		this.size = size;
		this.totalElements = totalElements;
		this.totalPages = Math.ceil(totalElements / size);
	}
}
