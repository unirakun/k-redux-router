{
type: '@@router/PUSH', payload: { code: 'main' },
}

{
type: '@@router/PUSH', payload: { code: 'project', params: { path: { id: 2 }, query: { this: 'is', a: 'query param' }  } },
}

{
type: '@@router/PUSH', payload: { code: 'undefinedRoute' },
}
