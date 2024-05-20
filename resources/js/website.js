import SocialSharing from 'vue-social-sharing';
import VueClipboard from 'vue-clipboard2';
import VueRouter from 'vue-router';
import Helpers from './services/Helpers';
import VueAnalytics from 'vue-analytics';
import {loadStripe} from '@stripe/stripe-js/pure';
import Home from "./pages/Home";
import Alert from "./components/elements/Alert";
import EmailMe from "./components/elements/EmailMe";
import InlineSvg from "./components/elements/InlineSvg";
import Purchase from "./components/elements/Purchase";
import Modal from "./components/modals/Modal";
import Checkbox from "./components/elements/Checkbox";
import ShareIcons from "./components/elements/ShareIcons";
import Toast from "./components/elements/Toast";
import Webp from "./components/elements/Webp";
import TopMenu from "./pages/sections/TopMenu";
import SiteFooter from "./pages/sections/SiteFooter";
import BecomePatronButton from "./components/elements/BecomePatronButton";
import Vue from 'vue';
import VueI18n from "vue-i18n";
import i18nEn from "./lang/en/en";

window.Vue = Vue;
window.axios = require('axios').create();

Vue.use(SocialSharing);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

// Vue components
Vue.component('alert', Alert);
Vue.component('email-me', EmailMe);
Vue.component('inline-svg', InlineSvg);
Vue.component('purchase', Purchase);
Vue.component('modal', Modal);
Vue.component('checkbox', Checkbox);
Vue.component('share-icons', ShareIcons);
Vue.component('toast', Toast);
Vue.component('webp', Webp);
Vue.component('becomePatronButton', BecomePatronButton);

// Vue page sections
Vue.component('top-menu', TopMenu);
Vue.component('site-footer', SiteFooter);

// Router
const router = new VueRouter({
    routes: [
        {path: '/', component: Home},
        {path: '*', component: Home}
    ]
});
Vue.use(VueRouter);

// Analytics
if (Helpers.inProduction() && process.env.MIX_GA_ID) {
    Vue.use(VueAnalytics, {
        id: process.env.MIX_GA_ID,
        router
    });
}

// Multi Language
Vue.use(VueI18n);
window.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: i18nEn
    },
    silentTranslationWarn: true
});

// event bus
Vue.prototype.$bus = new Vue;

window.app = new Vue({
    router,
    i18n,
    el: '#app',
    provide() {
        return {
            appData: {}
        }
    },
    data() {
        return {
            appUrl: process.env.MIX_APP_URL,
        }
    },
    async mounted() {
        this.webpSupported = this.isWebpSupported();
        this.shouldRedirectToApp();

        Vue.prototype.$stripe = await loadStripe(process.env.MIX_STRIPE_KEY);
    },
    methods: {
        isWebpSupported() {
            let elem = document.createElement('canvas');

            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }

            return false;
        },
        shouldRedirectToApp() {
            ['story', 'scenarios', 'map', 'achievements', 'info', 'campaigns', 'party', 'login', 'shared', 'states'].forEach(path => {
                if (location.hash.includes(path) || location.search.includes(path)) {
                    const newLocation = location.href.replace(process.env.MIX_WEB_URL, process.env.MIX_APP_URL);
                    location.replace(newLocation);
                }
            });
        }
    }
});
