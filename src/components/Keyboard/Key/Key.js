import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

function Key(props) {
  const { children, keyCode } = props;

  return <button data-code={keyCode} className={styles.Key}>{children}</button>;
}

Key.propTypes = {
  children: PropTypes.node.isRequired,
  keyCode: PropTypes.string.isRequired,
};

export default Key;
