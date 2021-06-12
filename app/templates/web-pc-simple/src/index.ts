import { createElement } from 'react';
import { render } from 'react-dom';
import Layout from '@/layout';

const element = window.document.getElementById('root');

render(createElement(Layout), element);
