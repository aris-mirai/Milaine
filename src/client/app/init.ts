/**
 * App initializer
 */

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VAnimateCss from 'v-animate-css';
import VModal from 'vue-js-modal';
import VueI18n from 'vue-i18n';
import Vue2TouchEvents from 'vue2-touch-events'
import SequentialEntrance from 'vue-sequential-entrance';
import * as hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

import VueHotkey from './common/hotkey';
import VueSize from './common/size';
import App from './app.vue';
import checkForUpdate from './common/scripts/check-for-update';
import MiOS from './mios';
import { version, codename, lang, locale } from './config';
import { builtinThemes, applyTheme, lightTheme } from './theme';
import Dialog from './common/views/components/dialog.vue';

import i18n from './i18n';

if (localStorage.getItem('theme') == null) {
	applyTheme(lightTheme);
}

//#region FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';

// Imports for Font Awesome solid
import {
	faAngleDown,
	faAngleRight,
	faAngleUp,
	faArrowLeft,
	faArrowRight,
	faAt,
	faBan,
	faBars,
	faBirthdayCake,
	faBroadcastTower,
	faCalculator,
	faCamera,
	faCaretDown,
	faCaretRight,
	faChartBar,
	faChartLine,
	faChartPie,
	faCheck,
	faChevronCircleLeft,
	faChevronCircleRight,
	faCircle,
	faCloud,
	faCog,
	faCogs,
	faColumns,
	faComments,
	faDesktop,
	faDownload,
	faEllipsisH,
	faEllipsisV,
	faEnvelope,
	faExclamationCircle,
	faExclamationTriangle,
	faExternalLinkSquareAlt,
	faEye,
	faFileImage,
	faFileImport,
	faFolder,
	faFolderOpen,
	faGamepad,
	faGavel,
	faGlobe,
	faHashtag,
	faHeart,
	faHome,
	faHourglassHalf,
	faICursor,
	faImage,
	faInfoCircle,
	faKey,
	faLanguage,
	faLink,
	faList,
	faLock,
	faMapMarker,
	faMapMarkerAlt,
	faMemory,
	faMicrochip,
	faMinus,
	faMobileAlt,
	faMoon,
	faPalette,
	faPaperPlane,
	faPencilAlt,
	faPlus,
	faPollH,
	faPowerOff,
	faPuzzlePiece,
	faQuoteLeft,
	faQuoteRight,
	faReply,
	faReplyAll,
	faRetweet,
	faRobot,
	faRssSquare,
	faSearch,
	faServer,
	faShareAlt,
	faSignInAlt,
	faSlidersH,
	faSort,
	faSpinner,
	faStar,
	faStickyNote,
	faSync,
	faSyncAlt,
	faTerminal,
	faThumbtack,
	faTimes,
	faUndoAlt,
	faUnlock,
	faUnlockAlt,
	faUpload,
	faUser,
	faUserClock,
	faUserPlus,
	faUsers,
	faVolumeUp,
	faWrench
} from '@fortawesome/free-solid-svg-icons';

// Imports for Font Awesome regular
import {
	faBell as farBell,
	faCalendarAlt as farCalendarAlt,
	faChartBar as farChartBar,
	faClock as farClock,
	faCommentAlt as farCommentAlt,
	faComments as farComments,
	faComment as farComment,
	faEnvelope as farEnvelope,
	faEyeSlash as farEyeSlash,
	faFolder as farFolder,
	faFolderOpen as farFolderOpen,
	faHdd as farHdd,
	faImages as farImages,
	faLaugh as farLaugh,
	faLightbulb as farLightbulb,
	faMoon as farMoon,
	faPlayCircle as farPlayCircle,
	faSave as farSave,
	faSmile as farSmile,
	faStickyNote as farStickyNote,
	faTrashAlt as farTrashAlt,
	faWindowRestore as farWindowRestore
} from '@fortawesome/free-regular-svg-icons';

