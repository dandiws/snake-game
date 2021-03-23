import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Dandi',
		gridSize: [30,30],
		intervalTime: 100,
	}
});

export default app;