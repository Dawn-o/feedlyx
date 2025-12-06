import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Latest from "@/views/Latest.vue";
import Top from "@/views/Top.vue";
import Tag from "@/views/Tag.vue";
import Search from "@/views/Search.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/latest",
    name: "Latest",
    component: () => Latest,
  },
  {
    path: "/top",
    name: "Top",
    component: () => Top,
  },
  {
    path: "/t/:tags/page/:page",
    name: "TagPage",
    component: () => Tag,
  },
  {
    path: "/t/:tags",
    name: "Tags",
    component: () => Tag,
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