// Imports for Font Awesome brands
import {
	faDiscord as fabDiscord,
	faGithub as fabGithub,
	faTwitter as fabTwitter
} from '@fortawesome/free-brands-svg-icons';

library.add(
	faAngleDown,
	faAngleRight,
	faAngleUp,
	faArrowLeft,
	faArrowRight,
	faAt,
	faBan,
	faBars,
	faBirthdayCake,
	faBroadcastTower,
	faCalculator,
	faCamera,
	faCaretDown,
	faCaretRight,
	faChartBar,
	faChartLine,
	faChartPie,
	faCheck,
	faChevronCircleLeft,
	faChevronCircleRight,
	faCircle,
	faCloud,
	faCog,
	faCogs,
	faColumns,
	faComments,
	faDesktop,
	faDownload,
	faEllipsisH,
	faEllipsisV,
	faEnvelope,
	faExclamationCircle,
	faExclamationTriangle,
	faExternalLinkSquareAlt,
	faEye,
	faFileImage,
	faFileImport,
	faFolder,
	faFolderOpen,
	faGamepad,
	faGavel,
	faGlobe,
	faHashtag,
	faHeart,
	faHome,
	faHourglassHalf,
	faICursor,
	faImage,
	faInfoCircle,
	faKey,
	faLanguage,
	faLink,
	faList,
	faLock,
	faMapMarker,
	faMapMarkerAlt,
	faMemory,
	faMicrochip,
	faMinus,
	faMobileAlt,
	faMoon,
	faPalette,
	faPaperPlane,
	faPencilAlt,
	faPlus,
	faPollH,
	faPowerOff,
	faPuzzlePiece,
	faQuoteLeft,
	faQuoteRight,
	faReply,
	faReplyAll,
	faRetweet,
	faRobot,
	faRssSquare,
	faSearch,
	faServer,
	faShareAlt,
	faSignInAlt,
	faSlidersH,
	faSort,
	faSpinner,
	faStar,
	faStickyNote,
	faSync,
	faSyncAlt,
	faTerminal,
	faThumbtack,
	faTimes,
	faUndoAlt,
	faUnlock,
	faUnlockAlt,
	faUpload,
	faUser,
	faUserClock,
	faUserPlus,
	faUsers,
	faVolumeUp,
	faWrench,
	farBell,
	farCalendarAlt,
	farChartBar,
	farClock,
	farCommentAlt,
	farComments,
	farComment,
	farEnvelope,
	farEyeSlash,
	farFolder,
	farFolderOpen,
	farHdd,
	farImages,
	farLaugh,
	farLightbulb,
	farMoon,
	farPlayCircle,
	farSave,
	farSmile,
	farStickyNote,
	farTrashAlt,
	farWindowRestore,
	fabDiscord,
	fabGithub,
	fabTwitter
);
//#endregion

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VAnimateCss, { animateCSSPath: '/assets/animate.min.css?3.5.1' });
Vue.use(VModal);
Vue.use(VueHotkey);
Vue.use(VueSize);
Vue.use(VueI18n);
Vue.use(SequentialEntrance);
Vue.use(hljs.vuePlugin);
Vue.use(Vue2TouchEvents);

Vue.component('fa', FontAwesomeIcon);
Vue.component('fa-layers', FontAwesomeLayers);

// Register global directives
require('./common/views/directives');

// Register global components
require('./common/views/components');
require('./common/views/widgets');

// Register global filters
require('./common/views/filters');

Vue.mixin({
	methods: {
		destroyDom() {
			this.$destroy();

			if (this.$el.parentNode) {
				this.$el.parentNode.removeChild(this.$el);
			}
		}
	}
});

/**
 * APP ENTRY POINT!
 */

console.info(`Misskey v${version} (${codename})`);
console.info(
	`%c${locale['common']['do-not-copy-paste']}`,
	'color: red; background: yellow; font-size: 16px; font-weight: bold;');

// BootTimer解除
window.clearTimeout((window as any).mkBootTimer);
delete (window as any).mkBootTimer;

