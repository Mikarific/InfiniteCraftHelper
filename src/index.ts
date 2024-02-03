import * as styles from './styles';
import * as search from './search';
import * as state from './state';
import * as logo from './logo';

window.addEventListener(
	'load',
	async () => {
		styles.init();
		search.init();
		await state.init();
		logo.init();
	},
	false,
);
