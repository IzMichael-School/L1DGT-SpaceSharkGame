// https://github.com/jorgegorka/svelte-router/blob/master/README.md

import Index from './routes/Index.svelte';
import NotFound from './routes/NotFound.svelte';

const routes = [
    {
        name: '/',
        component: Index,
    },
    {
        name: '404',
        component: NotFound
    }
]

export { routes }