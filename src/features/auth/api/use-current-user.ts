import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCurrentUser = () => {
	const data = useQuery(api.users.current);

	// null means user doesn't exists
	// undefined means user exists, but currently loading data
	const isLoading = data === undefined;

	return { data, isLoading };
};
