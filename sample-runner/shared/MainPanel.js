import kind from '@enact/core/kind.js';
import EnactLiveEdit from './EnactLiveEdit.js';

const MainPanel = kind({
	name: 'Main',

	render: (props) => (
		<EnactLiveEdit {...props} />
	)
});

export default MainPanel;
