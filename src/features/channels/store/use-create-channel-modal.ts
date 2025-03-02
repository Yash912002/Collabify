import { atom, useAtom } from "jotai";

// modalState
const createChannelModalState = atom(false);

export const useCreateChannelModal = () => {
	return useAtom(createChannelModalState);
};
