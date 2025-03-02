import { atom, useAtom } from "jotai";

// modalState
const createWorkspaceModalAtom = atom(false);

export const useCreateWorkspaceModal = () => {
	return useAtom(createWorkspaceModalAtom);
};
