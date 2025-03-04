import config from '../../../config';
import { v4 as uuid } from 'uuid';
import { IActivity } from '../type';
import { LdSignature } from '../misc/ld-signature';
import { ILocalUser } from '../../../models/user';

export const renderActivity = (x: any): IActivity | null => {
	if (x == null) return null;

	if (x !== null && typeof x === 'object' && x.id == null) {
		x.id = `${config.url}/${uuid()}`;
	}

	return Object.assign({
		'@context': [
			'https://www.w3.org/ns/activitystreams',
			'https://w3id.org/security/v1',
			{
				// as non-standards
				manuallyApprovesFollowers: 'as:manuallyApprovesFollowers',
				sensitive: 'as:sensitive',
				Hashtag: 'as:Hashtag',
				// Mastodon
				toot: 'http://joinmastodon.org/ns#',
				Emoji: 'toot:Emoji',
				featured: 'toot:featured',
				discoverable: 'toot:discoverable',
				// schema
				schema: 'http://schema.org#',
				PropertyValue: 'schema:PropertyValue',
				value: 'schema:value',
				// Misskey
				misskey: 'https://misskey-hub.net/ns#',
				'_misskey_content': 'misskey:_misskey_content',
				'_misskey_quote': 'misskey:_misskey_quote',
				'_misskey_reaction': 'misskey:_misskey_reaction',
				'_misskey_votes': 'misskey:_misskey_votes',
				'isCat': 'misskey:isCat',
				// vcard
				vcard: 'http://www.w3.org/2006/vcard/ns#',
				// Fedibird
				fedibird: 'http://fedibird.com/ns#',
				quoteUri: 'fedibird:quoteUri',
				searchableBy: { '@id': 'fedibird:searchableBy', '@type': '@id' },
			}
		]
	}, x);
};

export const attachLdSignature = async (activity: any, user: ILocalUser): Promise<IActivity | null> => {
	if (activity == null) return null;

	const ldSignature = new LdSignature();
	ldSignature.debug = false;
	activity = await ldSignature.signRsaSignature2017(activity, user.keypair, `${config.url}/users/${user._id}#main-key`);

	return activity;
};
