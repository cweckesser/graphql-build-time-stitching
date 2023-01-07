export interface Job {
	id: string;
	title: string;
	description: string;
}

export enum ContractType {
	Full_Time = 'FULL_TIME',
	Part_Time = 'PART_TIME',
}

export interface Employment {
	personId: string;
	job: Job;
	contractType: ContractType;
	salary: number;
}
