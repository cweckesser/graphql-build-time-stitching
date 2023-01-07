import { AddressType, Person } from './generated/resolver-types';

export const resolvers = {
	Query: {
		people: async (): Promise<Person[]> => {
			return people;
		},
	},
};

const people: Person[] = [
	{
		id: 'ae7b5792-319a-44dc-9157-e6989076731d',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		dateOfBirth: new Date('1988-06-17'),
		addresses: [
			{
				id: 'a8e46afc-0e74-4715-828c-45d8327fd476',
				type: AddressType.Home,
				street: 'Fake St.',
				number: '123',
				apartment: '1A',
				city: 'Hoax City',
				state: 'Phony State',
				zipCode: 'ABC-123',
			},
			{
				id: '06e89157-b6f3-45ff-93a9-63d5e26b5f39',
				type: AddressType.Work,
				street: 'Forged St.',
				number: '456',
				apartment: '4',
				city: 'Mock City',
				state: 'Dummy State',
				zipCode: 'DEF-456',
			},
		],
	},
	{
		id: '0d70cc2f-7a2a-4961-b8e0-418ff467708b',
		firstName: 'James',
		lastName: 'Doe',
		email: 'james.doe@example.com',
		dateOfBirth: new Date('1972-10-08'),
	},
	{
		id: 'ac375b65-ccae-4304-ac09-134c338a2ca4',
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane.doe@example.com',
		dateOfBirth: new Date('1991-04-23'),
		addresses: [
			{
				id: '0f97b0d7-387b-45ad-b4c6-f1db0d42d36f',
				type: AddressType.Work,
				street: 'Fraud St.',
				number: '789',
				city: 'Counterfeit City',
				state: 'Pirate State',
				zipCode: 'GHI-789',
			},
		],
	},
];
