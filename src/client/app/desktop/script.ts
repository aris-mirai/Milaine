/**
 * Desktop Client
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// Style
import './style.styl';

import init from '../init';
import composeNotification from '../common/scripts/compose-notification';

import MkHome from './views/home/home.vue';
import MkDeck from '../common/views/deck/deck.vue';
import Ctx from './views/components/context-menu.vue';
import PostFormWindow from './views/components/post-form-window.vue';
import RenoteFormWindow from './views/components/renote-form-window.vue';
import MkChooseFileFromDriveWindow from './views/components/choose-file-from-drive-window.vue';
import MkChooseFolderFromDriveWindow from './views/components/choose-folder-from-drive-window.vue';
import MkHomeTimeline from './views/home/timeline.vue';
import Notification from './views/components/ui-notification.vue';

import { url } from '../config';
import MiOS from '../mios';

/**
 * init
 */
init(async (launch, os) => {
	Vue.mixin({
		methods: {
			$contextmenu(e, menu, opts?) {
				const o = opts || {};
				const vm = this.$root.new(Ctx, {
					menu,
					x: e.pageX - window.pageXOffset,
					y: e.pageY - window.pageYOffset,
				});
				vm.$once('closed', () => {
					if (o.closed) o.closed();
				});
			},

			$post(opts) {
				const o = opts || {};
				if (o.renote) {
					const vm = this.$root.new(RenoteFormWindow, {
						note: o.renote,
						animation: o.animation == null ? true : o.animation
					});
					if (o.cb) vm.$once('closed', o.cb);
				} else {
					const vm = this.$root.new(PostFormWindow, {
						reply: o.reply,
						airReply: o.airReply,
						mention: o.mention,
						animation: o.animation == null ? true : o.animation,
						initialText: o.initialText,
						instant: o.instant,
						initialNote: o.initialNote
					});
					if (o.cb) vm.$once('closed', o.cb);
				}
			},

			$chooseDriveFile(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};

					if (document.body.clientWidth > 800) {
						const w = this.$root.new(MkChooseFileFromDriveWindow, {
							title: o.title,
							type: o.type,
							multiple: o.multiple,
							initFolder: o.currentFolder
						});
						w.$once('selected', file => {
							res(file);
						});
					} else {
						window['cb'] = file => {
							res(file);
						};

						window.open(url + `/selectdrive?multiple=${o.multiple}`,
							'choose_drive_window',
							'height=500, width=800');
					}
				});
			},

			$chooseDriveFolder(opts) {
				return new Promise((res, rej) => {
					const o = opts || {};
					const w = this.$root.new(MkChooseFolderFromDriveWindow, {
						title: o.title,
						initFolder: o.currentFolder
					});
					w.$once('selected', folder => {
						res(folder);
					});
				});
			},

			$notify(message) {
				this.$root.new(Notification, {
					message
				});
			}
		}
	});

	// Register directives
	require('./views/directives');

	// Register components
	require('./views/components');
	require('./views/widgets');

	// Init router
	const router = new VueRouter({
		mode: 'history',
		routes: [
			os.store.state.device.inDeckMode
				? { path: '/', name: 'index', component: MkDeck, children: [
					{ path: '/@:user', component: () => import('../common/views/deck/deck.user-column.vue').then(m => m.default), children: [
						{ path: '', name: 'user', component: () => import('../common/views/deck/deck.user-column.home.vue').then(m => m.default) },
						{ path: 'following', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
						{ path: 'followers', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
					]},
					{ path: '/notes/:note', name: 'note', component: () => import('../common/views/deck/deck.note-column.vue').then(m => m.default) },
					{ path: '/search', component: () => import('../common/views/deck/deck.search-column.vue').then(m => m.default) },
					{ path: '/tags/:tag', name: 'tag', component: () => import('../common/views/deck/deck.hashtag-column.vue').then(m => m.default) },
					{ path: '/featured', name: 'featured', component: () => import('../common/views/deck/deck.featured-column.vue').then(m => m.default) },
					{ path: '/explore', name: 'explore', component: () => import('../common/views/deck/deck.explore-column.vue').then(m => m.default) },
					{ path: '/explore/tags/:tag', name: 'explore-tag', props: true, component: () => import('../common/views/deck/deck.explore-column.vue').then(m => m.default) },
					{ path: '/about', name: 'about', component: () => import('../common/views/deck/deck.about-column.vue').then(m => m.default) },
					{ path: '/i/favorites', component: () => import('../common/views/deck/deck.favorites-column.vue').then(m => m.default) },
					{ path: '/i/reactions', component: () => import('../common/views/deck/deck.reactions-column.vue').then(m => m.default) },
					{ path: '/i/pages', component: () => import('../common/views/pages/pages.vue').then(m => m.default) },
					{ path: '/@:username/pages/:pageName', name: 'page', props: true, component: () => import('../common/views/deck/deck.page-column.vue').then(m => m.default) },
				]}
				: { path: '/', component: MkHome, children: [
					{ path: '', name: 'index', component: MkHomeTimeline },
					{ path: '/@:user', component: () => import('./views/home/user/index.vue').then(m => m.default), children: [
						{ path: '', name: 'user', component: () => import('./views/home/user/user.home.vue').then(m => m.default) },
						{ path: 'following', component: () => import('../common/views/pages/following.vue').then(m => m.default) },
						{ path: 'followers', component: () => import('../common/views/pages/followers.vue').then(m => m.default) },
					]},
					{ path: '/notes/:note', name: 'note', component: () => import('./views/home/note.vue').then(m => m.default) },
					{ path: '/search', component: () => import('./views/home/search.vue').then(m => m.default) },
					{ path: '/tags/:tag', name: 'tag', component: () => import('./views/home/tag.vue').then(m => m.default) },
					{ path: '/featured', name: 'featured', component: () => import('./views/home/featured.vue').then(m => m.default) },
					{ path: '/explore', name: 'explore', component: () => import('../common/views/pages/explore.vue').then(m => m.default) },
					{ path: '/explore/tags/:tag', name: 'explore-tag', props: true, component: () => import('../common/views/pages/explore.vue').then(m => m.default) },
					{ path: '/about', name: 'about', component: () => import('../common/views/pages/about.vue').then(m => m.default) },
					{ path: '/i/favorites', component: () => import('./views/home/favorites.vue').then(m => m.default) },
					{ path: '/i/reactions', component: () => import('./views/home/reactions.vue').then(m => m.default) },
					{ path: '/i/pages', component: () => import('../common/views/pages/pages.vue').then(m => m.default) },
					{ path: '/i/pages/new', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default) },
					{ path: '/i/pages/edit/:pageId', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initPageId: route.params.pageId }) },
					{ path: '/@:user/pages/:page', component: () => import('../common/views/pages/page.vue').then(m => m.default), props: route => ({ pageName: route.params.page, username: route.params.user }) },
					{ path: '/@:user/pages/:pageName/view-source', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initUser: route.params.user, initPageName: route.params.pageName }) },
				]},
			{ path: '/i/pages/new', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default) },
			{ path: '/i/pages/edit/:pageId', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initPageId: route.params.pageId }) },
			{ path: '/@:user/pages/:pageName/view-source', component: () => import('../common/views/pages/page-editor/page-editor.vue').then(m => m.default), props: route => ({ initUser: route.params.user, initPageName: route.params.pageName }) },
			{ path: '/i/messaging/:user', component: () => import('./views/pages/messaging-room.vue').then(m => m.default) },
			{ path: '/i/drive', component: () => import('./views/pages/drive.vue').then(m => m.default) },
			{ path: '/i/drive/folder/:folder', component: () => import('./views/pages/drive.vue').then(m => m.default) },
			{ path: '/i/settings', redirect: '/i/settings/profile' },
			{ path: '/i/settings/:page', component: () => import('./views/pages/settings.vue').then(m => m.default) },
			{ path: '/selectdrive', component: () => import('./views/pages/selectdrive.vue').then(m => m.default) },
			{ path: '/@:acct/room', props: true, component: () => import('../common/views/pages/room/room.vue').then(m => m.default) },
			{ path: '/share', component: () => import('../common/views/pages/share.vue').then(m => m.default) },
			{ path: '/intent/tweet', component: () => import('../common/views/pages/share.vue').then(m => m.default) },
			{ path: '/games/reversi/:game?', component: () => import('./views/pages/games/reversi.vue').then(m => m.default) },
			{ path: '/authorize-follow', component: () => import('../common/views/pages/follow.vue').then(m => m.default) },
			{ path: '/reset-password/:token', props: true, component: () => import('../common/views/pages/reset-password.vue').then(m => m.default) },
			{ path: '/mfm-cheat-sheet', component: () => import('../common/views/pages/mfm-cheat-sheet.vue').then(m => m.default) },
			{ path: '/deck', redirect: '/' },
			{ path: '*', component: () => import('../common/views/pages/not-found.vue').then(m => m.default) },
		],
		scrollBehavior(to, from, savedPosition) {
			return { x: 0, y: 0 };
		}
	});

	// Launch the app
	const [app, _] = launch(router);

	/**
	 * Init Notification
	 */
	if ('Notification' in window && os.store.getters.isSignedIn) {
		// 許可を得ていなかったらリクエスト
		if ((Notification as any).permission == 'default') {
			await Notification.requestPermission();
		}

		if ((Notification as any).permission == 'granted') {
			registerNotifications(os);
		}
	}
}, true);

function registerNotifications(os: MiOS) {
	const stream = os.stream;

	if (stream == null) return;

	const connection = stream.useSharedConnection('main');

	connection.on('notification', notification => {
		const _n = composeNotification('notification', notification);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
		setTimeout(n.close.bind(n), 6000);
	});

	connection.on('driveFileCreated', file => {
		const _n = composeNotification('driveFileCreated', file);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
		setTimeout(n.close.bind(n), 5000);
	});

	connection.on('unreadMessagingMessage', message => {
		const _n = composeNotification('unreadMessagingMessage', message);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
		n.onclick = () => {
			n.close();
			/*(riot as any).mount(document.body.appendChild(document.createElement('mk-messaging-room-window')), {
				user: message.user
			});*/
		};
		setTimeout(n.close.bind(n), 7000);
	});

	connection.on('reversiInvited', matching => {
		const _n = composeNotification('reversiInvited', matching);
		const n = new Notification(_n.title, {
			body: _n.body,
			icon: _n.icon
		});
	});
}
