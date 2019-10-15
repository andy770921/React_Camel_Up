import React from 'react';
import About from '../src/components/about';
import renderer from 'react-test-renderer';
import { HashRouter } from 'react-router-dom';

it('renders correctly', () => {
  const tree = renderer
    .create( <HashRouter><About /></HashRouter> )
    .toJSON();
  expect(tree).toMatchSnapshot();
});