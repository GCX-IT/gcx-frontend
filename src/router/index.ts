import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import BlogPostView from '../views/BlogPostView.vue'
import AboutView from '../views/AboutView.vue'
import AboutLeadershipView from '../views/AboutLeadershipView.vue'
import AboutPartnershipView from '../views/AboutPartnershipView.vue'
import ContactView from '../views/ContactView.vue'
import ServiceView from '../views/ServiceView.vue'
import AMLCFTView from '../views/AMLCFTView.vue'
import MembershipView from '../views/MembershipView.vue'
import MembershipApplicationView from '../views/MembershipApplicationView.vue'
import MarketDataView from '../views/MarketDataView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import CareersView from '../views/CareersView.vue'
import JobFunctionAreaView from '../views/JobFunctionAreaView.vue'
import CommoditiesView from '../views/CommoditiesView.vue'
import VideosView from '../views/VideosView.vue'
import RTIView from '../views/RTIView.vue'
import ArchivesView from '../views/ArchivesView.vue'
import EventArchivesView from '../views/EventArchivesView.vue'
import EventDetailView from '../views/EventDetailView.vue'
import GalleryView from '../views/GalleryView.vue'
import LoginView from '../views/LoginView.vue'
import CMSView from '../views/CMSView.vue'
import SearchView from '../views/SearchView.vue'
import USSDRegisterView from '../views/USSDRegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPostView,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/about/leadership',
      name: 'about-leadership',
      component: AboutLeadershipView
    },
    {
      path: '/about/partnership',
      name: 'about-partnership',
      component: AboutPartnershipView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceView
    },
    {
      path: '/services/aml-cft',
      name: 'aml-cft',
      component: AMLCFTView
    },
    {
      path: '/membership',
      name: 'membership',
      component: MembershipView
    },
    {
      path: '/membership/application',
      name: 'membership-application',
      component: MembershipApplicationView
    },
    {
      path: '/market-data',
      name: 'market-data',
      component: MarketDataView
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesView
    },
    {
      path: '/careers',
      name: 'careers',
      component: CareersView
    },
    {
      path: '/careers/functional-areas',
      name: 'job-function-areas',
      component: JobFunctionAreaView
    },
    {
      path: '/commodities',
      name: 'commodities',
      component: CommoditiesView
    },
    {
      path: '/media',
      redirect: '/blog'
    },
    {
      path: '/media/videos',
      name: 'videos',
      component: VideosView
    },
    {
      path: '/media/archives',
      name: 'media-archives',
      component: EventArchivesView
    },
    {
      path: '/media/archives/:id',
      name: 'event-detail',
      component: EventDetailView,
      props: true
    },
    {
      path: '/media/gallery',
      name: 'media-gallery',
      component: GalleryView
    },
    {
      path: '/rti',
      name: 'rti',
      component: RTIView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/ussd-register',
      name: 'ussd-register',
      component: USSDRegisterView
    },
    {
      path: '/cms',
      name: 'cms',
      component: CMSView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'cms-dashboard',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'dashboard' }
        },
        {
          path: 'posts',
          name: 'cms-posts',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'posts' }
        },
        {
          path: 'images',
          name: 'cms-images',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'image-manager' }
        },
        {
          path: 'pages',
          name: 'cms-pages',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'pages' }
        },
        {
          path: 'content',
          name: 'cms-content',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'content-manager' }
        },
        {
          path: 'team',
          name: 'cms-team',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'team-manager' }
        },
        {
          path: 'traders',
          name: 'cms-traders',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'trader-manager' }
        },
        {
          path: 'brokers',
          name: 'cms-brokers',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'broker-manager' }
        },
        {
          path: 'partners',
          name: 'cms-partners',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'partner-manager' }
        },
        {
          path: 'publications',
          name: 'cms-publications',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'publication-manager' }
        },
        {
          path: 'careers',
          name: 'cms-careers',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'career-manager' }
        },
        {
          path: 'commodities',
          name: 'cms-commodities',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'commodity-manager' }
        },
        {
          path: 'events',
          name: 'cms-events',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'event-manager' }
        },
        {
          path: 'gallery',
          name: 'cms-gallery',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'gallery-manager' }
        },
        {
          path: 'video',
          name: 'cms-video',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'video-manager' }
        },
        {
          path: 'rti',
          name: 'cms-rti',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'rti-manager' }
        },
        {
          path: 'news',
          name: 'cms-news',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'news-manager' }
        },
        {
          path: 'market-data',
          name: 'cms-market-data',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'market-data' }
        },
        {
          path: 'users',
          name: 'cms-users',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'users' }
        },
        {
          path: 'analytics',
          name: 'cms-analytics',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'analytics' }
        },
        {
          path: 'settings',
          name: 'cms-settings',
          component: () => import('../views/CMSView.vue'),
          meta: { section: 'settings' }
        }
      ]
    },
  ]
})

// Navigation guard for protected routes and page transitions
router.beforeEach(async (to, from, next) => {
  const { useAuth } = await import('../composables/useAuth')
  const { initializeAuth, isAuthenticated } = useAuth()
  
  // Initialize auth if not already done
  if (!isAuthenticated.value && localStorage.getItem('auth_token')) {
    await initializeAuth()
  }
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else {
    next()
  }
})

export default router 