import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

function Key(props) {
  const { children, onClick } = props;

  return <button className={styles.Key} onClick={onClick}>{children}</button>;
}

Key.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Key;
