import { ContractType, Employment, Job } from './types';

export class Repository {
	public all(personId?: string): Employment[] {
		if (personId) {
			const employment = employments.find((e) => e.personId === personId);
			return employment ? [employment] : [];
		}
		return employments;
	}
}

const jobs: Job[] = [
	{
		id: '89158674-5884-4dfc-b26c-692f1a4376ac',
		title: 'Engineering Manager',
		description:
			'Designs, implements, and refines product development, testing, and manufacturing processes.',
	},
	{
		id: 'f3354d94-d6fb-4f41-8150-e84edace4eaf',
		title: 'Software Engineer',
		description: 'Designs, builds and ships software.',
	},
];

const employments: Employment[] = [
	{
		personId: 'ae7b5792-319a-44dc-9157-e6989076731d',
		job: jobs[0],
		contractType: ContractType.Full_Time,
		salary: 5000,
	},
	{
		personId: '0d70cc2f-7a2a-4961-b8e0-418ff467708b',
		job: jobs[1],
		contractType: ContractType.Part_Time,
		salary: 1500,
	},
	{
		personId: 'ac375b65-ccae-4304-ac09-134c338a2ca4',
		job: jobs[1],
		contractType: ContractType.Full_Time,
		salary: 3000,
	},
];
