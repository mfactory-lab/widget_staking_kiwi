import { createHead } from '@vueuse/head';
import { App } from 'vue';

export const install = ({ app }: { app: App<Element> }) => {
  const head = createHead();
  app.use(head);
};
