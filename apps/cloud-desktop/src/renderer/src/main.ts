// Your selected Skeleton theme:
import '@skeletonlabs/skeleton/themes/theme-rocket.css';
// This contains the bulk of Skeletons required styles:
import '@skeletonlabs/skeleton/styles/skeleton.css';

import { Root } from './components/Root'

const app = new Root({
  target: document.getElementById('app')
})

export default app
