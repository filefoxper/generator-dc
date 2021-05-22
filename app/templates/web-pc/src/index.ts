import React, {createElement} from 'react';
import {render} from "react-dom";
import Layout from '@/layout';

const element = document.getElementById('root');

render((
    createElement(Layout)
), element);
