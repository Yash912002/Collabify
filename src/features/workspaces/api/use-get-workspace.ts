import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

interface useGetWorkspaceProps {
	id: Id<"workspaces">;
}

export const useGetWorkspace = ({ id }: useGetWorkspaceProps) => {
	const data = useQuery(api.workspaces.getById, { id });

	const isLoading = data === undefined;

	return {
		data,
		isLoading,
	};
};
