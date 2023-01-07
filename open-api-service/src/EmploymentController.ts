import { Controller, Get, OperationId, Query, Route } from 'tsoa';

import { Repository } from './repository';
import { Employment } from './types';

@Route('employment')
export class EmploymentController extends Controller {
	repository: Repository;

	constructor() {
		super();
		this.repository = new Repository();
	}

	@Get('/')
	@OperationId('employments')
	public async employments(@Query() personId?: string): Promise<Employment[]> {
		return this.repository.all(personId);
	}
}
