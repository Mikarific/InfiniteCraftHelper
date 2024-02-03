import * as styles from './styles';
import * as search from './search';
import * as state from './state';

window.addEventListener(
	'load',
	async () => {
		styles.init();
		search.init();
		await state.init();
	},
	false,
);
