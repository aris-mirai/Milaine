import renderImage from './image';
import renderKey from './key';
import config from '../../../config';
import { ILocalUser } from '../../../models/user';
import { toHtml } from '../../../mfm/to-html';
import { parseFull } from '../../../mfm/parse';
import DriveFile from '../../../models/drive-file';
import { getEmojis } from './note';
import renderEmoji from './emoji';
import { IIdentifier } from '../models/identifier';
import renderHashtag from './hashtag';

export default async (user: ILocalUser) => {
	const isSystem = !!user.username.match(/\./);

	const id = `${config.url}/users/${user._id}`;

	const [avatar, banner] = await Promise.all([
		DriveFile.findOne({ _id: user.avatarId }),
		DriveFile.findOne({ _id: user.bannerId })
	]);

	const attachment: {
		type: 'PropertyValue',
		name: string,
		value: string,
		identifier?: IIdentifier
	}[] = [];

	if (user.fields) {
		for (const field of user.fields) {
			attachment.push({
				type: 'PropertyValue',
				name: field.name,
				value: (field.value != null && field.value.match(/^https?:/))
					? `<a href="${new URL(field.value).href}" rel="me nofollow noopener" target="_blank">${new URL(field.value).href}</a>`
					: field.value
			});
		}
	}

	if (user.twitter) {
		attachment.push({
			type: 'PropertyValue',
			name: 'Twitter',
			value: `<a href="https://twitter.com/intent/user?user_id=${user.twitter.userId}" rel="me nofollow noopener" target="_blank"><span>@${user.twitter.screenName}</span></a>`,
			identifier: {
				type: 'PropertyValue',
				name: 'misskey:authentication:twitter',
				value: `${user.twitter.userId}@${user.twitter.screenName}`
			}
		});
	}

	if (user.github) {
		attachment.push({
			type: 'PropertyValue',
			name: 'GitHub',
			value: `<a href="https://github.com/${user.github.login}" rel="me nofollow noopener" target="_blank"><span>@${user.github.login}</span></a>`,
			identifier: {
				type: 'PropertyValue',
				name: 'misskey:authentication:github',
				value: `${user.github.id}@${user.github.login}`
			}
		});
	}

	if (user.discord) {
		attachment.push({
			type: 'PropertyValue',
			name: 'Discord',
			value: `<a href="https://discord.com/users/${user.discord.id}" rel="me nofollow noopener" target="_blank"><span>${user.discord.username}#${user.discord.discriminator}</span></a>`,
			identifier: {
				type: 'PropertyValue',
				name: 'misskey:authentication:discord',
				value: `${user.discord.id}@${user.discord.username}#${user.discord.discriminator}`
			}
		});
	}

	const emojis = await getEmojis(user.emojis);
	const apemojis = emojis.map(emoji => renderEmoji(emoji));

	const hashtagTags = (user.tags || []).map(tag => renderHashtag(tag));

	const tag = [
		...apemojis,
		...hashtagTags,
	];

	const person = {
		type: isSystem ? 'Application' : user.isBot ? 'Service' : 'Person',
		id,
		inbox: `${id}/inbox`,
		outbox: `${id}/outbox`,
		followers: `${id}/followers`,
		following: `${id}/following`,
		featured: `${id}/collections/featured`,
		sharedInbox: `${config.url}/inbox`,
		endpoints: { sharedInbox: `${config.url}/inbox` },
		url: `${config.url}/@${user.username}`,
		preferredUsername: user.username,
		name: user.name,
		summary: toHtml(parseFull(user.description ?? '')),
		icon: avatar && renderImage(avatar),
		image: banner && renderImage(banner),
		tag,
		manuallyApprovesFollowers: user.isLocked || user.carefulRemote,
		discoverable: !!user.isExplorable,
		searchableBy: user.searchableBy === 'none' ? [] : ['https://www.w3.org/ns/activitystreams#Public'],
		publicKey: renderKey(user, `#main-key`),
		isCat: user.isCat,
		attachment: attachment.length ? attachment : undefined,
	} as any;

	if (user.profile?.birthday) {
		person['vcard:bday'] = user.profile.birthday;
	}

	if (user.profile?.location) {
		person['vcard:Address'] = user.profile.location;
	}

	return person;
};
