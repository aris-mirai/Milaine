/**
 * Config loader
 */

import * as fs from 'fs';
import { URL } from 'url';
import * as yaml from 'js-yaml';
import { Source, Mixin, Icons } from './types';
import * as meta from '../meta.json';

/**
 * Path of configuration directory
 */
const dir = `${__dirname}/../../.config`;

/**
 * Path of configuration file
 */
const path = process.env.NODE_ENV == 'test'
	? `${dir}/test.yml`
	: `${dir}/default.yml`;

export default function load() {
	// eslint-disable-next-line node/no-sync
	const config = yaml.load(fs.readFileSync(path, 'utf-8')) as Source;

	const mixin = {} as Mixin;

	const url = validateUrl(config.url);

	config.url = normalizeUrl(config.url);

	config.port = config.port || parseInt(process.env.PORT || '', 10);

	config.proxyRemoteFiles = !config.proxyRemoteFiles === false;

	const icons = {
		favicon: {
			url: '/favicon.ico',
			type: 'image/x-icon'
		},
		appleTouchIcon: {
			url: '/apple-touch-icon.png'
		},
		manifest192: {
			url: '/assets/icons/192.png'
		},
		manifest512: {
			url: '/assets/icons/512.png'
		}
	} as Icons;

	if (config.icons) {
		Object.assign(icons, config.icons);
	}

	config.icons = icons;

	mixin.version = meta.version;
	mixin.host = url.host;
	mixin.hostname = url.hostname;
	mixin.scheme = url.protocol.replace(/:$/, '');
	mixin.wsScheme = mixin.scheme.replace('http', 'ws');
	mixin.wsUrl = `${mixin.wsScheme}://${mixin.host}`;
	mixin.apiUrl = `${mixin.scheme}://${mixin.host}/api`;
	mixin.authUrl = `${mixin.scheme}://${mixin.host}/auth`;
	mixin.driveUrl = `${mixin.scheme}://${mixin.host}/files`;
	mixin.userAgent = `Misskey/${meta.version} (${config.url})`;

	if (config.autoAdmin == null) config.autoAdmin = false;

	if (!config.redis.prefix) config.redis.prefix = mixin.host;

	return Object.assign(config, mixin);
}

function tryCreateUrl(url: string) {
	try {
		return new URL(url);
	} catch (e) {
		throw `url="${url}" is not a valid URL.`;
	}
}

function validateUrl(url: string) {
	const result = tryCreateUrl(url);
	if (result.pathname.replace('/', '').length) throw `url="${url}" is not a valid URL, has a pathname.`;
	if (!url.includes(result.host)) throw `url="${url}" is not a valid URL, has an invalid hostname.`;
	return result;
}

function normalizeUrl(url: string) {
	return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
}
