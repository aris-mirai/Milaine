
export type ThinPackedNote = {
	id: string;
	createdAt: string | null;
	deletedAt: string | null;
	updatedAt: string | null;
	text: string | null
	cw: string | null;
	userId: string;
	user: PackedUser | null;
	replyId: string | null;
	renoteId: string | null;
	viaMobile: boolean;
	visibility: string;
	tags: string[];
	localOnly: boolean;
	copyOnce: boolean;
	score: number;
	renoteCount: number;
	quoteCount: number;
	repliesCount: number;
	reactions: Record<string, number>;	// Forward Compatibility
	reactionCounts: Record<string, number>;
	emojis: {
		name: string;
		url: string;
	}[];
	fileIds: string[];
	files: any;	// TODO
	uri: string | null;
	url: string | null;
	appId: string | null;
	app: any | null;	// TODO
}

export type PackedNote = ThinPackedNote & {
	reply?: PackedNote | null;
	renote?: PackedNote | null;
	poll?: any | null;	// TODO
	myReaction?: string | null;
	myRenoteId?: string | null;
};

export type ThinPackedUser = {
	id: string;
	username: string;
	name: string | null;
	host: string | null;
	avatarUrl: string | null;
	avatarColor: string | null;
	isAdmin: boolean;
	isBot: boolean;
	isCat: boolean;
	instance: any;	// TODO
	emojis: {
		name: string;
		url: string;
	}[];
};

export type PackedUser = ThinPackedUser & {
	createdAt?: string | null;
	updatedAt?: string | null;
	bannerUrl?: string | null;
	bannerColor?: string | null;
	isLocked?: boolean;
	isSilenced?: boolean;
	isSuspended?: boolean;
	description?: string | null;
	profile?: {
		birthday?: string | null;
		location?: string | null;
	};
	tags?: string[];
	fields?: {
		name: string;
		value: string;
	}[];
	followersCount?: number;
	followingCount?: number;
	notesCount?: number;
	pinnedNoteIds?: string[];
	pinnedNotes?: PackedNote[]
	movedToUser?: PackedUser | null;
	usertags?: string[];

	// local
	isVerified?: boolean;
	isModerator?: boolean;
	twoFactorEnabled?: boolean;
	twitter?: {
		screenName: string;
		userId: string;
	};
	github?: {
		id: string;
		login: string;
	};
	discord?: {
		id: string;
		username: string;
		discriminator: string;
	};

	// remote
	url?: string | null;
	uri?: string | null;

	// my
	avatarId?: string | null;
	bannerId?: string | null;
	alwaysMarkNsfw?: boolean;
	carefulBot?: boolean;
	carefulRemote?: boolean;
	carefulMassive?: boolean;
	refuseFollow?: boolean;
	autoAcceptFollowed?: boolean;
	avoidSearchIndex?: boolean;
	isExplorable?: boolean;
	hideFollows?: boolean;
	wallpaperId?: string | null;
	wallpaperUrl?: string | null;
	hasUnreadMessagingMessage?: boolean;
	hasUnreadNotification?: boolean;
	hasUnreadSpecifiedNotes?: boolean;
	hasUnreadMentions?: boolean;
	pendingReceivedFollowRequestsCount?: number;

	// my secrets
	email?: string | null;
	emailVerified?: boolean;

	// other
	isFollowing?: boolean;
	isFollowed?: boolean;
	hasPendingFollowRequestFromYou?: boolean;
	hasPendingFollowRequestToYou?: boolean;
	isBlocking?: boolean;
	isBlocked?: boolean;
	isMuted?: boolean;
	isHideRenoting?: boolean;

	/*
	movedToUserId?: string | null;
	autoWatch?: boolean;
	hasUnreadAnnouncement?: boolean;
	*/
}
