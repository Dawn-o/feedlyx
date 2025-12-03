import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import LatestArticles from "@/views/LatestArticles.vue";
import TopArticles from "@/views/TopArticles.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import Search from "@/views/Search.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/latest",
    name: "Latest",
    component: () => LatestArticles,
  },
  {
    path: "/top",
    name: "Top",
    component: () => TopArticles,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/:username/:slug",
    name: "ArticleDetail",
    component: ArticleDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
