import * as styles from './styles';
import * as search from './search';
import * as state from './state';

setTimeout(async () => {
	styles.init();
	search.init();
	await state.init();
}, 1000);
