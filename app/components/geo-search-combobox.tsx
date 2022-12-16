import { z } from 'zod'
import { SearchCombobox, type SearchComboboxProps } from './search-combobox'

export type GeoItem = {
	id: string
	displayName: string
	distance?: number | null
}

export type BaseOptions = Pick<
	SearchComboboxProps<GeoItem>,
	'selectedItem' | 'exclude' | 'onChange'
> & {
	geolocation: { lat: number; long: number } | null
}

const NullableNumber = z
	.string()
	.optional()
	.transform(s => {
		const number = s ? Number(s) : null
		return number === null || Number.isNaN(number) ? null : number
	})

export const SearchParamsSchema = z.object({
	query: z.string().default(''),
	lat: NullableNumber,
	long: NullableNumber,
	exclude: z.array(z.string()).default([]),
})

export function GeoSearchCombobox({
	geolocation,
	...props
}: BaseOptions & {
	label: string
	resourceUrl: string
}) {
	return (
		<SearchCombobox
			{...props}
			itemToKey={item => item.id}
			itemToString={item => item?.displayName ?? ''}
			additionalSearchParams={
				geolocation
					? {
							lat: geolocation.lat.toString(),
							long: geolocation.long.toString(),
					  }
					: null
			}
			renderItemInList={item => (
				<>
					{item.displayName}{' '}
					{item.distance ? `(${item.distance.toFixed(2)}mi)` : null}
				</>
			)}
		/>
	)
}
