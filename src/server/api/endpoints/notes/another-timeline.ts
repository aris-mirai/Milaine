import $ from 'cafy';
import ID, { transform } from '../../../../misc/cafy-id';
import { getFriendIds } from '../../common/get-friends';
import define from '../../define';
import { getHideUserIds } from '../../common/get-hide-users';
import { getPackedTimeline } from '../../common/get-timeline';

export const meta = {
	desc: {
		'ja-JP': 'タイムラインを取得します。',
		'en-US': 'Get timeline of myself.'
	},

	tags: ['notes'],

	requireCredential: true,

	params: {
		limit: {
			validator: $.optional.num.range(1, 100),
			default: 10,
			desc: {
				'ja-JP': '最大数'
			}
		},

		sinceId: {
			validator: $.optional.type(ID),
			transform: transform,
			desc: {
				'ja-JP': '指定すると、この投稿を基点としてより新しい投稿を取得します'
			}
		},

		untilId: {
			validator: $.optional.type(ID),
			transform: transform,
			desc: {
				'ja-JP': '指定すると、この投稿を基点としてより古い投稿を取得します'
			}
		},

		sinceDate: {
			validator: $.optional.num,
			desc: {
				'ja-JP': '指定した時間を基点としてより新しい投稿を取得します。数値は、1970年1月1日 00:00:00 UTC から指定した日時までの経過時間をミリ秒単位で表します。'
			}
		},

		untilDate: {
			validator: $.optional.num,
			desc: {
				'ja-JP': '指定した時間を基点としてより古い投稿を取得します。数値は、1970年1月1日 00:00:00 UTC から指定した日時までの経過時間をミリ秒単位で表します。'
			}
		},

		withFiles: {
			validator: $.optional.bool,
			desc: {
				'ja-JP': 'true にすると、ファイルが添付された投稿だけ取得します'
			}
		},

		fileType: {
			validator: $.optional.arr($.str),
			desc: {
				'ja-JP': '指定された種類のファイルが添付された投稿のみを取得します'
			}
		},

		excludeNsfw: {
			validator: $.optional.bool,
			default: false,
			desc: {
				'ja-JP': 'true にすると、NSFW指定されたファイルを除外します(fileTypeが指定されている場合のみ有効)'
			}
		},

		excludeSfw: {
			validator: $.optional.bool,
			default: false,
			desc: {
				'ja-JP': 'true にすると、NSFW指定されてないファイルを除外します(fileTypeが指定されている場合のみ有効)'
			}
		},

		mediaOnly: {
			validator: $.optional.bool,
			deprecated: true,
			desc: {
				'ja-JP': 'true にすると、ファイルが添付された投稿だけ取得します (このパラメータは廃止予定です。代わりに withFiles を使ってください。)'
			}
		},
	},

	res: {
		type: 'array',
		items: {
			type: 'Note',
		},
	},
};

export default define(meta, async (ps, user) => {
	const [followingIds, hideUserIds] = await Promise.all([
		// フォローを取得
		// Fetch following
		getFriendIds(user._id, true),

		// 隠すユーザーを取得
		getHideUserIds(user, false),
	]);

	//#region Construct query
	const sort = {
		_id: -1
	};

	const notFollowQuery = [{
		userId: { $nin: followingIds }
	}];

	const visibleQuery = [{
		visibility: { $in: [ 'public' ] }
	}];

	const query = {
		$and: [{
			deletedAt: null,

			$and: [{
				// フォローしてない人の投稿
				$or: notFollowQuery
			}, {
				// visible for me
				$or: visibleQuery
			}],

			// mute
			'_reply.userId': {
				$nin: hideUserIds
			},
			'_renote.userId': {
				$nin: hideUserIds
			},
		}]
	} as any;

	query.$and.push({
		$or: [{
			replyId: null	// normal post
		}, {
			$expr: { $eq: ['$_reply.userId', '$userId'] }
		}]
	});

	query.$and.push({
		$or: [{
			renoteId: null
		}, {
			text: { $ne: null }
		}, {
			fileIds: { $ne: [] }
		}, {
			poll: { $ne: null }
		}]
	});

	const withFiles = ps.withFiles != null ? ps.withFiles : ps.mediaOnly;

	if (withFiles) {
		query.$and.push({
			fileIds: { $exists: true, $ne: [] }
		});
	}

	if (ps.fileType) {
		query.fileIds = { $exists: true, $ne: [] };

		query['_files.contentType'] = {
			$in: ps.fileType
		};

		if (ps.excludeNsfw) {
			query['_files.metadata.isSensitive'] = {
				$ne: true
			};
			query['cw'] = null;
		}

		if (ps.excludeSfw) {
			query['_files.metadata.isSensitive'] = true;
		}
	}

	if (ps.sinceId) {
		sort._id = 1;
		query._id = {
			$gt: ps.sinceId
		};
	} else if (ps.untilId) {
		query._id = {
			$lt: ps.untilId
		};
	} else if (ps.sinceDate) {
		sort._id = 1;
		query.createdAt = {
			$gt: new Date(ps.sinceDate)
		};
	} else if (ps.untilDate) {
		query.createdAt = {
			$lt: new Date(ps.untilDate)
		};
	}
	//#endregion

	return await getPackedTimeline(user, query, sort, ps.limit!);
});