//#region Set lang attr
const html = document.documentElement;
html.setAttribute('lang', lang);
//#endregion

// iOSでプライベートモードだとlocalStorageが使えないので既存のメソッドを上書きする
try {
	localStorage.setItem('kyoppie', 'yuppie');
} catch (e) {
	Storage.prototype.setItem = () => { }; // noop
}

// クライアントを更新すべきならする
if (localStorage.getItem('should-refresh') == 'true') {
	localStorage.removeItem('should-refresh');
	location.reload(true);
}

// MiOSを初期化してコールバックする
export default (callback: (launch: (router: VueRouter) => [Vue, MiOS], os: MiOS) => void, sw = false) => {
	const os = new MiOS(sw);

	os.init(() => {
		// アプリ基底要素マウント
		document.body.innerHTML = '<div id="app"></div>';

		const launch = (router: VueRouter) => {
			//#region theme
			os.store.watch(s => {
				return s.device.darkmode;
			}, v => {
				const themes = os.store.state.device.themes.concat(builtinThemes);
				const dark = themes.find(t => t.id == os.store.state.device.darkTheme);
				const light = themes.find(t => t.id == os.store.state.device.lightTheme);
				applyTheme(v ? dark : light);
			});
			os.store.watch(s => {
				return s.device.lightTheme;
			}, v => {
				const themes = os.store.state.device.themes.concat(builtinThemes);
				const theme = themes.find(t => t.id == v);
				if (!os.store.state.device.darkmode) {
					applyTheme(theme);
				}
			});
			os.store.watch(s => {
				return s.device.darkTheme;
			}, v => {
				const themes = os.store.state.device.themes.concat(builtinThemes);
				const theme = themes.find(t => t.id == v);
				if (os.store.state.device.darkmode) {
					applyTheme(theme);
				}
			});
			//#endregion

			// Reapply current theme
			try {
				const themeName = os.store.state.device.darkmode ? os.store.state.device.darkTheme : os.store.state.device.lightTheme;
				const themes = os.store.state.device.themes.concat(builtinThemes);
				const theme = themes.find(t => t.id == themeName);
				if (theme) {
					applyTheme(theme);
				}
			} catch (e) {
				console.log(`Cannot reapply theme. ${e}`);
			}

			//#region line width
			document.documentElement.style.setProperty('--lineWidth', `1px`);
			//#endregion

			document.addEventListener('visibilitychange', () => {
				if (!document.hidden) {
					os.store.commit('clearBehindNotes');
				}
			}, false);

			window.addEventListener('scroll', () => {
				if (window.scrollY <= 8) {
					os.store.commit('clearBehindNotes');
				}
			}, { passive: true });

			const app = new Vue({
				i18n: i18n(),
				store: os.store,
				data() {
					return {
						os: {
							windows: os.windows
						},
						stream: os.stream,
						instanceName: os.instanceName
					};
				},
				methods: {
					api: os.api,
					getMeta: os.getMeta,
					getMetaSync: os.getMetaSync,
					signout: os.signout,
					new(vm, props) {
						const x = new vm({
							parent: this,
							propsData: props
						}).$mount();
						document.body.appendChild(x.$el);
						return x;
					},
					dialog(opts) {
						const vm = this.new(Dialog, opts);
						return new Promise((res) => {
							vm.$once('ok', result => res({ canceled: false, result }));
							vm.$once('cancel', () => res({ canceled: true }));
						});
					}
				},
				router,
				render: createEl => createEl(App)
			});

			os.app = app;

			// マウント
			app.$mount('#app');

			//#region 更新チェック
			setTimeout(() => {
				checkForUpdate(app);
			}, 3000);
			//#endregion

			return [app, os] as [Vue, MiOS];
		};

		// Deck mode
		os.store.commit('device/set', {
			key: 'inDeckMode',
			value: os.store.getters.isSignedIn && os.store.state.device.deckMode
				&& (document.location.pathname === '/' || window.performance.navigation.type === 1)
		});

		callback(launch, os);
	});
};
