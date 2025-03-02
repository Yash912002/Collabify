import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

const generateJoinCode = () => {
	const code = Array.from(
		{ length: 6 },
		() => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
	).join("");

	return code;
};

export const join = mutation({
	args: {
		joinCode: v.string(),
		workspaceId: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Get the entire workspace
		const workspace = await ctx.db.get(args.workspaceId);

		if (!workspace) {
			throw new Error("Workspace not found");
		}

		// Check whether the joincode is valid or not
		if (workspace.joinCode !== args.joinCode.toLowerCase()) {
			throw new Error("Invalid join code");
		}

		// Check if the person is already an existing member of the workspace
		const existingMember = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (existingMember) {
			throw new Error("Already an active member of the workspace");
		}

		// Insert the document inside members
		await ctx.db.insert("members", {
			userId,
			workspaceId: workspace._id,
			role: "member",
		});

		return workspace._id;
	},
});

export const newJoinCode = mutation({
	args: {
		workspaceId: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const newJoinCode = generateJoinCode();

		await ctx.db.patch(args.workspaceId, {
			joinCode: newJoinCode,
		});

		return args.workspaceId;
	},
});

// Create a new workspace
export const create = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const joinCode = generateJoinCode();

		// Insert the workspace into the database
		const workspaceId = await ctx.db.insert("workspaces", {
			name: args.name,
			userId,
			joinCode,
		});

		// Add the user as an admin of the workspace
		await ctx.db.insert("members", {
			userId,
			workspaceId,
			role: "admin",
		});

		await ctx.db.insert("channels", {
			name: "general",
			workspaceId,
		});

		return workspaceId;
	},
});

export const get = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return [];
		}

		// returns all workspaces that the user is a member of
		const members = await ctx.db
			.query("members")
			.withIndex("by_user_id", (q) => q.eq("userId", userId))
			.collect();

		// Extract workspaceIds from members
		const workspaceIds = members.map((member) => member.workspaceId);

		const workspaces = [];

		// Fetch workspace details for each workspaceId
		for (const workspaceId of workspaceIds) {
			const workspace = await ctx.db.get(workspaceId);

			if (workspace) {
				workspaces.push(workspace);
			}
		}

		return workspaces;
	},
});

export const getInfoById = query({
	args: { id: v.id("workspaces") },

	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return null;
		}

		// ! Comment or delete this code as per the need
		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.id).eq("userId", userId)
			)
			.unique();

		const workspace = await ctx.db.get(args.id);

		return {
			name: workspace?.name,
			isMember: !!member,
		};
	},
});

export const getById = query({
	args: { id: v.id("workspaces") },

	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Check if the user is a member of the workspace
		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.id).eq("userId", userId)
			)
			.unique();

		if (!member) {
			return null;
		}

		// returns the workspace with the given id
		return await ctx.db.get(args.id);
	},
});

export const update = mutation({
	args: {
		id: v.id("workspaces"),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Check if the user is a member of the workspace
		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.id).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(args.id, {
			name: args.name,
		});

		return args.id;
	},
});

export const remove = mutation({
	args: {
		id: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Check if the user is a member of the workspace
		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.id).eq("userId", userId)
			)
			.unique();

		if (!member || member.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const [members, channels, conversations, messages, reactions] =
			await Promise.all([
				ctx.db
					.query("members")
					.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
					.collect(),
				ctx.db
					.query("channels")
					.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
					.collect(),
				ctx.db
					.query("conversations")
					.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
					.collect(),
				ctx.db
					.query("messages")
					.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
					.collect(),
				ctx.db
					.query("reactions")
					.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
					.collect(),
			]);

		for (const member of members) {
			await ctx.db.delete(member._id);
		}

		for (const channel of channels) {
			await ctx.db.delete(channel._id);
		}

		for (const conversation of conversations) {
			await ctx.db.delete(conversation._id);
		}

		for (const message of messages) {
			await ctx.db.delete(message._id);
		}

		for (const reaction of reactions) {
			await ctx.db.delete(reaction._id);
		}

		await ctx.db.delete(args.id);

		return args.id;
	},
});
